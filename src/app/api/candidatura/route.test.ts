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

// No Upstash either: the store is replaced and records the calls.
const archivioAttivo = vi.fn();
const salva = vi.fn();
const segna = vi.fn();
vi.mock("@/lib/candidature", () => ({
  archivioCandidatureAttivo: () => archivioAttivo(),
  salvaCandidatura: (...a: unknown[]) => salva(...a),
  segnaEmailAgenzia: (...a: unknown[]) => segna(...a),
}));

import { CAMPO_TRAPPOLA } from "@/lib/offerta";
import { POST } from "./route";

const CHIAVE = "candidatura:2026-12-01T10:00:00.000Z:abc";

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
  archivioAttivo.mockReset().mockReturnValue(true);
  salva.mockReset().mockResolvedValue(CHIAVE);
  segna.mockReset().mockResolvedValue(undefined);
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  vi.useRealTimers();
  vi.restoreAllMocks();
});

describe("POST /api/candidatura", () => {
  it("saves, emails the agency with escaped HTML, sends the receipt and skips Brevo without the updates consent", async () => {
    const res = await POST(richiesta(valida));
    expect(res.status).toBe(200);
    expect(salva).toHaveBeenCalledTimes(1);
    expect(salva.mock.calls[0][0]).toMatchObject({ email: "mario@esempio.it", azienda: "Rossi <b>Servizi</b>" });
    expect(invia).toHaveBeenCalledTimes(2);
    const agenzia = invia.mock.calls[0][0];
    expect(agenzia.replyTo).toBe("mario@esempio.it");
    expect(agenzia.html).toContain("Rossi &lt;b&gt;Servizi&lt;/b&gt;");
    expect(agenzia.html).not.toContain("<b>Servizi</b>");
    expect(agenzia.html).toContain(CHIAVE);
    const ricevuta = invia.mock.calls[1][0];
    expect(ricevuta.to).toBe("mario@esempio.it");
    // The receipt goes to an unverified address: nothing typed by the visitor is repeated in it.
    expect(ricevuta.html).not.toContain("Rossi");
    expect(ricevuta.html).not.toContain("Mario");
    expect(segna).toHaveBeenCalledWith(CHIAVE, "inviata");
    expect(creaContattoDoi).not.toHaveBeenCalled();
  });

  it("saves before emailing the agency", async () => {
    const ordine: string[] = [];
    salva.mockImplementation(async () => (ordine.push("salva"), CHIAVE));
    invia.mockImplementation(async () => (ordine.push("email"), { error: null }));
    await POST(richiesta(valida));
    expect(ordine.slice(0, 2)).toEqual(["salva", "email"]);
  });

  it("answers 502 and sends no email when saving fails", async () => {
    salva.mockRejectedValue(new Error("redis down"));
    const res = await POST(richiesta(valida));
    expect(res.status).toBe(502);
    expect(invia).not.toHaveBeenCalled();
  });

  it("answers 503 when Upstash is not configured", async () => {
    archivioAttivo.mockReturnValue(false);
    const res = await POST(richiesta(valida));
    expect(res.status).toBe(503);
    expect(salva).not.toHaveBeenCalled();
    expect(invia).not.toHaveBeenCalled();
  });

  it("still succeeds when only the receipt to the applicant fails", async () => {
    invia.mockResolvedValueOnce({ error: null }).mockResolvedValueOnce({ error: { name: "validation_error" } });
    const res = await POST(richiesta(valida));
    expect(res.status).toBe(200);
  });

  it("answers 502 and marks the saved copy when the agency email throws", async () => {
    invia.mockRejectedValue(new Error("network"));
    const res = await POST(richiesta(valida));
    expect(res.status).toBe(502);
    expect(segna).toHaveBeenCalledWith(CHIAVE, "non_inviata");
  });

  it("adds the contact to Brevo with FONTE=offerta only when updates are requested", async () => {
    // Its own address: the per-recipient limit (3 a day) is shared by the tests that use "valida".
    const res = await POST(richiesta({ ...valida, email: "aggiornamenti@esempio.it", aggiornamenti: true }));
    expect(res.status).toBe(200);
    expect(creaContattoDoi).toHaveBeenCalledWith(expect.anything(), "aggiornamenti@esempio.it", { FONTE: "offerta" });
  });

  it("still succeeds when Brevo fails after the email was sent", async () => {
    creaContattoDoi.mockRejectedValue(new Error("timeout"));
    const res = await POST(richiesta({ ...valida, email: "brevo-giu@esempio.it", aggiornamenti: true }));
    expect(res.status).toBe(200);
  });

  it("sends at most 3 receipts a day to the same address, while every application still reaches the agency", async () => {
    const stessa = { ...valida, email: "bersaglio@esempio.it", aggiornamenti: true };
    for (let i = 0; i < 4; i++) expect((await POST(richiesta(stessa))).status).toBe(200);
    const destinatari = invia.mock.calls.map((c) => c[0].to);
    expect(destinatari.filter((d) => d === "bersaglio@esempio.it")).toHaveLength(3);
    expect(destinatari.filter((d) => d !== "bersaglio@esempio.it")).toHaveLength(4);
    expect(creaContattoDoi).toHaveBeenCalledTimes(3);
  });

  it("with Turnstile on, answers 403 and saves nothing when the token is missing or refused", async () => {
    process.env.TURNSTILE_SECRET_KEY = "segreta-di-test";
    const fetchFinto = vi.fn().mockResolvedValue(new Response(JSON.stringify({ success: false, "error-codes": ["invalid-input-response"] })));
    vi.stubGlobal("fetch", fetchFinto);
    try {
      expect((await POST(richiesta(valida))).status).toBe(403);
      expect((await POST(richiesta({ ...valida, turnstile: "token-falso" }))).status).toBe(403);
      expect(fetchFinto).toHaveBeenCalledTimes(1);
      expect(salva).not.toHaveBeenCalled();
      expect(invia).not.toHaveBeenCalled();

      fetchFinto.mockResolvedValue(new Response(JSON.stringify({ success: true })));
      expect((await POST(richiesta({ ...valida, email: "turnstile@esempio.it", turnstile: "token-buono" }))).status).toBe(200);
      expect(salva).toHaveBeenCalledTimes(1);
    } finally {
      delete process.env.TURNSTILE_SECRET_KEY;
      vi.unstubAllGlobals();
    }
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
    expect(invia).toHaveBeenCalledTimes(1);
    expect(segna).toHaveBeenCalledWith(CHIAVE, "non_inviata");
    expect(creaContattoDoi).not.toHaveBeenCalled();
  });

  it("answers 410 after the last day", async () => {
    vi.setSystemTime(new Date("2027-04-02T10:00:00Z"));
    const res = await POST(richiesta(valida));
    expect(res.status).toBe(410);
    expect(invia).not.toHaveBeenCalled();
  });

  it("gives bots that fill the honeypot a silent 200, with the new and the old field name", async () => {
    for (const campo of [CAMPO_TRAPPOLA, "sito_web"]) {
      const res = await POST(richiesta({ ...valida, [campo]: "https://spam.example" }));
      expect(res.status).toBe(200);
    }
    expect(salva).not.toHaveBeenCalled();
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
