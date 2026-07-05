import { Link } from "@tanstack/react-router";
import { useEffect } from "react";
import { money, useCart } from "@/lib/cart";

export function CartDrawer() {
  const { open, closeCart, lines, subtotal, update, remove } = useCart();

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && closeCart();
    document.addEventListener("keydown", onKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = "";
    };
  }, [open, closeCart]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50">
      <button
        aria-label="Close cart"
        onClick={closeCart}
        className="absolute inset-0 bg-black/60 animate-fade-slow"
      />
      <aside
        className="absolute right-0 top-0 h-full w-full max-w-[440px] flex flex-col bg-card border-l hairline animate-drawer shadow-2xl"
      >
        <div className="flex items-center justify-between px-6 h-16 border-b hairline">
          <span className="eyebrow">Your Bag ({lines.reduce((s, l) => s + l.quantity, 0)})</span>
          <button onClick={closeCart} className="eyebrow hover:opacity-70">Close</button>
        </div>

        {lines.length === 0 ? (
          <div className="flex-1 flex flex-col items-center justify-center px-8 text-center gap-4">
            <p className="font-serif text-2xl">Your bag is empty.</p>
            <p className="text-sm text-muted-foreground">Drop 01 is available now.</p>
            <Link
              to="/collection"
              onClick={closeCart}
              className="mt-4 inline-flex items-center justify-center border hairline px-6 py-3 eyebrow hover:bg-foreground hover:text-background transition-colors"
            >
              Shop Collection 01
            </Link>
          </div>
        ) : (
          <>
            <div className="flex-1 overflow-y-auto divide-y hairline">
              {lines.map((l) => (
                <div key={l.id} className="flex gap-4 px-6 py-5">
                  <div className="h-24 w-20 shrink-0 bg-secondary overflow-hidden">
                    <img src={l.image} alt={l.title} className="h-full w-full object-cover" />
                  </div>
                  <div className="flex-1 flex flex-col">
                    <div className="flex justify-between gap-3">
                      <div>
                        <div className="font-serif text-base leading-tight">{l.title}</div>
                        <div className="text-xs text-muted-foreground mt-1">{l.variant}</div>
                      </div>
                      <div className="text-sm">{money(l.price * l.quantity)}</div>
                    </div>
                    <div className="mt-auto flex items-center justify-between">
                      <div className="inline-flex items-center border hairline">
                        <button
                          onClick={() => update(l.id, l.quantity - 1)}
                          className="h-8 w-8 hover:bg-secondary transition-colors"
                          aria-label="Decrease"
                        >−</button>
                        <span className="w-8 text-center text-sm">{l.quantity}</span>
                        <button
                          onClick={() => update(l.id, l.quantity + 1)}
                          className="h-8 w-8 hover:bg-secondary transition-colors"
                          aria-label="Increase"
                        >+</button>
                      </div>
                      <button
                        onClick={() => remove(l.id)}
                        className="eyebrow text-muted-foreground hover:text-foreground transition-colors"
                      >Remove</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="border-t hairline px-6 py-5 space-y-4">
              <div className="flex items-center justify-between">
                <span className="eyebrow">Subtotal</span>
                <span className="font-serif text-lg">{money(subtotal)}</span>
              </div>
              <p className="text-xs text-muted-foreground">Shipping and taxes calculated at checkout.</p>
              <Link
                to="/checkout"
                onClick={closeCart}
                className="block text-center bg-foreground text-background py-4 eyebrow hover:bg-cream/90 transition-colors"
              >
                Proceed to Checkout
              </Link>
              <Link
                to="/cart"
                onClick={closeCart}
                className="block text-center eyebrow text-muted-foreground hover:text-foreground transition-colors"
              >
                View full bag
              </Link>
            </div>
          </>
        )}
      </aside>
    </div>
  );
}
