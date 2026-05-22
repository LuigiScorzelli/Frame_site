import Link from "next/link";

const footerLinks = {
  servizi: [
    { label: "Automazione", href: "#servizi" },
    { label: "Sviluppo", href: "#servizi" },
    { label: "Consulenza AI", href: "#servizi" },
    { label: "Data Analytics", href: "#servizi" },
  ],
  azienda: [
    { label: "Chi siamo", href: "/chi-siamo" },
    { label: "Case Study", href: "#risultati" },
    { label: "Blog", href: "/blog" },
    { label: "Carriere", href: "/contatti" },
  ],
  contatti: [
    { label: "info@aiframe.it", href: "mailto:info@aiframe.it", accent: true },
    { label: "LinkedIn", href: "https://www.linkedin.com/company/fr-me", accent: false },
    { label: "GitHub", href: "https://github.com/fr-me-agency", accent: false },
  ],
};

const socials = [
  { label: "LinkedIn", icon: "in", href: "https://www.linkedin.com/company/fr-me" },
  { label: "GitHub", icon: "gh", href: "https://github.com/fr-me-agency" },
  { label: "X", icon: "X", href: "https://x.com/frme_agency" },
  { label: "Instagram", icon: "ig", href: "https://instagram.com/frme.agency" },
];

export default function Footer() {
  return (
    <footer className="bg-bg-0" style={{ borderTop: "2px solid transparent", borderImage: "linear-gradient(90deg, #BFFF00, #00E5FF) 1" }}>
      <div className="mx-auto max-w-[1440px] px-14 py-12">
        <div className="flex flex-col justify-between gap-12 lg:flex-row">
          {/* Brand */}
          <div>
            <Link href="/" className="inline-flex items-center">
              <span className="text-[48px] font-extrabold tracking-[-2px] text-text-0">FR</span>
              <span className="text-[48px] font-extrabold tracking-[-2px] text-accent">&gt;</span>
              <span className="text-[48px] font-extrabold tracking-[-2px] text-text-0">ME</span>
            </Link>
            <p className="mt-3 text-sm text-text-1">Automatizziamo il futuro.</p>
            <div className="mt-4 flex gap-3">
              {socials.map((s) => (
                <a
                  key={s.label}
                  href={s.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label={s.label}
                  className="flex h-9 w-9 items-center justify-center rounded-lg bg-bg-2 font-mono text-xs text-text-1 transition-colors hover:bg-bg-1 hover:text-text-0"
                >
                  {s.icon}
                </a>
              ))}
            </div>
          </div>

          {/* Link columns */}
          <div className="flex gap-12 lg:gap-12">
            {Object.entries(footerLinks).map(([category, links]) => (
              <div key={category}>
                <h4 className="mb-4 font-mono text-[10px] font-medium tracking-[2px] text-accent" style={{ letterSpacing: "2px" }}>{category.toUpperCase()}</h4>
                <ul className="space-y-3">
                  {links.map((link) => (
                    <li key={link.label}>
                      <Link
                        href={link.href}
                        className={`text-[13px] transition-colors hover:text-text-0 ${"accent" in link && link.accent ? "font-mono text-accent" : "text-text-1"}`}
                      >
                        {link.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>

        <div className="mt-8 border-t border-border pt-8">
          <p className="font-mono text-[11px] tracking-[0.5px] text-text-1">&copy; 2026 FR&gt;ME. Tutti i diritti riservati.</p>
        </div>
      </div>
    </footer>
  );
}
