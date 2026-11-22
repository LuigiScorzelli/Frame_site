import { createHash } from "node:crypto";
import { readFile } from "node:fs/promises";
import path from "node:path";
import { NextResponse } from "next/server";
import { controllaLimite, creaLimitatore, hashIp, intestazioniLimite, ipDa } from "@/lib/ratelimit";

// Serves the current beta zip named in public/inframe/update.json (docs/lancio/02-specifiche.md, section 5).
// From 0.2.0-beta.25 the plugin is inFrame and lives in public/inframe; public/wpla keeps the last
// WP Lead Assistant builds for the sites that still run them. The route path keeps its old name because the
// buttons and the published docs link to it.
// update.json is only read, never written: installed plugins keep updating from the direct zip URL.
// The zip is served only if its SHA-256 matches the one in update.json: a manifest and a package that do not
// belong together must never reach a visitor.
// The `download_beta` analytics event is sent client-side on click; here we only log, without the raw IP.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

const CARTELLA = path.join(process.cwd(), "public", "inframe");
const NOME_ZIP = /^[a-z0-9][a-z0-9._-]*\.zip$/i;

const limitatore = creaLimitatore("download", 20, "1 h");

interface Manifest {
  version?: unknown;
  package?: unknown;
  sha256?: unknown;
}

async function leggiManifest(): Promise<{ versione: string; file: string; sha256: string } | null> {
  try {
    const raw = await readFile(path.join(CARTELLA, "update.json"), "utf8");
    const m = JSON.parse(raw) as Manifest;
    if (typeof m.package !== "string") return null;
    const file = path.basename(new URL(m.package, "https://aiframe.it").pathname);
    if (!NOME_ZIP.test(file)) return null;
    if (typeof m.sha256 !== "string" || !/^[a-f0-9]{64}$/i.test(m.sha256)) return null;
    return { versione: typeof m.version === "string" ? m.version : "sconosciuta", file, sha256: m.sha256.toLowerCase() };
  } catch (err) {
    console.error("wpla/download: update.json illeggibile", err instanceof Error ? err.message : err);
    return null;
  }
}

export async function GET(request: Request) {
  const limite = await controllaLimite(limitatore, request);
  if (!limite.ok) {
    return NextResponse.json(
      { error: "Troppi download da questa rete. Riprova tra un'ora." },
      { status: 429, headers: intestazioniLimite(limite) },
    );
  }

  const manifest = await leggiManifest();
  if (!manifest) {
    return NextResponse.json({ error: "Download non disponibile al momento." }, { status: 503 });
  }

  let zip: Buffer;
  try {
    zip = await readFile(path.join(CARTELLA, manifest.file));
  } catch {
    console.error("wpla/download: zip mancante", manifest.file);
    return NextResponse.json({ error: "Download non disponibile al momento." }, { status: 503 });
  }
  if (createHash("sha256").update(zip).digest("hex") !== manifest.sha256) {
    console.error("wpla/download: lo zip non corrisponde allo sha256 di update.json", manifest.file);
    return NextResponse.json({ error: "Download non disponibile al momento." }, { status: 503 });
  }

  console.log(
    JSON.stringify({
      evento: "download_beta",
      ts: new Date().toISOString(),
      version: manifest.versione,
      ua: (request.headers.get("user-agent") ?? "").slice(0, 120),
      referer: (request.headers.get("referer") ?? "").slice(0, 200),
      ip: hashIp(ipDa(request)).slice(0, 16),
    }),
  );

  return new NextResponse(new Uint8Array(zip), {
    status: 200,
    headers: {
      "Content-Type": "application/zip",
      "Content-Disposition": `attachment; filename="${manifest.file}"`,
      "Content-Length": String(zip.byteLength),
      "Cache-Control": "no-store",
      "X-Plugin-Version": manifest.versione,
    },
  });
}
