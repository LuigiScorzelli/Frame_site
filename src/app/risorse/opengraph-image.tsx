import { immagineSocial, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Guide pratiche per chi riceve richieste dal sito e vuole perderne meno.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return immagineSocial({ etichetta: "Risorse", titolo: "Guide pratiche per chi riceve richieste dal sito e vuole perderne meno." });
}
