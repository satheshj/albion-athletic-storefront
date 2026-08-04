import { Link } from "@tanstack/react-router";
import { money, type ShopifyProduct } from "@/lib/shopify";

export function ProductCard({
  product,
  i = 0,
  compact = false,
}: {
  product: ShopifyProduct;
  i?: number;
  compact?: boolean;
}) {
  const p = product.node;
  const images = p.images.edges.map((e) => e.node);
  const primary = images[0]?.url;
  const secondary = images[1]?.url ?? primary;
  const price = p.priceRange.minVariantPrice;
  const subtitle = p.productType || p.vendor || "Unisex";

  return (
    <Link
      to="/products/$handle"
      params={{ handle: p.handle }}
      className="group block animate-rise"
      style={{ animationDelay: `${i * 80}ms` }}
    >
      <div className="relative aspect-[4/5] overflow-hidden bg-secondary">
        {primary ? (
          <>
            <img
              src={primary}
              alt={images[0]?.altText ?? p.title}
              className="absolute inset-0 h-full w-full object-cover transition-all duration-[900ms] ease-out group-hover:scale-[1.03] group-hover:opacity-0"
              loading="lazy"
            />
            <img
              src={secondary}
              alt=""
              aria-hidden
              className="absolute inset-0 h-full w-full object-cover opacity-0 transition-opacity duration-[900ms] ease-out group-hover:opacity-100"
              loading="lazy"
            />
          </>
        ) : (
          <div className="absolute inset-0 flex items-center justify-center eyebrow text-muted-foreground">
            No image
          </div>
        )}
        <div className={`absolute inset-x-${compact ? "4" : "6"} bottom-${compact ? "4" : "6"} translate-y-3 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-500`}>
          <span className="block text-center bg-foreground text-background eyebrow py-3">
            View Product
          </span>
        </div>
      </div>
      <div className="mt-5 flex items-start justify-between gap-3">
        <div>
          <div className="font-serif text-lg leading-tight">{p.title}</div>
          <div className="text-xs text-muted-foreground mt-1">{subtitle}</div>
        </div>
        <div className="text-sm tabular-nums">{money(price.amount, price.currencyCode)}</div>
      </div>
    </Link>
  );
}

export function EmptyProducts() {
  return (
    <div className="col-span-full border-y hairline py-24 text-center">
      <p className="font-serif text-3xl">No products found.</p>
      <p className="mt-3 text-sm text-muted-foreground">
        This storefront is connected to Shopify — products will appear here as soon as they exist in the store.
      </p>
    </div>
  );
}
