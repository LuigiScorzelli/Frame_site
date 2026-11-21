import { describe, expect, it } from "vitest";
import { campoEmail, emailValida, riga, testo } from "./input";

describe("emailValida", () => {
  it("accepts ordinary addresses and refuses malformed ones", () => {
    expect(emailValida("mario@esempio.it")).toBe(true);
    for (const e of ["", "mario", "mario@esempio", "a b@esempio.it", "a@b@esempio.it", "mario@esempio.i"]) {
      expect(emailValida(e), e).toBe(false);
    }
  });

  it("refuses long crafted input at once, without running the regex on it", () => {
    const ostile = "a@" + "a.".repeat(500_000) + "@";
    const inizio = performance.now();
    expect(emailValida(ostile)).toBe(false);
    expect(performance.now() - inizio).toBeLessThan(50);
  });
});

describe("campoEmail", () => {
  it("trims but never cuts, so an over-long string stays invalid instead of becoming an address", () => {
    expect(campoEmail("  mario@esempio.it ")).toBe("mario@esempio.it");
    const lunga = "a@" + "a.".repeat(1000) + "it";
    expect(campoEmail(lunga)).toHaveLength(lunga.length);
    expect(emailValida(campoEmail(lunga))).toBe(false);
    expect(campoEmail(null)).toBe("");
  });
});

describe("riga and testo", () => {
  it("riga removes line breaks and invisible characters, so a name cannot forge a header", () => {
    expect(riga("Mario\r\nBcc: x@y.it", 120)).toBe("Mario Bcc: x@y.it");
    expect(riga("ACME\u0000\u202E srl\u200B", 160)).toBe("ACME srl");
  });

  it("testo keeps line breaks and removes invisible characters", () => {
    expect(testo("riga 1\r\nriga 2\u0007", 100)).toBe("riga 1\nriga 2");
  });

  it("both trim, cut to the limit and turn non-strings into an empty string", () => {
    expect(riga("  " + "x".repeat(300), 120)).toHaveLength(120);
    expect(testo("x".repeat(6000), 5000)).toHaveLength(5000);
    expect(riga(42, 10)).toBe("");
    expect(testo({ a: 1 }, 10)).toBe("");
  });
});
