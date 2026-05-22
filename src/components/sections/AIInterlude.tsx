export default function AIInterlude() {
  return (
    <section className="relative h-[500px] overflow-hidden border-y border-border">
      {/* BG grid pattern */}
      <div
        className="pointer-events-none absolute inset-0"
        style={{
          backgroundImage: "radial-gradient(circle, rgba(232,236,244,0.03) 1px, transparent 1px)",
          backgroundSize: "32px 32px",
        }}
      />
      {/* Gradient overlays */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-0 via-bg-0/30 to-bg-0" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-bg-0 via-transparent to-bg-0" />
      {/* Lime glow */}
      <div className="pointer-events-none absolute left-[100px] top-[50px] h-[400px] w-[600px] rounded-full bg-[radial-gradient(ellipse,rgba(191,255,0,0.12),transparent)]" />
      {/* Cyan glow */}
      <div className="pointer-events-none absolute right-[140px] top-[120px] h-[350px] w-[500px] rounded-full bg-[radial-gradient(ellipse,rgba(0,229,255,0.1),transparent)]" />

      <div className="relative z-10 flex h-full items-center justify-center">
        <div className="max-w-[700px] text-center">
          <span className="mb-4 block font-mono text-[11px] tracking-[3px] text-accent">
            ◆ POWERED BY AI
          </span>
          <h2 className="text-[48px] font-extrabold leading-[1.1] tracking-[-2px] text-text-0">
            L&apos;intelligenza artificiale al servizio del tuo business
          </h2>
          <p className="mx-auto mt-4 max-w-[500px] text-base leading-relaxed text-text-1" style={{ lineHeight: 1.6 }}>
            Reti neurali, machine learning e automazione convergono in un unico ecosistema progettato per far crescere la tua azienda.
          </p>
        </div>
      </div>
    </section>
  );
}
