import { campoEmail, emailValida, riga, testo } from "@/lib/input";

// Launch offer for the first 5 clients (docs/lancio/01-piano-sprint.md, item A.4).
// Decided by Luigi on 2026-11-20: 5 places, standard agents only, applications until 2027-03-31.

export const OFFERTA = {
  posti: 5,
  /** Last day applications are accepted, Europe/Rome calendar day. */
  ultimoGiorno: "2027-03-31",
  ultimoGiornoTesto: "31 marzo 2027",
  /** Set to true when the five places are assigned before the deadline. */
  postiEsauriti: false,
} as const;

/** Calendar day in Italy for a given instant, as YYYY-MM-DD. */
function giornoInItalia(istante: Date): string {
  return new Intl.DateTimeFormat("en-CA", { timeZone: "Europe/Rome", year: "numeric", month: "2-digit", day: "2-digit" }).format(istante);
}

/** True until the end of the last day in Italy, unless the places ran out first. */
export function offertaAperta(adesso: Date = new Date()): boolean {
  return !OFFERTA.postiEsauriti && giornoInItalia(adesso) <= OFFERTA.ultimoGiorno;
}

export const AGENTI_OFFERTA = [
  { valore: "preventivi", etichetta: "Preventivi e richieste" },
  { valore: "whatsapp", etichetta: "Assistente WhatsApp" },
  { valore: "email", etichetta: "Smistamento email" },
  { valore: "non-so", etichetta: "Non so ancora" },
] as const;

export const RISPOSTE_WORKSPACE = [
  { valore: "si", etichetta: "Sì" },
  { valore: "no", etichetta: "No" },
  { valore: "non-so", etichetta: "Non so" },
] as const;

export type AgenteOfferta = (typeof AGENTI_OFFERTA)[number]["valore"];
export type RispostaWorkspace = (typeof RISPOSTE_WORKSPACE)[number]["valore"];

/**
 * Honeypot key in the application body: a neutral name, so browsers and password managers do not autofill it
 * (the old "sito_web" looked like a website field). The route still rejects "sito_web" too.
 */
export const CAMPO_TRAPPOLA = "rif_interno";

export interface Candidatura {
  nome: string;
  azienda: string;
  email: string;
  sito: string;
  agente: AgenteOfferta;
  processo: string;
  volume: string;
  workspace: RispostaWorkspace;
  /** Optional, separate consent: news by email through Brevo (double opt-in). */
  aggiornamenti: boolean;
}

export type CampoCandidatura = "nome" | "azienda" | "email" | "agente" | "processo" | "workspace" | "consenso";
export type ErroriCandidatura = Partial<Record<CampoCandidatura, string>>;

/** Validates the application form. Shared by the form (before sending) and the API route. */
export function validaCandidatura(
  body: Record<string, unknown>,
): { ok: true; dati: Candidatura } | { ok: false; errori: ErroriCandidatura } {
  const nome = riga(body.nome, 120);
  const azienda = riga(body.azienda, 160);
  const email = campoEmail(body.email).toLowerCase();
  const processo = testo(body.processo, 3000);
  const agente = AGENTI_OFFERTA.find((a) => a.valore === body.agente)?.valore;
  const workspace = RISPOSTE_WORKSPACE.find((r) => r.valore === body.workspace)?.valore;

  const errori: ErroriCandidatura = {};
  if (nome.length < 2) errori.nome = "Scrivete nome e cognome";
  if (azienda.length < 2) errori.azienda = "Scrivete il nome dell'azienda";
  if (!emailValida(email)) errori.email = "Inserite un'email valida";
  if (!agente) errori.agente = "Scegliete un agente, oppure \"Non so ancora\"";
  if (processo.length < 20) errori.processo = "Raccontateci in due righe come gestite oggi queste richieste";
  if (!workspace) errori.workspace = "Scegliete una risposta";
  if (body.consenso !== true) errori.consenso = "Serve il consenso per ricontattarvi";

  if (!agente || !workspace || Object.keys(errori).length > 0) return { ok: false, errori };
  return {
    ok: true,
    dati: {
      nome,
      azienda,
      email,
      sito: riga(body.sito, 300),
      agente,
      processo,
      volume: riga(body.volume, 80),
      workspace,
      aggiornamenti: body.aggiornamenti === true,
    },
  };
}
