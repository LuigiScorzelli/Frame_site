import { immagineSocial, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";

export const alt = "Quale lavoro volete togliere dalla vostra giornata?";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return immagineSocial({ etichetta: "Servizi", titolo: "Quale lavoro volete togliere dalla vostra giornata?" });
}
