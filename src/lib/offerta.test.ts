import { describe, expect, it } from "vitest";
import { offertaAperta, validaCandidatura } from "./offerta";

const valida = {
  nome: "Mario Rossi",
  azienda: "Rossi Servizi",
  email: " Mario@Esempio.it ",
  sito: "https://esempio.it",
  agente: "preventivi",
  processo: "Oggi leggiamo le email a mano e rispondiamo il giorno dopo.",
  volume: "circa 30",
  workspace: "si",
  consenso: true,
};

describe("offertaAperta", () => {
  it("is open today and on the last day in Italy", () => {
    expect(offertaAperta(new Date("2026-11-20T12:00:00Z"))).toBe(true);
    // 23:30 in Italy on 31 March (CEST, UTC+2).
    expect(offertaAperta(new Date("2027-03-31T21:30:00Z"))).toBe(true);
  });

  it("closes at midnight in Italy, not in UTC", () => {
    // 00:30 in Italy on 1 April is still 31 March in UTC.
    expect(offertaAperta(new Date("2027-03-31T22:30:00Z"))).toBe(false);
    expect(offertaAperta(new Date("2027-04-01T09:00:00Z"))).toBe(false);
  });
});

describe("validaCandidatura", () => {
  it("accepts a complete application and normalises the email", () => {
    const r = validaCandidatura(valida);
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.dati.email).toBe("mario@esempio.it");
      expect(r.dati.aggiornamenti).toBe(false);
    }
  });

  it("requires the contact consent as a real boolean", () => {
    const r = validaCandidatura({ ...valida, consenso: "true" });
    expect(r.ok).toBe(false);
    if (!r.ok) expect(r.errori.consenso).toBeDefined();
  });

  it("subscribes to updates only with an explicit true", () => {
    const si = validaCandidatura({ ...valida, aggiornamenti: true });
    const no = validaCandidatura({ ...valida, aggiornamenti: "on" });
    expect(si.ok && si.dati.aggiornamenti).toBe(true);
    expect(no.ok && no.dati.aggiornamenti).toBe(false);
  });

  it("rejects unknown agent and workspace values", () => {
    const r = validaCandidatura({ ...valida, agente: "su-misura", workspace: "forse" });
    expect(r.ok).toBe(false);
    if (!r.ok) {
      expect(r.errori.agente).toBeDefined();
      expect(r.errori.workspace).toBeDefined();
    }
  });

  it("reports every missing required field", () => {
    const r = validaCandidatura({});
    expect(r.ok).toBe(false);
    if (!r.ok) expect(Object.keys(r.errori).sort()).toEqual(["agente", "azienda", "consenso", "email", "nome", "processo", "workspace"]);
  });

  it("keeps optional fields optional and bounded", () => {
    const r = validaCandidatura({ ...valida, sito: undefined, volume: "x".repeat(500) });
    expect(r.ok).toBe(true);
    if (r.ok) {
      expect(r.dati.sito).toBe("");
      expect(r.dati.volume).toHaveLength(80);
    }
  });
});
