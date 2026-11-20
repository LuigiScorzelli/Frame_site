import Link from "next/link";
import Scheda from "@/components/ui/Scheda";
import { IconaRazzo, IconaScudo } from "@/components/ui/Icone";
import { Bagliori, Puntini } from "@/components/ui/Sfondo";

const formule = [
  {
    nome: "Lo gestiamo noi",
    icona: <IconaRazzo />,
    testo:
      "L'agente gira su un server dedicato a voi in un data center dell'Unione Europea. Pensiamo noi a server, copie di sicurezza, controlli e modelli AI. Voi usate il servizio.",
  },
  {
    nome: "Lo ospitate voi",
    icona: <IconaScudo />,
    testo:
      "L'agente gira su un server intestato a voi, con le vostre chiavi. Noi entriamo solo per la manutenzione, con un accesso che potete togliere quando volete.",
  },
];

/** Data band of the home: the two formulas (docs/lancio/03-contenuti.md). Same look as FasciaPausa, wider for two cards. */
export default function DatiBand() {
  return (
    <section id="dati" className="relative scroll-mt-20 overflow-hidden border-y border-border py-28">
      <Puntini sfuma="bordi" />
      <Bagliori disposizione="fascia" />
      <div className="relative z-10 mx-auto max-w-[1000px] px-6">
        <div className="text-center">
          <span className="mb-4 block font-label text-[13px] tracking-[3px] text-accent">02 / I VOSTRI DATI</span>
          <h2 className="text-4xl font-display font-extrabold leading-[1.1] tracking-[-1px] text-text-0 lg:text-[48px]">
            Dove stanno i vostri dati? Lo decidete voi.
          </h2>
        </div>
        <div className="mt-12 grid gap-6 md:grid-cols-2">
          {formule.map((f) => (
            <Scheda key={f.nome} icona={f.icona} titolo={f.nome}>
              <p className="text-[15px] leading-relaxed">{f.testo}</p>
            </Scheda>
          ))}
        </div>
        <p className="mx-auto mt-8 max-w-[720px] text-center text-base leading-relaxed text-text-1">
          In tutti e due i casi gli account di posta, WhatsApp e CRM restano a nome vostro, e l&apos;accordo sui dati si
          firma prima di cominciare.{" "}
          <Link href="/servizi#formule" className="text-accent underline underline-offset-4">Confronta le due formule</Link>. Come
          trattiamo i dati di chi visita questo sito è scritto nella{" "}
          <Link href="/privacy" className="text-accent underline underline-offset-4">pagina privacy</Link>.
        </p>
      </div>
    </section>
  );
}
