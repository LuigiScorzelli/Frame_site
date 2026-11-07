import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import ChatWidget from "@/components/ui/ChatWidget";
import CalendlyEmbed from "@/components/ui/CalendlyEmbed";
import ModuloContatti from "@/components/ui/ModuloContatti";
import { CALENDLY_URL, CONTACT_EMAIL, PLUGIN_NAME } from "@/lib/brand";

// 0.15: Calendly inline when NEXT_PUBLIC_CALENDLY_URL is a valid https calendly.com link, otherwise the form.
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
        <section className="pb-20 pt-36 lg:pt-44">
          <div className="mx-auto max-w-[900px] px-6 lg:px-14">
            <span className="font-mono text-xs font-medium tracking-[2px] text-accent">CONTATTI</span>
            <h1 className="mt-6 text-4xl font-extrabold leading-[1.05] tracking-[-2px] text-text-0 sm:text-5xl">
              Parliamone in 30 minuti.
            </h1>
            <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-1">
              Ci mostri il tuo sito, ti diciamo cosa farebbe {PLUGIN_NAME} e se ha senso per te. Nessun impegno.
            </p>

            <div className="mt-12">{conCalendly ? <CalendlyEmbed url={CALENDLY_URL} /> : <ModuloContatti />}</div>

            <p className="mt-8 text-[15px] text-text-1">
              Oppure scrivici a{" "}
              <a href={`mailto:${CONTACT_EMAIL}`} className="font-mono text-accent hover:underline">
                {CONTACT_EMAIL}
              </a>
              .
            </p>
          </div>
        </section>
      </main>
      <Footer />
      <ChatWidget />
    </>
  );
}
