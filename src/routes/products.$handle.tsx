import { createFileRoute, Link, notFound } from "@tanstack/react-router";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useMemo, useState } from "react";
import {
  money,
  productQueryOptions,
  productsQueryOptions,
  type ShopifyProductNode,
} from "@/lib/shopify";
import { openShopifyCheckout, toCartItem, useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/products/$handle")({
  loader: async ({ context, params }) => {
    const product = await context.queryClient.ensureQueryData(productQueryOptions(params.handle));
    if (!product) throw notFound();
    context.queryClient.prefetchQuery(productsQueryOptions());
    return { title: product.title, description: product.description, image: product.images.edges[0]?.node.url ?? null };
  },
  head: ({ loaderData }) => {
    if (!loaderData) {
      return { meta: [{ title: "Product — Albion Athletics" }, { name: "robots", content: "noindex" }] };
    }
    const desc = (loaderData.description || "Heavyweight unisex training apparel from Albion Athletics.").slice(0, 155);
    return {
      meta: [
        { title: `${loaderData.title} — Albion Athletics` },
        { name: "description", content: desc },
        { property: "og:title", content: `${loaderData.title} — Albion Athletics` },
        { property: "og:description", content: desc },
        ...(loaderData.image
          ? [
              { property: "og:image", content: loaderData.image },
              { name: "twitter:image", content: loaderData.image },
            ]
          : []),
      ],
    };
  },
  errorComponent: ({ error }) => (
    <div role="alert" className="mx-auto max-w-3xl px-6 pt-32 text-center">
      <h1 className="font-serif text-4xl">We couldn't load this product.</h1>
      <p className="mt-4 text-sm text-muted-foreground">{error.message}</p>
    </div>
  ),
  notFoundComponent: () => (
    <div className="mx-auto max-w-3xl px-6 pt-32 text-center">
      <h1 className="font-serif text-4xl">This product no longer exists.</h1>
      <Link to="/collection" className="mt-8 inline-flex border hairline px-6 py-3 eyebrow hover:bg-foreground hover:text-background transition-colors">
        Shop the Collection
      </Link>
    </div>
  ),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const { data } = useSuspenseQuery(productQueryOptions(handle));
  const product = data as ShopifyProductNode;

  const variants = useMemo(() => product.variants.edges.map((e) => e.node), [product]);
  const images = product.images.edges.map((e) => e.node);
  const options = product.options.filter((o) => !(o.values.length === 1 && o.values[0] === "Default Title"));

  const [selected, setSelected] = useState<Record<string, string>>(() =>
    options.length === 1 && options[0].values.length === 1
      ? { [options[0].name]: options[0].values[0] }
      : {},
  );
  const [added, setAdded] = useState(false);

  const addItem = useCartStore((s) => s.addItem);
  const openCart = useCartStore((s) => s.openCart);
  const isLoading = useCartStore((s) => s.isLoading);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);

  const activeVariant = useMemo(() => {
    if (options.length === 0) return variants[0];
    return variants.find((v) =>
      v.selectedOptions.every((o) => selected[o.name] === o.value),
    );
  }, [variants, selected, options.length]);

  const price = activeVariant?.price ?? product.priceRange.minVariantPrice;
  const canAdd = Boolean(activeVariant?.availableForSale) && !isLoading;

  const onAdd = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!activeVariant) return;
    await addItem(toCartItem(product, activeVariant));
    setAdded(true);
    openCart();
    setTimeout(() => setAdded(false), 1400);
  };

  const onBuyNow = async () => {
    if (!activeVariant) return;
    await addItem(toCartItem(product, activeVariant));
    openShopifyCheckout(getCheckoutUrl());
  };

  return (
    <div className="pt-6 md:pt-10">
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 grid md:grid-cols-10 gap-10 md:gap-16">
        {/* 70% gallery */}
        <div className="md:col-span-7 space-y-4 md:space-y-6">
          {(images.length ? images : [null]).map((img, i) => (
            <div key={i} className="relative aspect-[4/5] overflow-hidden bg-secondary grain animate-fade-slow">
              {img ? (
                <img
                  src={img.url}
                  alt={img.altText ?? product.title}
                  className="h-full w-full object-cover"
                  loading={i === 0 ? "eager" : "lazy"}
                />
              ) : (
                <div className="h-full w-full flex items-center justify-center eyebrow text-muted-foreground">No image</div>
              )}
            </div>
          ))}
        </div>

        {/* 30% sticky details */}
        <div className="md:col-span-3">
          <div className="md:sticky md:top-28 space-y-8">
            <div className="animate-rise">
              <div className="eyebrow text-muted-foreground mb-4">
                {product.productType || "Unisex"}
              </div>
              <h1 className="font-serif text-4xl md:text-5xl leading-tight">{product.title}</h1>
              <div className="mt-6 text-lg tabular-nums">{money(price.amount, price.currencyCode)}</div>
            </div>

            {product.description && (
              <p className="text-sm text-muted-foreground leading-relaxed whitespace-pre-line animate-rise" style={{ animationDelay: "120ms" }}>
                {product.description}
              </p>
            )}

            <form onSubmit={onAdd} className="space-y-6 animate-rise" style={{ animationDelay: "220ms" }}>
              {options.map((opt) => (
                <div key={opt.name}>
                  <div className="flex items-center justify-between mb-3">
                    <span className="eyebrow">{opt.name}</span>
                  </div>
                  <div className="grid grid-cols-5 gap-2">
                    {opt.values.map((v) => {
                      const isSelected = selected[opt.name] === v;
                      const available = variants.some(
                        (variant) =>
                          variant.availableForSale &&
                          variant.selectedOptions.some((o) => o.name === opt.name && o.value === v),
                      );
                      return (
                        <button
                          key={v}
                          type="button"
                          onClick={() => setSelected((p) => ({ ...p, [opt.name]: v }))}
                          disabled={!available}
                          className={`h-11 border eyebrow transition-all duration-200 disabled:opacity-30 disabled:line-through ${
                            isSelected
                              ? "bg-foreground text-background border-foreground"
                              : "hairline hover:border-foreground/50"
                          }`}
                        >
                          {v}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              <button
                type="submit"
                disabled={!canAdd}
                className="w-full bg-foreground text-background py-4 eyebrow transition-all duration-300 disabled:opacity-40 disabled:cursor-not-allowed hover:bg-cream/90 relative overflow-hidden"
              >
                <span className={`inline-block transition-transform duration-300 ${added ? "-translate-y-8" : ""}`}>
                  {!activeVariant
                    ? "Select options"
                    : !activeVariant.availableForSale
                      ? "Sold out"
                      : `Add to Bag — ${money(price.amount, price.currencyCode)}`}
                </span>
                <span className={`absolute inset-0 flex items-center justify-center transition-transform duration-300 ${added ? "translate-y-0" : "translate-y-8"}`}>
                  Added ✓
                </span>
              </button>

              <button
                type="button"
                onClick={onBuyNow}
                disabled={!canAdd}
                className="w-full border hairline py-4 eyebrow transition-colors hover:bg-foreground hover:text-background disabled:opacity-40 disabled:cursor-not-allowed"
              >
                Buy it now
              </button>

              <div className="text-xs text-muted-foreground">Secure checkout powered by Shopify.</div>
            </form>

            {product.vendor && (
              <div className="border-t hairline pt-6 animate-rise" style={{ animationDelay: "320ms" }}>
                <div className="eyebrow mb-4">The Details</div>
                <ul className="space-y-2 text-sm text-muted-foreground">
                  <li className="flex gap-3"><span className="text-foreground/40">—</span><span>{product.vendor}</span></li>
                  {product.productType && (
                    <li className="flex gap-3"><span className="text-foreground/40">—</span><span>{product.productType}</span></li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>

      <RelatedProducts handle={product.handle} />
    </div>
  );
}

function RelatedProducts({ handle }: { handle: string }) {
  const { data: products } = useSuspenseQuery(productsQueryOptions());
  const related = products.filter((p) => p.node.handle !== handle).slice(0, 3);
  if (related.length === 0) return null;

  return (
    <section className="mx-auto max-w-[1600px] px-6 md:px-10 pt-32 md:pt-44">
      <div className="flex items-end justify-between mb-10">
        <h2 className="font-serif text-3xl md:text-4xl">
          Pairs <span className="italic text-foreground/70">with.</span>
        </h2>
      </div>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 md:gap-x-6 gap-y-12">
        {related.map((p) => {
          const n = p.node;
          const img = n.images.edges[0]?.node;
          return (
            <Link key={n.id} to="/products/$handle" params={{ handle: n.handle }} className="group block">
              <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
                {img && (
                  <img src={img.url} alt={img.altText ?? n.title} className="h-full w-full object-cover transition-transform duration-[900ms] group-hover:scale-[1.03]" loading="lazy" />
                )}
              </div>
              <div className="mt-4 flex items-start justify-between">
                <div>
                  <div className="font-serif text-lg">{n.title}</div>
                  <div className="text-xs text-muted-foreground mt-1">{n.productType || n.vendor}</div>
                </div>
                <div className="text-sm">
                  {money(n.priceRange.minVariantPrice.amount, n.priceRange.minVariantPrice.currencyCode)}
                </div>
              </div>
            </Link>
          );
        })}
      </div>
    </section>
  );
}
