import Link from "next/link";
import { ACCOUNT_URL, AGENCY_NAME, CITY, CONTACT_EMAIL, FOUNDER_URL, PLUGIN_NAME } from "@/lib/brand";
import TrackedLink from "@/components/ui/TrackedLink";
import Logo from "@/components/ui/Logo";

const cosaFacciamo = [
  { label: "Servizi", href: "/servizi" },
  { label: "Plugin", href: "/plugin" },
  { label: "Check-up", href: "/check-up" },
  { label: "Risorse", href: "/risorse" },
];

// Only confirmed profiles (7/11): the old footer pointed to GitHub/X accounts that do not exist.
const contatti = [
  { label: `Email ${CONTACT_EMAIL}`, icona: "@", href: `mailto:${CONTACT_EMAIL}`, esterno: false },
  { label: "Luigi Scorzelli, sito personale", icona: "LS", href: FOUNDER_URL, esterno: true },
];

const linkClass = "text-sm text-text-1 transition-colors hover:text-text-0";
const headClass = "mb-4 font-label text-[12px] font-medium tracking-[2px] text-accent";

export default function Footer() {
  return (
    <footer className="bg-bg-0" style={{ borderTop: "2px solid #BFFF00" }}>
      <div className="mx-auto max-w-[1440px] px-6 py-12 lg:px-14">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          <div className="max-w-sm">
            <Link href="/" aria-label={`${AGENCY_NAME}, home`} className="inline-flex">
              <Logo className="text-[48px]" />
            </Link>
            <p className="mt-3 text-sm text-text-1">
              {AGENCY_NAME}, automazioni e AI per piccole aziende. Il nostro primo prodotto è {PLUGIN_NAME}.
            </p>
            <a href={`mailto:${CONTACT_EMAIL}`} className="mt-3 inline-block font-label text-sm text-accent hover:underline">
              {CONTACT_EMAIL}
            </a>
            <div className="mt-4 flex gap-3">
              {contatti.map((c) => (
                <a
                  key={c.href}
                  href={c.href}
                  aria-label={c.label}
                  {...(c.esterno ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-2 font-label text-[13px] text-text-1 transition-colors hover:bg-bg-1 hover:text-text-0"
                >
                  {c.icona}
                </a>
              ))}
            </div>
          </div>

          <div className="flex flex-wrap gap-12">
            <div>
              <h2 className={headClass}>COSA FACCIAMO</h2>
              <ul className="space-y-3">
                {cosaFacciamo.map((l) => (
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
          <p className="font-label text-[13px] tracking-[0.5px] text-text-1">
            &copy; 2026 {AGENCY_NAME} · {CITY}
          </p>
        </div>
      </div>
    </footer>
  );
}
