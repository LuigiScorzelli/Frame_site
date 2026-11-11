import Link from "next/link";
import { Bagliori, Puntini } from "@/components/ui/Sfondo";

/** Production "AI interlude" band with the data-control copy. */
export default function DatiBand() {
  return (
    <section className="relative overflow-hidden border-y border-border py-28">
      <Puntini sfuma="bordi" />
      <Bagliori disposizione="fascia" />
      <div className="relative z-10 mx-auto max-w-[760px] px-6 text-center">
        <span className="mb-4 block font-label text-[13px] tracking-[3px] text-accent">◆ DATI, SICUREZZA E CONTROLLO</span>
        <h2 className="text-4xl font-display font-extrabold leading-[1.1] tracking-[-1px] text-text-0 lg:text-[48px]">
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
