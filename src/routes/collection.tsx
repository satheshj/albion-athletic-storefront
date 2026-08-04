import { createFileRoute } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { productsQueryOptions } from "@/lib/shopify";
import { EmptyProducts, ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/collection")({
  head: () => ({
    meta: [
      { title: "The Collection — Albion Athletics" },
      { name: "description", content: "Heavyweight, unisex training apparel from Albion Athletics. Shop the full collection." },
      { property: "og:title", content: "The Collection — Albion Athletics" },
      { property: "og:description", content: "Heavyweight, unisex training apparel from Albion Athletics." },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-6 pt-32 text-center">
      <h1 className="font-serif text-4xl">We couldn't load the collection.</h1>
      <p className="mt-4 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 pt-32 text-center font-serif text-3xl">No products found.</div>
  ),
  component: Collection,
});

function Collection() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());

  return (
    <div className="mx-auto max-w-[1600px] px-6 md:px-10 pt-16 md:pt-24">
      <div className="grid md:grid-cols-12 gap-6 items-end mb-16 md:mb-24">
        <div className="md:col-span-8">
          <div className="eyebrow text-muted-foreground mb-6">The Collection</div>
          <h1 className="font-serif text-6xl md:text-8xl leading-[0.95] tracking-tight animate-rise">
            Everything <span className="italic text-foreground/70">in the run.</span>
          </h1>
        </div>
        <div className="md:col-span-4 text-sm text-muted-foreground animate-rise" style={{ animationDelay: "150ms" }}>
          Cut in unisex proportions and made in small runs. Every piece here is live from our store — sizes and availability update in real time.
        </div>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-8 gap-y-16">
        {products.length === 0 ? (
          <EmptyProducts />
        ) : (
          products.map((p, i) => <ProductCard key={p.node.id} product={p} i={i} />)
        )}
      </div>
    </div>
  );
}
