export function Footer() {
  return (
    <footer className="mt-32 border-t hairline">
      <div className="overflow-hidden border-b hairline py-6">
        <div className="flex whitespace-nowrap animate-marquee font-serif text-4xl md:text-6xl italic text-foreground/40">
          {Array.from({ length: 6 }).map((_, i) => (
            <span key={i} className="px-8">
              Built in Britain <span className="not-italic">·</span> Drop 01 <span className="not-italic">·</span> Made to be worn hard <span className="not-italic">·</span>
            </span>
          ))}
        </div>
      </div>
      <div className="mx-auto max-w-[1600px] px-6 md:px-10 py-16 grid gap-10 md:grid-cols-4">
        <div className="md:col-span-2">
          <div className="font-serif text-2xl">ALBION <span className="italic text-foreground/70">Athletics</span></div>
          <p className="mt-4 max-w-sm text-sm text-muted-foreground">
            Heavyweight training apparel, made in small runs from British and Portuguese cotton. Unisex by design.
          </p>
        </div>
        <div>
          <div className="eyebrow mb-4">Shop</div>
          <ul className="space-y-2 text-sm">
            <li>Collection 01</li><li>Gift Cards</li><li>Size Guide</li>
          </ul>
        </div>
        <div>
          <div className="eyebrow mb-4">Studio</div>
          <ul className="space-y-2 text-sm">
            <li>About</li><li>Journal</li><li>Stockists</li>
          </ul>
        </div>
      </div>
      <div className="border-t hairline px-6 md:px-10 py-6 flex flex-wrap items-center justify-between gap-3 text-xs text-muted-foreground">
        <span>© {new Date().getFullYear()} Albion Athletics Ltd. London.</span>
        <span>Shopify · Powered storefront</span>
      </div>
    </footer>
  );
}
