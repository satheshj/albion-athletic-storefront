import { createFileRoute, Link } from "@tanstack/react-router";

export const Route = createFileRoute("/order-confirmed")({
  head: () => ({
    meta: [
      { title: "Order Confirmed — Albion Athletics" },
      { name: "description", content: "Thank you for your order." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: OrderConfirmed,
});

function OrderConfirmed() {
  const orderNo = `AA-${Math.floor(100000 + Math.random() * 899999)}`;
  return (
    <div className="mx-auto max-w-3xl px-6 md:px-10 pt-24 pb-16 min-h-[70vh] text-center">
      <div className="eyebrow text-muted-foreground mb-6 animate-rise">Order Confirmed</div>
      <h1 className="font-serif text-6xl md:text-8xl tracking-tight animate-rise" style={{ animationDelay: "100ms" }}>
        Thank <span className="italic text-foreground/70">you.</span>
      </h1>
      <p className="mt-8 max-w-lg mx-auto text-muted-foreground animate-rise" style={{ animationDelay: "200ms" }}>
        Your order <span className="text-foreground">{orderNo}</span> is confirmed. A receipt is on its way. We'll email tracking as soon as your Drop 01 pieces leave the studio in London.
      </p>
      <div className="mt-12 flex flex-wrap gap-3 justify-center animate-rise" style={{ animationDelay: "300ms" }}>
        <Link to="/collection" className="border hairline px-6 py-3 eyebrow hover:bg-foreground hover:text-background transition-colors">
          Continue shopping
        </Link>
        <Link to="/" className="bg-foreground text-background px-6 py-3 eyebrow hover:bg-cream/90 transition-colors">
          Back to home
        </Link>
      </div>

      <div className="mt-20 border-t hairline pt-10 text-left grid md:grid-cols-3 gap-6 text-sm">
        <div>
          <div className="eyebrow mb-2">Shipping</div>
          <p className="text-muted-foreground">Royal Mail Tracked 48. Estimated 2–3 working days across the UK.</p>
        </div>
        <div>
          <div className="eyebrow mb-2">Returns</div>
          <p className="text-muted-foreground">30-day free UK returns on all unworn pieces.</p>
        </div>
        <div>
          <div className="eyebrow mb-2">Support</div>
          <p className="text-muted-foreground">studio@albionathletics.co · Mon–Fri, 9–5 GMT.</p>
        </div>
      </div>
    </div>
  );
}
