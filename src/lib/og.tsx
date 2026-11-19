import { ImageResponse } from "next/og";
import { LOGO_TEXT, SITE_URL } from "@/lib/brand";

// Social preview image (Open Graph / LinkedIn / X), drawn in the site's style.
// Used by the opengraph-image.tsx files; rendered at build time for static routes.

export const OG_SIZE = { width: 1200, height: 630 };
export const OG_CONTENT_TYPE = "image/png";

const BG_0 = "#0B1120";
const ACCENT = "#BFFF00";
const TEXT_0 = "#E8ECF4";
const TEXT_1 = "#A9B6CE";

const PUNTINI = `data:image/svg+xml;utf8,${encodeURIComponent(
  `<svg xmlns="http://www.w3.org/2000/svg" width="${OG_SIZE.width}" height="${OG_SIZE.height}">` +
    `<defs><pattern id="p" width="28" height="28" patternUnits="userSpaceOnUse">` +
    `<circle cx="14" cy="14" r="1.6" fill="rgba(232,236,244,0.10)"/></pattern></defs>` +
    `<rect width="100%" height="100%" fill="url(#p)"/></svg>`,
)}`;

const DOMINIO = new URL(SITE_URL).host.replace(/^www\./, "");

/**
 * ImageResponse needs TTF/OTF, not the woff2 of next/font: fetch the font from Google Fonts,
 * subset to the text actually drawn. If it fails the image still renders with the default font.
 */
async function caricaFont(famiglia: string, peso: number, testo: string): Promise<ArrayBuffer | null> {
  try {
    const url = `https://fonts.googleapis.com/css2?family=${encodeURIComponent(famiglia)}:wght@${peso}&text=${encodeURIComponent(testo)}`;
    const css = await (await fetch(url)).text();
    const file = css.match(/src: url\((.+?)\) format\('(opentype|truetype)'\)/)?.[1];
    if (!file) throw new Error("no TTF/OTF in the Google Fonts CSS");
    const res = await fetch(file);
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.arrayBuffer();
  } catch (err) {
    console.warn(`[og] font ${famiglia} ${peso} not loaded, using the default font:`, err);
    return null;
  }
}

/** Long article titles get a smaller size so they fit in three lines. */
function tagliaTitolo(titolo: string): number {
  if (titolo.length <= 40) return 76;
  if (titolo.length <= 70) return 64;
  return 54;
}

export async function immagineSocial({ etichetta, titolo }: { etichetta: string; titolo: string }) {
  const testoDisplay = `${LOGO_TEXT}${titolo}`;
  const testoLabel = `${etichetta.toUpperCase()}${DOMINIO}`;
  const [display, label] = await Promise.all([
    caricaFont("Bricolage Grotesque", 800, testoDisplay),
    caricaFont("Inter", 600, testoLabel),
  ]);
  const fonts = [
    ...(display ? [{ name: "Display", data: display, weight: 800 as const, style: "normal" as const }] : []),
    ...(label ? [{ name: "Label", data: label, weight: 600 as const, style: "normal" as const }] : []),
  ];

  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "64px 72px",
          position: "relative",
          backgroundColor: BG_0,
          backgroundImage: [
            "radial-gradient(circle at 88% 8%, rgba(191,255,0,0.16), rgba(191,255,0,0) 42%)",
            "radial-gradient(circle at 6% 100%, rgba(0,229,255,0.12), rgba(0,229,255,0) 45%)",
          ].join(", "),
        }}
      >
        {/* Dot grid as in the page heroes. An SVG pattern: the renderer skips sized CSS gradient layers. */}
        {/* eslint-disable-next-line @next/next/no-img-element -- ImageResponse renders plain <img>, next/image does not apply */}
        <img
          src={PUNTINI}
          width={OG_SIZE.width}
          height={OG_SIZE.height}
          alt=""
          style={{ position: "absolute", top: 0, left: 0 }}
        />
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div style={{ display: "flex", fontFamily: "Display", fontSize: 44, fontWeight: 800, letterSpacing: -1 }}>
            {LOGO_TEXT.split("").map((ch, i) => (
              <span key={i} style={{ color: ch === ">" ? ACCENT : TEXT_0 }}>
                {ch}
              </span>
            ))}
          </div>
          <div style={{ display: "flex", fontFamily: "Label", fontSize: 24, fontWeight: 600, color: TEXT_1 }}>
            {DOMINIO}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column" }}>
          <div
            style={{
              display: "flex",
              fontFamily: "Label",
              fontSize: 22,
              fontWeight: 600,
              letterSpacing: 4,
              color: ACCENT,
            }}
          >
            {etichetta.toUpperCase()}
          </div>
          <div
            style={{
              display: "flex",
              marginTop: 24,
              maxWidth: 1000,
              fontFamily: "Display",
              fontSize: tagliaTitolo(titolo),
              fontWeight: 800,
              lineHeight: 1.06,
              letterSpacing: -1.5,
              color: TEXT_0,
            }}
          >
            {titolo}
          </div>
        </div>

        <div style={{ display: "flex", width: 120, height: 6, borderRadius: 3, backgroundColor: ACCENT }} />
      </div>
    ),
    { ...OG_SIZE, fonts },
  );
}
