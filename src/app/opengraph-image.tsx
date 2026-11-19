import { immagineSocial, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { AGENCY_NAME } from "@/lib/brand";
export const alt = "Automazioni e assistenti AI per piccole aziende";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return immagineSocial({ etichetta: `${AGENCY_NAME} · automazioni e AI`, titolo: "Automazioni e assistenti AI per piccole aziende" });
}
