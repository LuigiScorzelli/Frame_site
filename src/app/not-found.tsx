import Link from "next/link";

export default function NotFound() {
  return (
    <main
      className="flex min-h-screen flex-col items-center justify-center bg-bg-0 px-6 text-center"
      style={{ backgroundImage: "radial-gradient(circle, rgba(232,236,244,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
    >
      <span className="font-mono text-xs font-medium tracking-[3px] text-accent">404</span>
      <h1 className="mt-4 text-5xl font-extrabold lg:text-[64px] tracking-[-3px] text-text-0">
        Questa pagina non c&apos;è.
      </h1>
      <p className="mt-4 max-w-md text-base text-text-1" style={{ lineHeight: 1.6 }}>
        Il plugin invece sì.
      </p>
      <Link
        href="/plugin"
        className="mt-8 inline-flex items-center justify-center bg-[linear-gradient(135deg,#BFFF00,#00E5FF)] px-7 py-3.5 font-mono text-[11px] font-bold tracking-wider text-bg-0"
        style={{ letterSpacing: "1px" }}
      >
        VAI AL PLUGIN &rarr;
      </Link>
    </main>
  );
}
