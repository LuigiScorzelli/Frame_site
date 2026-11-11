import Link from "next/link";
import FasciaPausa from "@/components/ui/FasciaPausa";

/** Production "AI interlude" band with the data-control copy. */
export default function DatiBand() {
  return (
    <FasciaPausa etichetta="◆ DATI, SICUREZZA E CONTROLLO" titolo="I vostri dati restano sotto controllo.">
      <p>
        Ogni progetto parte da una domanda: quali dati servono davvero, e chi deve poterli vedere. Diamo accessi solo
        dove servono, non copiamo informazioni sensibili in giro per strumenti diversi e vi lasciamo il controllo di
        quello che costruiamo. Come trattiamo i dati di chi visita questo sito è scritto nella{" "}
        <Link href="/privacy" className="text-accent underline-offset-4 hover:underline">pagina privacy</Link>.
      </p>
    </FasciaPausa>
  );
}
