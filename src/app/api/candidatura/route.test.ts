import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

// No network in these tests: Resend and Brevo are replaced, so no email leaves the machine.
const invia = vi.fn();
vi.mock("resend", () => ({
  Resend: class {
    emails = { send: invia };
  },
}));
const creaContattoDoi = vi.fn();
vi.mock("@/lib/brevo", () => ({
  configBrevo: () => ({ apiKey: "k", listId: 1, templateId: 1, redirectUrl: "https://esempio.it/grazie" }),
  creaContattoDoi: (...a: unknown[]) => creaContattoDoi(...a),
}));

import { POST } from "./route";

const valida = {
  nome: "Mario Rossi",
  azienda: "Rossi <b>Servizi</b>",
  email: "mario@esempio.it",
  agente: "preventivi",
  processo: "Oggi leggiamo le email a mano e rispondiamo il giorno dopo.",
  workspace: "si",
  consenso: true,
};

let ip = 0;
const richiesta = (body: unknown) =>
  new Request("http://localhost/api/candidatura", {
    method: "POST",
    // A fresh IP per request keeps the rate limiter out of these tests.
    headers: { "content-type": "application/json", "x-forwarded-for": `203.0.113.${++ip}` },
    body: JSON.stringify(body),
  });

beforeEach(() => {
  vi.useFakeTimers({ toFake: ["Date"] });
  vi.setSystemTime(new Date("2026-12-01T10:00:00Z"));
  process.env.RESEND_API_KEY = "re_test";
  invia.mockReset().mockResolvedValue({ error: null });
  creaContattoDoi.mockReset().mockResolvedValue({ ok: true });
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("POST /api/candidatura", () => {
  it("emails the application with escaped HTML and skips Brevo without the updates consent", async () => {
    const res = await POST(richiesta(valida));
    expect(res.status).toBe(200);
    expect(invia).toHaveBeenCalledTimes(1);
    const email = invia.mock.calls[0][0];
    expect(email.replyTo).toBe("mario@esempio.it");
    expect(email.html).toContain("Rossi &lt;b&gt;Servizi&lt;/b&gt;");
    expect(email.html).not.toContain("<b>Servizi</b>");
    expect(creaContattoDoi).not.toHaveBeenCalled();
  });

  it("adds the contact to Brevo with FONTE=offerta only when updates are requested", async () => {
    const res = await POST(richiesta({ ...valida, aggiornamenti: true }));
    expect(res.status).toBe(200);
    expect(creaContattoDoi).toHaveBeenCalledWith(expect.anything(), "mario@esempio.it", { FONTE: "offerta" });
  });

  it("still succeeds when Brevo fails after the email was sent", async () => {
    creaContattoDoi.mockRejectedValue(new Error("timeout"));
    const res = await POST(richiesta({ ...valida, aggiornamenti: true }));
    expect(res.status).toBe(200);
  });

  it("answers 400 with field errors and sends nothing", async () => {
    const res = await POST(richiesta({ ...valida, consenso: false }));
    expect(res.status).toBe(400);
    expect((await res.json()).errori.consenso).toBeDefined();
    expect(invia).not.toHaveBeenCalled();
  });

  it("answers 503, not a fake success, when Resend is not configured", async () => {
    delete process.env.RESEND_API_KEY;
    const res = await POST(richiesta(valida));
    expect(res.status).toBe(503);
    expect(invia).not.toHaveBeenCalled();
  });

  it("answers 502 when Resend reports an error", async () => {
    invia.mockResolvedValue({ error: { name: "validation_error" } });
    const res = await POST(richiesta(valida));
    expect(res.status).toBe(502);
    expect(creaContattoDoi).not.toHaveBeenCalled();
  });

  it("answers 410 after the last day", async () => {
    vi.setSystemTime(new Date("2027-04-02T10:00:00Z"));
    const res = await POST(richiesta(valida));
    expect(res.status).toBe(410);
    expect(invia).not.toHaveBeenCalled();
  });

  it("gives bots that fill the honeypot a silent 200", async () => {
    const res = await POST(richiesta({ ...valida, sito_web: "https://spam.example" }));
    expect(res.status).toBe(200);
    expect(invia).not.toHaveBeenCalled();
  });

  it("answers 429 on the sixth request in a minute from the same IP", async () => {
    const stessoIp = () =>
      new Request("http://localhost/api/candidatura", {
        method: "POST",
        headers: { "content-type": "application/json", "x-forwarded-for": "198.51.100.7" },
        body: JSON.stringify({}),
      });
    const stati: number[] = [];
    for (let i = 0; i < 6; i++) stati.push((await POST(stessoIp())).status);
    expect(stati).toEqual([400, 400, 400, 400, 400, 429]);
  });
});
