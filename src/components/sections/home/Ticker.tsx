const voci = [
  "AGENTI AI ·", "PREVENTIVI ·", "WHATSAPP ·", "SMISTAMENTO EMAIL ·",
  "DATI IN UE ·", "SUL VOSTRO SERVER O GESTITI DA NOI ·", "PICCOLE AZIENDE ·",
];

/** Decorative scrolling band (production style): hidden from screen readers, the words repeat the page. */
export default function Ticker() {
  const doppie = [...voci, ...voci];
  return (
    <section aria-hidden className="overflow-hidden py-3.5" style={{ background: "#BFFF00" }}>
      <div className="flex w-max animate-ticker motion-reduce:animate-none">
        {doppie.map((v, i) => (
          <span key={`${v}-${i}`} className="mx-3 whitespace-nowrap font-label text-sm font-bold text-bg-0" style={{ letterSpacing: "2px" }}>
            {v}
          </span>
        ))}
      </div>
    </section>
  );
}
