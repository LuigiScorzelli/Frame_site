import { immagineSocial, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Cerchiamo 5 aziende per i primi agenti AI";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return immagineSocial({ etichetta: "Offerta · 5 posti", titolo: "Volete essere una delle prime 5 aziende?" });
}
