import { immagineSocial, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Il tuo sito risponde ai clienti? Scoprilo in 2 minuti.";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return immagineSocial({ etichetta: "Check-up gratuito", titolo: "Il tuo sito risponde ai clienti? Scoprilo in 2 minuti." });
}
