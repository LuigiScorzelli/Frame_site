import { immagineSocial, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { AGENCY_NAME } from "@/lib/brand";
export const alt = "Agenti AI per piccole aziende, con i dati dove decidete voi";
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return immagineSocial({ etichetta: `${AGENCY_NAME} · agenti AI`, titolo: "Agenti AI per piccole aziende, con i dati dove decidete voi" });
}
