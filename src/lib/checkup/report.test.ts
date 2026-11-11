import { describe, expect, it } from "vitest";
import type { RisultatoCheckup } from "./index";
import { htmlReport, oggettoReport, proponiPlugin, testoReport, vociDaSistemare } from "./report";

const base: RisultatoCheckup = {
  punteggio: 42,
  sito: "https://www.esempio.it/",
  wordpress: true,
  paginaContatti: null,
  analizzatoIl: "2026-11-11T10:00:00.000Z",
  voci: [
    { id: "contatto", nome: "Contatto in un clic", punti: 20, max: 20, spiegazione: "ok", rimedio: "niente" },
    { id: "fuori_orario", nome: "Scrivere fuori orario", punti: 0, max: 20, spiegazione: "<script>x</script>", rimedio: "r" },
    { id: "promessa", nome: "Promessa di risposta", punti: 8, max: 20, spiegazione: "s", rimedio: "r" },
    { id: "telefono", nome: "Da telefono", punti: 20, max: 20, spiegazione: "s", rimedio: "r" },
    { id: "informativa", nome: "Informativa chiara", punti: 10, max: 20, spiegazione: "s", rimedio: "r" },
  ],
};

describe("report email", () => {
  it("keeps the 3 lowest items, lowest first", () => {
    expect(vociDaSistemare(base).map((v) => v.id)).toEqual(["fuori_orario", "promessa", "informativa"]);
  });

  it("escapes text and never links the visitor's site", () => {
    const html = htmlReport({ ...base, sito: 'https://www.esempio.it/"><img src=x>' });
    expect(html).not.toContain("<script>x</script>");
    expect(html).toContain("&lt;script&gt;");
    expect(html).not.toMatch(/href="https?:\/\/(www\.)?esempio\.it/);
    expect(html).toContain("esempio.it: 42/100");
  });

  it("subject has host and score", () => {
    expect(oggettoReport(base)).toBe("Il check-up di esempio.it: 42/100");
  });

  it("pitches the plugin only to WordPress sites that lose out-of-hours points", () => {
    expect(proponiPlugin(base)).toBe(true);
    expect(htmlReport(base)).toContain("Installa gratis");

    const conPlugin = { ...base, voci: base.voci.map((v) => (v.id === "fuori_orario" ? { ...v, punti: 20 } : v)) };
    expect(proponiPlugin(conPlugin)).toBe(false);
    expect(htmlReport(conPlugin)).not.toContain("fuori orario\" si sistema");
    expect(htmlReport(conPlugin)).not.toContain("Installa gratis");
    expect(testoReport(conPlugin)).not.toContain("Installa gratis");
    expect(htmlReport(conPlugin)).toContain("Prenota 30 minuti");

    const nonWordpress = { ...base, wordpress: false };
    expect(proponiPlugin(nonWordpress)).toBe(false);
    expect(htmlReport(nonWordpress)).not.toContain("Installa gratis");
  });
});
