import Link from "next/link";
import { ACCOUNT_URL, AGENCY_NAME, CITY, CONTACT_EMAIL, FOUNDER_URL } from "@/lib/brand";
import TrackedLink from "@/components/ui/TrackedLink";

const prodotto = [
  { label: "Plugin", href: "/plugin" },
  { label: "Check-up", href: "/check-up" },
  { label: "Servizi", href: "/servizi" },
  { label: "Risorse", href: "/risorse" },
];

const linkClass = "text-[13px] text-text-1 transition-colors hover:text-text-0";
const headClass = "mb-4 font-mono text-[10px] font-medium tracking-[2px] text-accent";

export default function Footer() {
  return (
    <footer className="bg-bg-0" style={{ borderTop: "2px solid transparent", borderImage: "linear-gradient(90deg, #BFFF00, #00E5FF) 1" }}>
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-14">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="max-w-sm">
            <Link href="/" className="inline-flex items-center text-[40px] font-extrabold tracking-[-2px]">
              <span className="text-accent">{AGENCY_NAME.slice(0, 2)}</span>
              <span className="text-text-0">{AGENCY_NAME.slice(2)}</span>
            </Link>
            <p className="mt-3 text-sm text-text-1">
              {AGENCY_NAME}, prodotti per piccole aziende che lavorano con il sito.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 inline-block font-mono text-[13px] text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>
          </div>

          <div className="flex flex-wrap gap-12">
            <div>
              <h2 className={headClass}>PRODOTTO</h2>
              <ul className="space-y-3">
                {prodotto.map((l) => (
                  <li key={l.href}><Link href={l.href} className={linkClass}>{l.label}</Link></li>
                ))}
              </ul>
            </div>
            <div>
              <h2 className={headClass}>{AGENCY_NAME.toUpperCase()}</h2>
              <ul className="space-y-3">
                {ACCOUNT_URL && (
                  <li>
                    <TrackedLink href={ACCOUNT_URL} evento="click_account" props={{ posizione: "footer" }} className={linkClass}>
                      Il mio account
                    </TrackedLink>
                  </li>
                )}
                <li><Link href="/privacy" className={linkClass}>Privacy</Link></li>
                <li><Link href="/contatti" className={linkClass}>Contatti</Link></li>
                <li>
                  <a href={FOUNDER_URL} target="_blank" rel="noopener noreferrer" className={linkClass}>
                    Chi c&apos;è dietro &rarr; {FOUNDER_URL.replace(/^https?:\/\//, "")}
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          {/* TODO:dato P. IVA da inserire (vedi docs/lancio/00-LEGGIMI.md) */}
          <p className="font-mono text-[11px] tracking-[0.5px] text-text-1">
            {AGENCY_NAME} · {CITY}
          </p>
        </div>
      </div>
    </footer>
  );
}
