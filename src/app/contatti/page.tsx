import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import PageHero from "@/components/ui/PageHero";
import CalendlyEmbed from "@/components/ui/CalendlyEmbed";
import ModuloContatti from "@/components/ui/ModuloContatti";
import { CALENDLY_URL, CONTACT_EMAIL, PLUGIN_NAME } from "@/lib/brand";

// 0.15: Calendly inline when CALENDLY_URL (src/lib/brand.ts) is a valid https calendly.com link, otherwise the form.
function calendlyValido(url: string): boolean {
  try {
    const u = new URL(url);
    return u.protocol === "https:" && (u.hostname === "calendly.com" || u.hostname.endsWith(".calendly.com"));
  } catch {
    return false;
  }
}

export default function ContattiPage() {
  const conCalendly = calendlyValido(CALENDLY_URL);

  return (
    <>
      <NavBar />
      <main>
        <PageHero tag="CONTATTI" parola="CONTATTI" title="Parliamone in 30 minuti.">
            <p className="max-w-2xl text-lg leading-relaxed text-text-1">
              Ci mostri il tuo sito, ti diciamo cosa farebbe {PLUGIN_NAME} e se ha senso per te. Nessun impegno.
            </p>

            <div className="mt-12 max-w-[900px] border border-border bg-bg-1 p-4 sm:p-8">{conCalendly ? <CalendlyEmbed url={CALENDLY_URL} /> : <ModuloContatti />}</div>

            <p className="mt-8 text-[15px] text-text-1">
              Oppure scrivici a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-label text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
        </PageHero>
        <div className="pb-8" />
      </main>
      <Footer />
    </>
  );
}
