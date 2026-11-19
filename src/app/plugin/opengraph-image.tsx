import { immagineSocial, OG_CONTENT_TYPE, OG_SIZE } from "@/lib/og";
import { PLUGIN_NAME } from "@/lib/brand";
export const alt = `${PLUGIN_NAME}: il tuo sito risponde anche quando sei chiuso.`;
export const size = OG_SIZE;
export const contentType = OG_CONTENT_TYPE;

export default function Image() {
  return immagineSocial({ etichetta: "Plugin WordPress · gratuito · in italiano", titolo: `${PLUGIN_NAME}: il tuo sito risponde anche quando sei chiuso.` });
}
