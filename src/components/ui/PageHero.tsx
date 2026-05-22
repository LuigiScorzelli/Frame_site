import SectionTag from "@/components/ui/SectionTag";

interface PageHeroProps {
  sectionTag?: string;
  heading: React.ReactNode;
  subtitle?: string;
}

export default function PageHero({ sectionTag, heading, subtitle }: PageHeroProps) {
  return (
    <section className="relative overflow-hidden bg-bg-0 pb-16 pt-32 lg:pb-24 lg:pt-40">
      <div className="mx-auto max-w-7xl px-6 lg:px-8">
        {sectionTag && (
          <div className="mb-6">
            <SectionTag>{sectionTag}</SectionTag>
          </div>
        )}
        <h1 className="max-w-4xl font-mono text-4xl font-bold text-text-0 sm:text-5xl lg:text-6xl">
          {heading}
        </h1>
        {subtitle && (
          <p className="mt-6 max-w-2xl text-lg leading-relaxed text-text-1">{subtitle}</p>
        )}
      </div>
    </section>
  );
}
