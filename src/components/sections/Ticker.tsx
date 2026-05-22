const items = [
  "AUTOMAZIONE ·", "INTELLIGENZA ARTIFICIALE ·", "SVILUPPO SOFTWARE ·", "CONSULENZA AI ·",
  "WORKFLOW ·", "MACHINE LEARNING ·", "PROCESS AUTOMATION ·", "DATA ANALYTICS ·",
];

export default function Ticker() {
  const doubled = [...items, ...items];

  return (
    <section
      className="overflow-hidden py-3.5"
      style={{ background: "linear-gradient(90deg, #BFFF00, #00E5FF)" }}
    >
      <div className="flex animate-ticker">
        {doubled.map((item, i) => (
          <span
            key={`${item}-${i}`}
            className="mx-3 whitespace-nowrap font-mono text-[13px] font-bold text-bg-0"
            style={{ letterSpacing: "2px" }}
          >
            {item}
          </span>
        ))}
      </div>
    </section>
  );
}
