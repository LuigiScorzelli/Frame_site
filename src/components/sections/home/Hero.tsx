import CtaButton from "@/components/ui/CtaButton";
import { AGENCY_NAME, BOOKING_URL } from "@/lib/brand";

// Production hero style (main, before the launch branch) with the new agency copy.
const righe = [
  { testo: "QUANTO LAVORO", colore: "text-text-0" },
  { testo: "RIPETITIVO", colore: "text-accent" },
  { testo: "FATE ANCORA", colore: "text-cyan" },
  { testo: "A MANO?", colore: "text-cyan" },
];

export default function Hero() {
  return (
    <section className="relative flex min-h-screen items-end overflow-hidden pb-24 pt-32">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "radial-gradient(circle, rgba(232,236,244,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-0 via-bg-0/85 to-bg-0/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-0 via-bg-0/80 to-transparent" />

      <div className="relative z-10 mx-auto w-full max-w-[1440px] px-6 lg:px-14">
        <div className="max-w-[900px]">
          <span className="font-mono text-xs font-medium tracking-[2px] text-accent">AUTOMAZIONI E AI PER PICCOLE AZIENDE</span>
          <h1 className="mt-6 animate-[fadeIn_0.6s_ease_forwards] opacity-0">
            {righe.map((r, i) => (
              <span
                key={r.testo}
                className={`${i > 0 ? "mt-2 " : ""}block text-5xl font-extrabold leading-none tracking-[-2px] sm:text-6xl lg:text-[80px] lg:tracking-[-4px] ${r.colore}`}
              >
                {r.testo}
              </span>
            ))}
          </h1>

          <p className="mt-8 max-w-[560px] animate-[fadeIn_0.6s_ease_0.3s_forwards] text-lg leading-relaxed text-text-1 opacity-0">
            Siamo {AGENCY_NAME}. Costruiamo automazioni, assistenti AI e collegamenti tra gli strumenti che usate già,
            per piccole aziende senza reparto tecnico.
          </p>

          <div className="mt-8 flex animate-[fadeIn_0.6s_ease_0.6s_forwards] flex-col gap-4 opacity-0 sm:flex-row">
            <CtaButton href={BOOKING_URL} variant="gradient" evento="click_prenota" props={{ pagina: "home", posizione: "hero" }}>
              PRENOTA 30 MINUTI &rarr;
            </CtaButton>
            <CtaButton href="/plugin" variant="secondary">
              SCOPRI IL PLUGIN GRATUITO
            </CtaButton>
          </div>
        </div>
      </div>
    </section>
  );
}
