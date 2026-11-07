import InteresseForm from "@/components/ui/InteresseForm";

export default function NewsletterSection({ pagina = "risorse" }: { pagina?: string }) {
  return (
    <section className="border-y border-border bg-bg-1 py-16">
      <div className="mx-auto flex max-w-[1440px] flex-col items-center px-6 text-center lg:px-14">
        <span className="font-mono text-xs font-medium tracking-[3px] text-accent">NEWSLETTER</span>
        <h2 className="mt-6 text-4xl font-extrabold leading-tight tracking-[-1px] text-text-0">
          Una email ogni due settimane.
        </h2>
        <p className="mx-auto mt-4 max-w-md text-[15px] leading-relaxed text-text-1">
          Ogni due settimane: un numero vero dal plugin e una cosa da sistemare sul sito. Niente altro.
        </p>
        <div className="mt-6 w-full max-w-xl text-left">
          <InteresseForm fonte="newsletter" pagina={pagina} bottone="Iscriviti" />
        </div>
        <p className="mt-4 font-mono text-[11px] tracking-[0.5px] text-text-1">Cancellati quando vuoi.</p>
      </div>
    </section>
  );
}
