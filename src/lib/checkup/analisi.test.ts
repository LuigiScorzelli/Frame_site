import { readFileSync } from "node:fs";
import { join } from "node:path";
import { describe, expect, it } from "vitest";
import { linkContatti, rileva, valuta, type IdVoce } from "./analisi";

const fixture = (nome: string) => readFileSync(join(__dirname, "fixtures", nome), "utf8");
const home = (nome: string) => ({ html: fixture(nome), link: "" });

function punti(nomeHome: string, nomeContatti?: string): Record<IdVoce, number> & { totale: number } {
  const { punteggio, voci } = valuta(rileva(home(nomeHome), nomeContatti ? { html: fixture(nomeContatti) } : null));
  return { ...(Object.fromEntries(voci.map((v) => [v.id, v.punti])) as Record<IdVoce, number>), totale: punteggio };
}

describe("valuta: 5 items, 0-20 each, on 10 sample pages", () => {
  it("01 complete site scores 100", () => {
    expect(punti("01-completo.html")).toEqual({ contatto: 20, fuori_orario: 20, promessa: 20, telefono: 20, informativa: 20, totale: 100 });
  });

  it("02 empty page: only the not-applicable form parts score", () => {
    expect(punti("02-vuoto.html")).toEqual({ contatto: 0, fuori_orario: 0, promessa: 0, telefono: 5, informativa: 10, totale: 15 });
  });

  it("03 chat only, no form", () => {
    expect(punti("03-solo-chat.html")).toEqual({ contatto: 6, fuori_orario: 10, promessa: 0, telefono: 20, informativa: 20, totale: 56 });
  });

  it("04 form with 12 fields loses the phone points and has no consent", () => {
    expect(punti("04-modulo-lungo.html")).toEqual({ contatto: 0, fuori_orario: 10, promessa: 0, telefono: 15, informativa: 10, totale: 35 });
  });

  it("05 zoom blocked, hours without promise", () => {
    expect(punti("05-zoom-bloccato.html")).toEqual({ contatto: 8, fuori_orario: 0, promessa: 8, telefono: 15, informativa: 10, totale: 41 });
  });

  it("06 our plugin gives full out-of-hours points and WordPress is detected", () => {
    const r = rileva(home("06-plugin-wpla.html"), null);
    expect(r.plugin).toBe(true);
    expect(r.wordpress).toBe(true);
    expect(punti("06-plugin-wpla.html")).toEqual({ contatto: 14, fuori_orario: 20, promessa: 0, telefono: 20, informativa: 20, totale: 74 });
  });

  it("07 Contact Form 7 without consent and without privacy link", () => {
    expect(punti("07-modulo-senza-consenso.html")).toEqual({ contatto: 0, fuori_orario: 10, promessa: 12, telefono: 20, informativa: 0, totale: 42 });
  });

  it("08 search and newsletter forms are not contact forms", () => {
    const r = rileva(home("08-newsletter-e-ricerca.html"), null);
    expect(r.moduli).toEqual([]);
    expect(r.privacy).toBe("pagina");
    expect(punti("08-newsletter-e-ricerca.html")).toEqual({ contatto: 0, fuori_orario: 0, promessa: 8, telefono: 20, informativa: 20, totale: 48 });
  });

  it("09 external form provider and WhatsApp", () => {
    const r = rileva(home("09-modulo-esterno.html"), null);
    expect(r.moduloEsterno).toBe("HubSpot Forms");
    expect(r.chat).toEqual(["WhatsApp"]);
    expect(punti("09-modulo-esterno.html")).toEqual({ contatto: 6, fuori_orario: 20, promessa: 0, telefono: 20, informativa: 20, totale: 66 });
  });

  it("10 the contact page adds form, consent, promise and hours", () => {
    const r = rileva(home("03-solo-chat.html"), { html: fixture("10-contatti.html") });
    expect(r.moduli).toEqual([{ pagina: "contatti", campi: 3, consenso: true }]);
    expect(punti("03-solo-chat.html", "10-contatti.html")).toEqual({
      contatto: 6, fuori_orario: 20, promessa: 20, telefono: 20, informativa: 20, totale: 86,
    });
  });

  it("every item has an explanation and a remedy", () => {
    for (const f of ["01-completo.html", "02-vuoto.html", "04-modulo-lungo.html", "09-modulo-esterno.html"]) {
      for (const v of valuta(rileva(home(f), null)).voci) {
        expect(v.max).toBe(20);
        expect(v.spiegazione.length).toBeGreaterThan(20);
        expect(v.rimedio.length).toBeGreaterThan(5);
        expect(v.spiegazione).not.toMatch(/undefined|null/);
      }
    }
  });
});

describe("promise remedy", () => {
  const rimedio = (f: string) => valuta(rileva(home(f), null)).voci.find((v) => v.id === "promessa")!.rimedio;

  it("points near the form only when there is one", () => {
    expect(rimedio("04-modulo-lungo.html")).toContain("vicino al modulo");
    expect(rimedio("02-vuoto.html")).toContain("nella pagina contatti o nel footer");
    expect(rimedio("02-vuoto.html")).not.toContain("modulo");
  });
});

describe("linkContatti", () => {
  it("finds the menu link on the same site", () => {
    expect(linkContatti(fixture("01-completo.html"), new URL("https://www.rossi.it/"))?.href).toBe("https://www.rossi.it/contatti/");
  });

  it("ignores contact links to other sites", () => {
    const html = '<a href="https://altro.it/contatti">Contatti</a>';
    expect(linkContatti(html, new URL("https://rossi.it/"))).toBeNull();
  });
});
