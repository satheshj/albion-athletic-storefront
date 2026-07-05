import { createFileRoute, Link } from "@tanstack/react-router";
import heroAsset from "@/assets/hero.jpg.asset.json";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: "About — Albion Athletics" },
      { name: "description", content: "A small London studio making heavyweight, unisex training apparel." },
      { property: "og:title", content: "About — Albion Athletics" },
      { property: "og:description", content: "A small London studio making heavyweight, unisex training apparel." },
      { property: "og:image", content: heroAsset.url },
    ],
  }),
  component: About,
});

function About() {
  return (
    <div>
      <section className="mx-auto max-w-[1400px] px-6 md:px-10 pt-16 md:pt-24 grid md:grid-cols-12 gap-10 items-start">
        <div className="md:col-span-6 md:sticky md:top-28 animate-rise">
          <div className="eyebrow text-muted-foreground mb-6">The Studio</div>
          <h1 className="font-serif text-6xl md:text-7xl leading-[0.95] tracking-tight">
            A small London studio making <span className="italic text-foreground/70">heavyweight kit.</span>
          </h1>
        </div>
        <div className="md:col-span-6 space-y-8 text-base md:text-lg text-foreground/80 leading-relaxed animate-rise" style={{ animationDelay: "150ms" }}>
          <p>
            Albion started in a converted print works in east London — two of us, a rack of vintage sportswear and a stubborn opinion about what training clothes should feel like on the body.
          </p>
          <p>
            We make heavyweight, unisex pieces cut for the field and the floor: proper cotton, honest construction, the same silhouettes worn by British athletes a century ago, quietly refined for now.
          </p>
          <p>
            Everything is made in small runs at a family-run mill in northern Portugal, from British-grown cotton spun in Lancashire. We drop twice a year and never restock.
          </p>
          <p className="font-serif italic text-foreground/70 text-2xl md:text-3xl pt-4">
            "Made to be worn hard, kept a long time."
          </p>
          <div className="pt-4">
            <Link to="/collection" className="inline-flex border hairline px-6 py-3 eyebrow hover:bg-foreground hover:text-background transition-colors">
              See Drop 01 →
            </Link>
          </div>
        </div>
      </section>

      <section className="mt-24 md:mt-32 relative h-[70svh] overflow-hidden grain">
        <img src={heroAsset.url} alt="" className="absolute inset-0 h-full w-full object-cover" loading="lazy" />
        <div className="absolute inset-0 bg-background/30" />
      </section>
    </div>
  );
}
