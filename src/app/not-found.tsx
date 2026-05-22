import Link from "next/link";

export default function NotFound() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-0 px-6 text-center">
      <span className="font-mono text-xs font-medium tracking-[3px] text-accent">404</span>
      <h1 className="mt-4 text-[64px] font-extrabold tracking-[-3px] text-text-0">
        Pagina non trovata.
      </h1>
      <p className="mt-4 max-w-md text-base text-text-1" style={{ lineHeight: 1.6 }}>
        La pagina che stai cercando non esiste o e stata spostata.
      </p>
      <Link
        href="/"
        className="mt-8 inline-flex items-center justify-center bg-accent px-7 py-3.5 font-mono text-[11px] font-bold tracking-wider text-bg-0"
        style={{ letterSpacing: "1px" }}
      >
        TORNA ALLA HOME &rarr;
      </Link>
    </main>
  );
}
