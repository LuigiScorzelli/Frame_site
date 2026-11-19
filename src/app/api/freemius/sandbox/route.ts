import { createHash } from "node:crypto";
import { NextResponse } from "next/server";
import { checkoutSandboxAttivo, FREEMIUS_PRODUCT_ID, FREEMIUS_PUBLIC_KEY } from "@/lib/freemius";

// Signs the Freemius checkout sandbox parameters. Same formula as @freemius/sdk (Checkout.getSandboxParams, v0.5.0):
// token = md5(timestamp + product_id + secret_key + public_key + "checkout"), ctx = timestamp in seconds.
// 404 on production and when the variables are missing: the sandbox must not be reachable on the public site.

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

export function GET() {
  const segreta = process.env.FREEMIUS_SECRET_KEY;
  if (!checkoutSandboxAttivo() || !segreta) {
    return NextResponse.json({ errore: "Non disponibile" }, { status: 404 });
  }
  const ctx = Math.floor(Date.now() / 1000).toString();
  const token = createHash("md5")
    .update(`${ctx}${FREEMIUS_PRODUCT_ID}${segreta}${FREEMIUS_PUBLIC_KEY}checkout`)
    .digest("hex");
  return NextResponse.json({ ctx, token }, { headers: { "Cache-Control": "no-store" } });
}
