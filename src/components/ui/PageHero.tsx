/** Inner-page header in the production style: dot grid, gradients, large H1 with CSS fade-in (visible without JS too). */
export default function PageHero({
  tag,
  title,
  children,
}: {
  tag: string;
  title: React.ReactNode;
  children?: React.ReactNode;
}) {
  return (
    <section className="relative overflow-hidden pb-16 pt-36 lg:pb-20 lg:pt-[180px]">
      <div
        className="pointer-events-none absolute inset-0"
        style={{ backgroundImage: "radial-gradient(circle, rgba(232,236,244,0.03) 1px, transparent 1px)", backgroundSize: "32px 32px" }}
      />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-bg-0 via-bg-0/80 to-bg-0/30" />
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-bg-0 via-bg-0/80 to-transparent" />
      <div className="relative z-10 mx-auto max-w-[1440px] px-6 lg:px-14">
        <span className="font-label text-[13px] font-medium tracking-[3px] text-accent">{tag}</span>
        <h1 className="mt-5 max-w-[900px] animate-[fadeIn_0.6s_ease_both] text-4xl font-display font-extrabold leading-[1.05] tracking-[-1px] text-text-0 sm:text-5xl lg:text-[56px] lg:tracking-[-1.5px]">
          {title}
        </h1>
        {children && <div className="mt-6 animate-[fadeIn_0.6s_ease_0.2s_both]">{children}</div>}
      </div>
    </section>
  );
}
