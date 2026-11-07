import Link from "next/link";

/** Production "AI interlude" band with the data-control copy. */
export default function DatiBand() {
  return (
    <section className="relative overflow-hidden border-y border-border py-28">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "radial-gradient(circle, rgba(232,236,244,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-0 via-bg-0/30 to-bg-0" />
      <div className="pointer-events-none absolute left-[5%] top-[10%] h-[400px] w-[600px] max-w-full rounded-full bg-[radial-gradient(ellipse,rgba(191,255,0,0.12),transparent)]" />
      <div className="pointer-events-none absolute right-[5%] top-[25%] h-[350px] w-[500px] max-w-full rounded-full bg-[radial-gradient(ellipse,rgba(0,229,255,0.1),transparent)]" />
      <div className="relative z-10 mx-auto max-w-[760px] px-6 text-center">
        <span className="mb-4 block font-mono text-[11px] tracking-[3px] text-accent">◆ DATI, SICUREZZA E CONTROLLO</span>
        <h2 className="text-4xl font-extrabold leading-[1.1] tracking-[-2px] text-text-0 lg:text-[48px]">
          I vostri dati restano sotto controllo.
        </h2>
        <p className="mx-auto mt-5 max-w-[560px] text-base leading-relaxed text-text-1">
          Ogni progetto parte da una domanda: quali dati servono davvero, e chi deve poterli vedere. Diamo accessi solo
          dove servono, non copiamo informazioni sensibili in giro per strumenti diversi e vi lasciamo il controllo di
          quello che costruiamo. Come trattiamo i dati di chi visita questo sito è scritto nella{" "}
          <Link href="/privacy" className="text-accent underline-offset-4 hover:underline">pagina privacy</Link>.
        </p>
      </div>
    </section>
  );
}
