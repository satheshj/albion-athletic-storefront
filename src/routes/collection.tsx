import { createFileRoute, Link } from "@tanstack/react-router";
import { products } from "@/lib/products";
import { money } from "@/lib/cart";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "Collection 01 — Albion Athletics" },
      { name: "description", content: "The first drop from Albion Athletics. Seven heavyweight, unisex pieces." },
      { property: "og:title", content: "Collection 01 — Albion Athletics" },
      { property: "og:description", content: "The first drop from Albion Athletics." },
    ],
  }),
  component: Collection,
});

function Collection() {
  return (
    <div className="mx-auto max-w-[1600px] px-6 md:px-10 pt-16 md:pt-24">
      <div className="grid md:grid-cols-12 gap-6 items-end mb-16 md:mb-24">
        <div className="md:col-span-8">
          <div className="eyebrow text-muted-foreground mb-6">Collection 01 · Autumn 2026</div>
          <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] tracking-tight animate-rise">
            The <span className="italic text-foreground/70">first drop.</span>
          </h1>
        </div>
        <div className="md:col-span-4 text-sm text-muted-foreground animate-rise" style={{ animationDelay: "150ms" }}>
          Seven pieces, one weight of cloth. Cut in unisex proportions and made in small runs at our mill in northern Portugal.
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-16">
        {products.map((p, i) => (
          <Link
            key={p.handle}
            to="/products/$handle"
            params={{ handle: p.handle }}
            className="group block animate-rise"
            style={{ animationDelay: `${i * 80}ms` }}
          >
            <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
              <img
                src={p.images[0]}
                alt={p.title}
                className="absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-[1.03] group-hover:opacity-0"
                loading="lazy"
              />
              <img
                src={p.images[1]}
                alt=""
                aria-hidden
                className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[900ms] group-hover:opacity-100"
                loading="lazy"
              />
              <div className="absolute inset-x-6 bottom-6 translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500">
                <span className="block text-center bg-foreground text-background eyebrow py-3">View Product</span>
              </div>
            </div>
            <div className="mt-6 flex items-start justify-between gap-3">
              <div>
                <div className="font-serif text-xl leading-tight">{p.title}</div>
                <div className="text-xs text-muted-foreground mt-1">{p.subtitle} · Unisex</div>
              </div>
              <div className="text-sm tabular-nums">{money(p.price)}</div>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
