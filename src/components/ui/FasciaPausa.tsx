import { Bagliori, Puntini } from "@/components/ui/Sfondo";

/**
 * Centered "pause" band with dots and lime/cyan glows (born as the home "Dati" band).
 * At most one per page, otherwise the glows become wallpaper.
 */
export default function FasciaPausa({
  id,
  etichetta,
  titolo,
  children,
}: {
  id?: string;
  etichetta: string;
  titolo: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="relative scroll-mt-20 overflow-hidden border-y border-border py-28">
      <Puntini sfuma="bordi" />
      <Bagliori disposizione="fascia" />
      <div className="relative z-10 mx-auto max-w-[760px] px-6 text-center">
        <span className="mb-4 block font-label text-[13px] tracking-[3px] text-accent">{etichetta}</span>
        <h2 className="text-4xl font-display font-extrabold leading-[1.1] tracking-[-1px] text-text-0 lg:text-[48px]">{titolo}</h2>
        <div className="mx-auto mt-5 max-w-[560px] text-base leading-relaxed text-text-1">{children}</div>
      </div>
    </section>
  );
}
