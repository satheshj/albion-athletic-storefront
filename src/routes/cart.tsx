import { createFileRoute, Link } from "@tanstack/react-router";
import { money } from "@/lib/shopify";
import { openShopifyCheckout, useCartStore } from "@/stores/cartStore";

export const Route = createFileRoute("/cart")({
  head: () => ({
    meta: [
      { title: "Your Bag — Albion Athletics" },
      { name: "description", content: "Review the items in your Albion Athletics bag." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: CartPage,
});

function CartPage() {
  const items = useCartStore((s) => s.items);
  const updateQuantity = useCartStore((s) => s.updateQuantity);
  const removeItem = useCartStore((s) => s.removeItem);
  const isLoading = useCartStore((s) => s.isLoading);
  const getCheckoutUrl = useCartStore((s) => s.getCheckoutUrl);

  const currency = items[0]?.price.currencyCode ?? "USD";
  const subtotal = items.reduce((s, l) => s + parseFloat(l.price.amount) * l.quantity, 0);

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-16 md:pt-24 min-h-[70vh]">
      <div className="mb-12 md:mb-16">
        <div className="eyebrow text-muted-foreground mb-4">Your Bag</div>
        <h1 className="font-serif text-5xl md:text-7xl tracking-tight animate-rise">
          The <span className="italic text-foreground/70">bag.</span>
        </h1>
      </div>

      {items.length === 0 ? (
        <div className="border-y hairline py-24 text-center">
          <p className="font-serif text-2xl">Your bag is empty.</p>
          <Link to="/collection" className="mt-6 inline-flex border hairline px-6 py-3 eyebrow hover:bg-foreground hover:text-background transition-colors">
            Shop the Collection
          </Link>
        </div>
      ) : (
        <div className="grid md:grid-cols-3 gap-10 md:gap-16 items-start">
          <div className="md:col-span-2 border-t hairline">
            {items.map((l) => (
              <div key={l.variantId} className="grid grid-cols-[100px_1fr_auto] gap-6 py-6 border-b hairline">
                <div className="aspect-[4/5] bg-secondary overflow-hidden">
                  {l.image && <img src={l.image} alt={l.title} className="h-full w-full object-cover" />}
                </div>
                <div className="flex flex-col justify-between">
                  <div>
                    <div className="font-serif text-xl">{l.title}</div>
                    <div className="text-xs text-muted-foreground mt-1">
                      {l.selectedOptions.map((o) => o.value).join(" · ") || l.variantTitle}
                    </div>
                  </div>
                  <div className="flex items-center gap-6">
                    <div className="inline-flex items-center border hairline">
                      <button
                        className="h-9 w-9 hover:bg-secondary transition-colors disabled:opacity-40"
                        disabled={isLoading}
                        onClick={() => updateQuantity(l.variantId, l.quantity - 1)}
                      >−</button>
                      <span className="w-9 text-center text-sm">{l.quantity}</span>
                      <button
                        className="h-9 w-9 hover:bg-secondary transition-colors disabled:opacity-40"
                        disabled={isLoading}
                        onClick={() => updateQuantity(l.variantId, l.quantity + 1)}
                      >+</button>
                    </div>
                    <button
                      className="eyebrow text-muted-foreground hover:text-foreground transition-colors disabled:opacity-40"
                      disabled={isLoading}
                      onClick={() => removeItem(l.variantId)}
                    >Remove</button>
                  </div>
                </div>
                <div className="text-right text-sm tabular-nums">
                  {money(parseFloat(l.price.amount) * l.quantity, l.price.currencyCode)}
                </div>
              </div>
            ))}
          </div>

          <aside className="md:sticky md:top-28 border hairline p-8 space-y-6">
            <div className="eyebrow">Summary</div>
            <div className="space-y-3 text-sm">
              <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{money(subtotal, currency)}</span></div>
              <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>Calculated at checkout</span></div>
            </div>
            <div className="border-t hairline pt-4 flex justify-between items-baseline">
              <span className="eyebrow">Total</span>
              <span className="font-serif text-2xl tabular-nums">{money(subtotal, currency)}</span>
            </div>
            <button
              onClick={() => openShopifyCheckout(getCheckoutUrl())}
              disabled={isLoading}
              className="w-full block text-center bg-foreground text-background py-4 eyebrow hover:bg-cream/90 transition-colors disabled:opacity-50"
            >
              Proceed to Checkout
            </button>
          </aside>
        </div>
      )}
    </div>
  );
}
