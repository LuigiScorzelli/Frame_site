import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";
import { verificaTurnstile } from "./turnstile";

const risposta = (corpo: unknown, status = 200) => new Response(JSON.stringify(corpo), { status });

beforeEach(() => {
  process.env.TURNSTILE_SECRET_KEY = "segreta-di-test";
  vi.spyOn(console, "warn").mockImplementation(() => {});
  vi.spyOn(console, "error").mockImplementation(() => {});
});

afterEach(() => {
  delete process.env.TURNSTILE_SECRET_KEY;
  vi.restoreAllMocks();
  vi.unstubAllGlobals();
});

describe("verificaTurnstile", () => {
  it("is off without the secret key: every request passes and Cloudflare is not called", async () => {
    delete process.env.TURNSTILE_SECRET_KEY;
    const fetchFinto = vi.fn();
    vi.stubGlobal("fetch", fetchFinto);
    expect(await verificaTurnstile(undefined)).toBe(true);
    expect(fetchFinto).not.toHaveBeenCalled();
  });

  it("refuses a missing, empty, non-string or over-long token without calling Cloudflare", async () => {
    const fetchFinto = vi.fn();
    vi.stubGlobal("fetch", fetchFinto);
    for (const t of [undefined, null, "", 42, ["a"], "x".repeat(2049)]) expect(await verificaTurnstile(t)).toBe(false);
    expect(fetchFinto).not.toHaveBeenCalled();
  });

  it("sends secret and token to siteverify and accepts a successful answer", async () => {
    const fetchFinto = vi.fn().mockResolvedValue(risposta({ success: true }));
    vi.stubGlobal("fetch", fetchFinto);
    expect(await verificaTurnstile("token-buono")).toBe(true);
    const [url, opzioni] = fetchFinto.mock.calls[0];
    expect(url).toBe("https://challenges.cloudflare.com/turnstile/v0/siteverify");
    expect(JSON.parse(opzioni.body)).toEqual({ secret: "segreta-di-test", response: "token-buono" });
  });

  it("refuses an invalid, expired or already used token", async () => {
    for (const codice of ["invalid-input-response", "timeout-or-duplicate"]) {
      vi.stubGlobal("fetch", vi.fn().mockResolvedValue(risposta({ success: false, "error-codes": [codice] })));
      expect(await verificaTurnstile("token"), codice).toBe(false);
    }
  });

  it("refuses and logs when the secret key is wrong", async () => {
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(risposta({ success: false, "error-codes": ["invalid-input-secret"] })));
    expect(await verificaTurnstile("token")).toBe(false);
    expect(console.error).toHaveBeenCalled();
  });

  it("lets the request pass when Cloudflare is down, so an outage there does not close the forms", async () => {
    vi.stubGlobal("fetch", vi.fn().mockRejectedValue(new Error("network")));
    expect(await verificaTurnstile("token")).toBe(true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(risposta({}, 503)));
    expect(await verificaTurnstile("token")).toBe(true);
    vi.stubGlobal("fetch", vi.fn().mockResolvedValue(risposta({ success: false, "error-codes": ["internal-error"] })));
    expect(await verificaTurnstile("token")).toBe(true);
  });
});
