import { immagineSocial, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Cosa possiamo fare per la vostra azienda?";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return immagineSocial({ etichetta: "Servizi", titolo: "Cosa possiamo fare per la vostra azienda?" });
}
