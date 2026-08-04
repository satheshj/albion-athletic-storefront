import { createFileRoute, Link } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import heroAsset from "@/assets/hero.jpg.asset.json";
import { productsQueryOptions } from "@/lib/shopify";
import { EmptyProducts, ProductCard } from "@/components/ProductCard";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "Albion Athletics — Heavyweight Training Apparel" },
      { name: "description", content: "Heavyweight, unisex training apparel from London. Shop the collection." },
      { property: "og:title", content: "Albion Athletics — Heavyweight Training Apparel" },
      { property: "og:description", content: "Heavyweight, unisex training apparel from London. Shop the collection." },
      { property: "og:image", content: heroAsset.url },
      { name: "twitter:image", content: heroAsset.url },
    ],
  }),
  loader: ({ context }) => context.queryClient.ensureQueryData(productsQueryOptions()),
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-6 pt-32 text-center">
      <h1 className="font-serif text-4xl">We couldn't load the store.</h1>
      <p className="mt-4 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 pt-32 text-center font-serif text-3xl">Nothing here yet.</div>
  ),
  component: Home,
});

function Home() {
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  const featured = products.slice(0, 4);
  const editorialImage =
    products[0]?.node.images.edges[1]?.node.url ??
    products[0]?.node.images.edges[0]?.node.url ??
    heroAsset.url;

  return (
    <>
      {/* HERO */}
      <section className="relative -mt-16 h-[100svh] min-h-[700px] w-full overflow-hidden grain">
        <img
          src={heroAsset.url}
          alt="Unisex athlete training in a London gym"
          className="absolute inset-0 h-full w-full object-cover animate-fade-slow"
          width={1920}
          height={1280}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/40 via-background/20 to-background" />

        <div className="absolute inset-0 flex flex-col justify-between px-6 md:px-10 py-24 md:py-28">
          <div className="eyebrow text-foreground/70 animate-rise">London · Est. MMXXV</div>

          <div className="max-w-3xl animate-rise" style={{ animationDelay: "180ms" }}>
            <div className="eyebrow mb-6 text-foreground/80">Available now</div>
            <h1 className="font-serif text-[13vw] md:text-[7.5rem] leading-[0.9] tracking-tight">
              Albion<br />
              <span className="italic text-foreground/70">Athletics.</span>
            </h1>
            <p className="mt-6 max-w-md text-sm md:text-base text-foreground/70">
              Heavyweight training apparel, cut for the field and the floor. Made in small runs from British and Portuguese cotton.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                to="/collection"
                className="inline-flex items-center gap-3 bg-foreground text-background px-7 py-4 eyebrow hover:bg-cream/90 transition-colors"
              >
                Shop the Collection <span aria-hidden>→</span>
              </Link>
              <Link
                to="/about"
                className="inline-flex items-center border hairline px-7 py-4 eyebrow hover:bg-foreground hover:text-background transition-colors"
              >
                The Studio
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* INTRO STRIP */}
      <section className="border-y hairline">
        <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-8 grid gap-6 md:grid-cols-4 items-center">
          {[
            ["01", "Heavyweight British Cotton"],
            ["02", "Unisex by design"],
            ["03", "Made in small runs"],
            ["04", "Secure Shopify checkout"],
          ].map(([n, t]) => (
            <div key={n} className="flex items-baseline gap-4">
              <span className="font-serif italic text-2xl text-foreground/50">{n}</span>
              <span className="eyebrow">{t}</span>
            </div>
          ))}
        </div>
      </section>

      {/* FEATURED COLLECTION */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pt-24 md:pt-32">
        <div className="flex items-end justify-between gap-6 mb-12 md:mb-16">
          <div>
            <div className="eyebrow text-muted-foreground mb-4">Featured</div>
            <h2 className="font-serif text-5xl md:text-7xl tracking-tight">
              The <span className="italic text-foreground/70">collection.</span>
            </h2>
          </div>
          <Link
            to="/collection"
            className="hidden md:inline-flex items-center gap-2 eyebrow hover:opacity-70 transition-opacity"
          >
            View all <span aria-hidden>→</span>
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-6 gap-y-14">
          {featured.length === 0 ? (
            <EmptyProducts />
          ) : (
            featured.map((p, i) => <ProductCard key={p.node.id} product={p} i={i} compact />)
          )}
        </div>
      </section>

      {/* EDITORIAL SPLIT */}
      <section className="mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-44">
        <div className="grid md:grid-cols-12 gap-10 items-center">
          <div className="md:col-span-5">
            <div className="eyebrow text-muted-foreground mb-6">Manifesto</div>
            <h3 className="font-serif text-4xl md:text-5xl leading-tight">
              Built for the <span className="italic text-foreground/70">quiet work</span>. The mornings before the alarm. The last set nobody sees.
            </h3>
            <p className="mt-6 text-sm text-muted-foreground max-w-md">
              We started Albion because training kit had lost its sense of place. Everything shiny, nothing considered. Our answer: few pieces, one weight of cloth, made properly.
            </p>
            <Link to="/about" className="mt-8 inline-flex eyebrow hover:opacity-70 transition-opacity">
              Read the studio note →
            </Link>
          </div>
          <div className="md:col-span-7 aspect-[4/5] md:aspect-[5/4] overflow-hidden bg-secondary grain">
            <img src={editorialImage} alt="Editorial portrait" className="h-full w-full object-cover" loading="lazy" />
          </div>
        </div>
      </section>
    </>
  );
}
