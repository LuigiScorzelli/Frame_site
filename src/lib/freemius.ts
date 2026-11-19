// Freemius checkout, sprint 2: SANDBOX ONLY (Luigi, 19/11/2026). No public checkout and no real prices without
// Luigi's go-ahead, so the checkout is off on production deployments even if the variables are set there.
// Product ID, plan ID and public key are public (the checkout needs them in the browser); the secret key is
// server-only and used just to sign the sandbox parameters.

export const FREEMIUS_PRODUCT_ID = process.env.NEXT_PUBLIC_FREEMIUS_PRODUCT_ID ?? "";
export const FREEMIUS_PLAN_ID = process.env.NEXT_PUBLIC_FREEMIUS_PLAN_ID ?? "";
export const FREEMIUS_PUBLIC_KEY = process.env.NEXT_PUBLIC_FREEMIUS_PUBLIC_KEY ?? "";

/** Server side only: true on Vercel production, where the sandbox checkout must never appear. */
export function isProduzione(): boolean {
  return process.env.VERCEL_ENV === "production";
}

/** Sandbox checkout available: all public IDs set, secret key set, not production. Server side only. */
export function checkoutSandboxAttivo(): boolean {
  return (
    Boolean(FREEMIUS_PRODUCT_ID && FREEMIUS_PLAN_ID && FREEMIUS_PUBLIC_KEY && process.env.FREEMIUS_SECRET_KEY) &&
    !isProduzione()
  );
}
