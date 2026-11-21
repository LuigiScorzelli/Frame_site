import { beforeEach, describe, expect, it, vi } from "vitest";

// Fake Upstash client: a Map that remembers the options of each set(). vi.hoisted: vi.mock runs first.
const { dati, opzioni, redisFinto } = vi.hoisted(() => {
  const dati = new Map<string, unknown>();
  const opzioni = new Map<string, unknown>();
  const redisFinto = {
    set: vi.fn(async (k: string, v: unknown, o: unknown) => {
      dati.set(k, v);
      opzioni.set(k, o);
      return "OK";
    }),
    get: vi.fn(async (k: string) => dati.get(k) ?? null),
  };
  return { dati, opzioni, redisFinto };
});
vi.mock("@/lib/ratelimit", () => ({ redis: redisFinto }));

import { CONSERVAZIONE_CANDIDATURA_S, salvaCandidatura, segnaEmailAgenzia } from "./candidature";
import type { Candidatura } from "./offerta";

const c: Candidatura = {
  nome: "Mario Rossi",
  azienda: "Rossi Servizi",
  email: "mario@esempio.it",
  sito: "",
  agente: "preventivi",
  processo: "A mano.",
  volume: "",
  workspace: "si",
  aggiornamenti: false,
};

beforeEach(() => {
  dati.clear();
  opzioni.clear();
  vi.spyOn(console, "error").mockImplementation(() => {});
});

describe("candidature", () => {
  it("saves one key per application, dated, with a 6-month expiry", async () => {
    const chiave = await salvaCandidatura(c, new Date("2026-12-01T10:00:00Z"));
    expect(chiave).toMatch(/^candidatura:2026-12-01T10:00:00\.000Z:[0-9a-f-]{36}$/);
    expect(dati.get(chiave)).toMatchObject({ ...c, ricevuta_il: "2026-12-01T10:00:00.000Z", email_agenzia: "in_invio" });
    expect(opzioni.get(chiave)).toEqual({ ex: CONSERVAZIONE_CANDIDATURA_S });
    expect(CONSERVAZIONE_CANDIDATURA_S).toBe(183 * 86_400);
  });

  it("updates the email state keeping the original expiry", async () => {
    const chiave = await salvaCandidatura(c);
    await segnaEmailAgenzia(chiave, "inviata");
    expect(dati.get(chiave)).toMatchObject({ email_agenzia: "inviata", email: c.email });
    expect(opzioni.get(chiave)).toEqual({ keepTtl: true });
  });

  it("propagates a Redis error on save, and only logs it on the state update", async () => {
    redisFinto.set.mockRejectedValueOnce(new Error("down"));
    await expect(salvaCandidatura(c)).rejects.toThrow("down");
    redisFinto.get.mockRejectedValueOnce(new Error("down"));
    await expect(segnaEmailAgenzia("candidatura:x", "inviata")).resolves.toBeUndefined();
  });
});
