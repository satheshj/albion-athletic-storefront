import { Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { useCartStore } from "@/stores/cartStore";

export function Header() {
  const openCart = useCartStore((s) => s.openCart);
  const count = useCartStore((s) => s.items.reduce((sum, l) => sum + l.quantity, 0));
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header
      className={`fixed inset-x-0 top-0 z-40 transition-all duration-500 ${
        scrolled ? "backdrop-blur-md bg-background/70 border-b hairline" : "bg-transparent"
      }`}
    >
      <div className="mx-auto flex h-16 max-w-[1600px] items-center justify-between px-6 md:px-10">
        <div className="flex-1 hidden md:flex items-center gap-10 eyebrow text-foreground/80">
          <Link to="/collection" className="hover:text-foreground transition-colors">Collection</Link>
          <Link to="/about" className="hover:text-foreground transition-colors">About</Link>
        </div>
        <Link
          to="/"
          className="font-serif text-xl md:text-[1.35rem] tracking-tight text-foreground"
          style={{ letterSpacing: "0.02em" }}
        >
          ALBION <span className="italic text-foreground/70">Athletics</span>
        </Link>
        <div className="flex-1 flex items-center justify-end gap-6 eyebrow">
          <Link to="/collection" className="md:hidden">Shop</Link>
          <button
            onClick={openCart}
            className="group inline-flex items-center gap-2 hover:text-foreground transition-colors"
            aria-label="Open cart"
          >
            <span>Bag</span>
            <span className="inline-flex h-5 min-w-5 items-center justify-center rounded-full border hairline px-1.5 text-[0.65rem] tracking-normal">
              {count}
            </span>
          </button>
        </div>
      </div>
    </header>
  );
}
