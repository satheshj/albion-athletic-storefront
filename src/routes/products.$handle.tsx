import { createFileRoute, notFound } from "@tanstack/react-router";
import { useMemo, useState } from "react";
import { productByHandle, products } from "@/lib/products";
import { money, useCart } from "@/lib/cart";

export const Route = createFileRoute("/products/$handle")({
  loader: ({ params }) => {
    const p = productByHandle(params.handle);
    if (!p) throw notFound();
    return { product: p };
  },
  head: ({ loaderData }) => {
    if (!loaderData) return { meta: [{ title: "Product — Albion Athletics" }, { name: "robots", content: "noindex" }] };
    const { product } = loaderData;
    return {
      meta: [
        { title: `${product.title} — Albion Athletics` },
        { name: "description", content: product.description },
        { property: "og:title", content: `${product.title} — Albion Athletics` },
        { property: "og:description", content: product.description },
        { property: "og:image", content: product.images[0] },
        { name: "twitter:image", content: product.images[0] },
      ],
    };
  },
  component: ProductPage,
});

function ProductPage() {
  const { product } = Route.useLoaderData();
  const [size, setSize] = useState<string | null>(null);
  const [added, setAdded] = useState(false);
  const { add } = useCart();

  const related = useMemo(
    () => products.filter((p) => p.handle !== product.handle).slice(0, 3),
    [product.handle],
  );

  const onAdd = (e: React.FormEvent) => {
    e.preventDefault();
    if (!size) return;
    add({
      handle: product.handle,
      title: product.title,
      variant: `${product.subtitle} · ${size}`,
      price: product.price,
      image: product.images[0],
    });
    setAdded(true);
    setTimeout(() => setAdded(false), 1400);
  };

  return (
    <div className="pt-6 md:pt-10">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid md:grid-cols-10 gap-10 md:gap-16">
        {/* 70% gallery */}
        <div className="md:col-span-7 space-y-4 md:space-y-6">
          {product.images.map((src, i) => (
            <div key={i} className="relative aspect-[4/5] overflow-hidden bg-secondary grain animate-fade-slow">
              <img
                src={src}
                alt={product.title}
                className="h-full w-full object-cover"
                loading={i === 0 ? "eager" : "lazy"}
              />
            </div>
          ))}
        </div>

        {/* 30% sticky details */}
        <div className="md:col-span-3">
          <div className="md:sticky md:top-28 space-y-8">
            <div className="animate-rise">
              <div className="eyebrow text-muted-foreground mb-4">Drop 01 · Unisex</div>
              <h1 className="font-serif text-4xl md:text-5xl leading-tight">{product.title}</h1>
              <div className="mt-2 font-serif italic text-foreground/70">{product.subtitle}</div>
              <div className="mt-6 text-lg tabular-nums">{money(product.price)}</div>
            </div>

            <p className="text-sm text-muted-foreground leading-relaxed animate-rise" style={{ animationDelay: "120ms" }}>
              {product.description}
            </p>

            <form onSubmit={onAdd} className="space-y-6 animate-rise" style={{ animationDelay: "220ms" }}>
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="eyebrow">Size</span>
                  <button type="button" className="eyebrow text-muted-foreground hover:text-foreground transition-colors">
                    Size guide
                  </button>
                </div>
                <div className="grid grid-cols-5 gap-2">
                  {product.sizes.map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setSize(s)}
                      className={`h-11 border eyebrow transition-all duration-200 ${
                        size === s
                          ? "bg-foreground text-background border-foreground"
                          : "hairline hover:border-foreground/50"
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={!size}
                className="w-full bg-foreground text-background py-4 eyebrow transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream/90 relative overflow-hidden"
              >
                <span className={`inline-block transition-transform duration-300 ${added ? "-translate-y-8" : ""}`}>
                  {size ? `Add to Bag — ${money(product.price)}` : "Select a size"}
                </span>
                <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${added ? "translate-y-0" : "translate-y-8"}`}>
                  Added ✓
                </span>
              </button>

              <div className="text-xs text-muted-foreground">Free UK shipping on orders over £150.</div>
            </form>

            <div className="border-t hairline pt-6 animate-rise" style={{ animationDelay: "320ms" }}>
              <div className="eyebrow mb-4">The Details</div>
              <ul className="space-y-2 text-sm text-muted-foreground">
                {product.details.map((d) => (
                  <li key={d} className="flex gap-3">
                    <span className="text-foreground/40">—</span><span>{d}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Related */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-44">
        <div className="flex items-end justify-between mb-10">
          <h2 className="font-serif text-3xl md:text-4xl">
            Pairs <span className="italic text-foreground/70">with.</span>
          </h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12">
          {related.map((p) => (
            <a key={p.handle} href={`/products/${p.handle}`} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                <img src={p.images[0]} alt={p.title} className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]" loading="lazy" />
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <div className="font-serif text-lg">{p.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{p.subtitle}</div>
                </div>
                <div className="text-sm">{money(p.price)}</div>
              </div>
            </a>
          ))}
        </div>
      </section>
    </div>
  );
}
