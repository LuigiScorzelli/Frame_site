import { randomUUID } from "node:crypto";
import type { Candidatura } from "@/lib/offerta";
import { redis } from "@/lib/ratelimit";

// Copy of every application to the 5-client offer, written BEFORE the email to the agency: the email is no
// longer the only record. Upstash Redis, one key per application, deleted automatically after 6 months
// (Luigi's decision of 21/11/2026, stated in /privacy).

export const PREFISSO_CANDIDATURA = "candidatura:";
/** 6 months (183 days), in seconds. */
export const CONSERVAZIONE_CANDIDATURA_S = 183 * 24 * 60 * 60;

export type StatoEmailAgenzia = "in_invio" | "inviata" | "non_inviata";

export interface CandidaturaSalvata extends Candidatura {
  id: string;
  ricevuta_il: string;
  email_agenzia: StatoEmailAgenzia;
}

/** True when the store is configured: without it the route answers 503, never a fake success. */
export function archivioCandidatureAttivo(): boolean {
  return redis !== null;
}

/** Saves the application and returns its key. Throws if Redis is missing or does not answer. */
export async function salvaCandidatura(c: Candidatura, adesso: Date = new Date()): Promise<string> {
  if (!redis) throw new Error("archivio candidature non configurato");
  const id = randomUUID();
  // The ISO date in the key keeps a SCAN of "candidatura:*" in arrival order.
  const chiave = `${PREFISSO_CANDIDATURA}${adesso.toISOString()}:${id}`;
  const record: CandidaturaSalvata = { ...c, id, ricevuta_il: adesso.toISOString(), email_agenzia: "in_invio" };
  await redis.set(chiave, record, { ex: CONSERVAZIONE_CANDIDATURA_S });
  return chiave;
}

/** Records whether the agency email left. Best effort: a failure here is logged, not raised. */
export async function segnaEmailAgenzia(chiave: string, stato: StatoEmailAgenzia): Promise<void> {
  if (!redis) return;
  try {
    const record = await redis.get<CandidaturaSalvata>(chiave);
    if (!record) return;
    // keepTtl: the 6-month deadline counts from the arrival, not from this update.
    await redis.set(chiave, { ...record, email_agenzia: stato }, { keepTtl: true });
  } catch (err) {
    console.error("candidatura: stato email non aggiornato", err instanceof Error ? err.name : err);
  }
}
