import { describe, expect, it, vi } from "vitest";

// Fake DNS: "privato.test" resolves to loopback, "misto.test" to one public and one private address.
vi.mock("node:dns", async (originale) => {
  const vero = await originale<typeof import("node:dns")>();
  const tabella: Record<string, { address: string; family: number }[]> = {
    "privato.test": [{ address: "127.0.0.1", family: 4 }],
    "metadati.test": [{ address: "169.254.169.254", family: 4 }],
    "misto.test": [
      { address: "93.184.215.14", family: 4 },
      { address: "10.0.0.5", family: 4 },
    ],
    "pubblico.test": [{ address: "93.184.215.14", family: 4 }],
  };
  const lookup = (host: string, _opzioni: unknown, cb: (e: Error | null, a: unknown) => void) => {
    const r = tabella[host];
    if (r) return cb(null, r);
    return cb(Object.assign(new Error("ENOTFOUND"), { code: "ENOTFOUND" }), []);
  };
  return { ...vero, default: { ...vero, lookup }, lookup };
});

const { ErroreCheckup, ipVietato, lookupSicuro, normalizzaUrl, scaricaPagina } = await import("./rete");

function codice(fn: () => unknown): string | null {
  try {
    fn();
    return null;
  } catch (e) {
    return e instanceof ErroreCheckup ? e.codice : "altro";
  }
}

describe("ipVietato", () => {
  it.each([
    "0.0.0.0", "10.1.2.3", "100.64.0.1", "127.0.0.1", "169.254.169.254", "172.16.0.1", "172.31.255.255",
    "192.168.1.1", "192.0.2.1", "198.18.0.1", "224.0.0.1", "255.255.255.255",
    "::", "::1", "fc00::1", "fd12:3456::1", "fe80::1", "ff02::1", "64:ff9b::7f00:1", "2001:db8::1", "2002:7f00:1::1",
    "::ffff:127.0.0.1", "::ffff:7f00:1", "::ffff:10.0.0.1", "[::1]", "non-un-ip",
  ])("forbids %s", (ip) => {
    expect(ipVietato(ip)).toBe(true);
  });

  it.each(["93.184.215.14", "8.8.8.8", "172.32.0.1", "2a00:1450:4002:80a::200e", "::ffff:8.8.8.8"])("allows %s", (ip) => {
    expect(ipVietato(ip)).toBe(false);
  });
});

describe("normalizzaUrl", () => {
  it("adds https and drops the fragment", () => {
    expect(normalizzaUrl("esempio.it").href).toBe("https://esempio.it/");
    expect(normalizzaUrl("  http://www.esempio.it/chi-siamo#team ").href).toBe("http://www.esempio.it/chi-siamo");
  });

  it.each([
    ["ftp://esempio.it", "url_non_valido"],
    ["file:///etc/passwd", "url_non_valido"],
    ["javascript:alert(1)", "url_non_valido"],
    ["https://user:pass@esempio.it", "url_non_valido"],
    ["https://esempio.it:8080/", "url_non_valido"],
    ["esempio.it:22", "url_non_valido"],
    ["", "url_non_valido"],
    ["http://localhost/", "indirizzo_vietato"],
    ["http://intranet/", "indirizzo_vietato"],
    ["http://server.local/", "indirizzo_vietato"],
    ["http://127.0.0.1/", "indirizzo_vietato"],
    ["http://2130706433/", "indirizzo_vietato"],
    ["http://0x7f.0.0.1/", "indirizzo_vietato"],
    ["http://[::1]/", "indirizzo_vietato"],
    ["http://[::ffff:169.254.169.254]/", "indirizzo_vietato"],
    ["http://169.254.169.254/latest/meta-data/", "indirizzo_vietato"],
  ])("%s → %s", (url, atteso) => {
    expect(codice(() => normalizzaUrl(url))).toBe(atteso);
  });
});

describe("lookupSicuro (DNS checked at connect time)", () => {
  const risolvi = (host: string, all = false) =>
    new Promise<unknown>((ok, ko) =>
      lookupSicuro(host, { all }, (err: NodeJS.ErrnoException | null, indirizzo: unknown) => (err ? ko(err) : ok(indirizzo))),
    );

  it("refuses a name that resolves to loopback or cloud metadata", async () => {
    await expect(risolvi("privato.test")).rejects.toMatchObject({ codice: "indirizzo_vietato" });
    await expect(risolvi("metadati.test")).rejects.toMatchObject({ codice: "indirizzo_vietato" });
  });

  it("refuses when any of the addresses is private", async () => {
    await expect(risolvi("misto.test", true)).rejects.toMatchObject({ codice: "indirizzo_vietato" });
  });

  it("returns public addresses in both callback forms", async () => {
    await expect(risolvi("pubblico.test")).resolves.toBe("93.184.215.14");
    await expect(risolvi("pubblico.test", true)).resolves.toEqual([{ address: "93.184.215.14", family: 4 }]);
  });
});

describe("scaricaPagina", () => {
  it("does not connect to a host that resolves to a private address", async () => {
    await expect(scaricaPagina(new URL("http://privato.test/"))).rejects.toMatchObject({ codice: "indirizzo_vietato" });
  });

  it("treats an unknown host as unreachable", async () => {
    await expect(scaricaPagina(new URL("http://inesistente.test/"))).rejects.toMatchObject({ codice: "irraggiungibile" });
  });
});
