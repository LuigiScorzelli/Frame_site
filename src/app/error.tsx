"use client";

export default function Error({
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  return (
    <main className="flex min-h-screen flex-col items-center justify-center bg-bg-0 px-6 text-center">
      <span className="font-mono text-xs font-medium tracking-[3px] text-red">ERRORE</span>
      <h1 className="mt-4 text-[48px] font-extrabold tracking-[-2px] text-text-0">
        Qualcosa e andato storto.
      </h1>
      <p className="mt-4 max-w-md text-base text-text-1" style={{ lineHeight: 1.6 }}>
        Si e verificato un errore imprevisto. Riprova o torna alla homepage.
      </p>
      <button
        onClick={reset}
        className="mt-8 inline-flex items-center justify-center bg-accent px-7 py-3.5 font-mono text-[11px] font-bold tracking-wider text-bg-0"
        style={{ letterSpacing: "1px" }}
      >
        RIPROVA &rarr;
      </button>
    </main>
  );
}
