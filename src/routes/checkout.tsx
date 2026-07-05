import { createFileRoute, Link, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import { money, useCart } from "@/lib/cart";

export const Route = createFileRoute("/checkout")({
  head: () => ({
    meta: [
      { title: "Checkout — Albion Athletics" },
      { name: "description", content: "Secure checkout." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: Checkout,
});

const steps = ["Information", "Shipping", "Payment"] as const;

function Checkout() {
  const { lines, subtotal, clear } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(0);
  const shipping = subtotal >= 150 || subtotal === 0 ? 0 : 8;
  const total = subtotal + shipping;

  const next = (e: React.FormEvent) => {
    e.preventDefault();
    if (step < 2) return setStep(step + 1);
    clear();
    navigate({ to: "/order-confirmed" });
  };

  if (lines.length === 0) {
    return (
      <div className="mx-auto max-w-3xl px-6 md:px-10 pt-24 min-h-[70vh] text-center">
        <h1 className="font-serif text-4xl">Nothing to check out.</h1>
        <Link to="/collection" className="mt-8 inline-flex border hairline px-6 py-3 eyebrow hover:bg-foreground hover:text-background transition-colors">
          Shop Drop 01
        </Link>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1400px] px-6 md:px-10 pt-12 md:pt-20 grid md:grid-cols-[1.4fr_1fr] gap-16">
      <div>
        <div className="eyebrow text-muted-foreground mb-4">Checkout</div>
        <h1 className="font-serif text-4xl md:text-5xl mb-10">Complete your <span className="italic text-foreground/70">order.</span></h1>

        <ol className="flex items-center gap-6 mb-12">
          {steps.map((s, i) => (
            <li key={s} className="flex items-center gap-3">
              <span className={`h-6 w-6 rounded-full border hairline text-xs inline-flex items-center justify-center ${i <= step ? "bg-foreground text-background border-foreground" : ""}`}>{i + 1}</span>
              <span className={`eyebrow ${i === step ? "text-foreground" : "text-muted-foreground"}`}>{s}</span>
              {i < steps.length - 1 && <span className="w-8 h-px bg-border" />}
            </li>
          ))}
        </ol>

        <form onSubmit={next} className="space-y-6 animate-rise" key={step}>
          {step === 0 && (
            <>
              <Field label="Email" type="email" required placeholder="you@example.com" />
              <div className="grid grid-cols-2 gap-4">
                <Field label="First name" required />
                <Field label="Last name" required />
              </div>
              <Field label="Address" required />
              <div className="grid grid-cols-3 gap-4">
                <Field label="City" required />
                <Field label="Postcode" required />
                <Field label="Country" defaultValue="United Kingdom" required />
              </div>
            </>
          )}
          {step === 1 && (
            <div className="space-y-3">
              {[
                ["Royal Mail Tracked 48", subtotal >= 150 ? "Free" : "£8.00", true],
                ["DHL Express (Next Day)", "£18.00", false],
              ].map(([name, price, def]) => (
                <label key={name as string} className="flex items-center justify-between border hairline p-5 cursor-pointer hover:border-foreground/40 transition-colors">
                  <div className="flex items-center gap-4">
                    <input type="radio" name="ship" defaultChecked={def as boolean} className="accent-foreground" />
                    <span className="text-sm">{name}</span>
                  </div>
                  <span className="text-sm tabular-nums">{price}</span>
                </label>
              ))}
            </div>
          )}
          {step === 2 && (
            <>
              <Field label="Card number" placeholder="4242 4242 4242 4242" required />
              <div className="grid grid-cols-2 gap-4">
                <Field label="Expiry" placeholder="MM / YY" required />
                <Field label="CVC" placeholder="123" required />
              </div>
              <Field label="Name on card" required />
            </>
          )}

          <div className="flex items-center justify-between pt-4">
            {step > 0 ? (
              <button type="button" onClick={() => setStep(step - 1)} className="eyebrow text-muted-foreground hover:text-foreground transition-colors">
                ← Back
              </button>
            ) : <span />}
            <button type="submit" className="bg-foreground text-background px-8 py-4 eyebrow hover:bg-cream/90 transition-colors">
              {step < 2 ? "Continue" : `Pay ${money(total)}`}
            </button>
          </div>
        </form>
      </div>

      <aside className="md:sticky md:top-28 self-start border hairline p-8 bg-card">
        <div className="eyebrow mb-6">Order Summary</div>
        <div className="space-y-4 divide-y hairline">
          {lines.map((l) => (
            <div key={l.id} className="flex gap-4 pt-4 first:pt-0">
              <div className="h-20 w-16 bg-secondary overflow-hidden shrink-0">
                <img src={l.image} alt={l.title} className="h-full w-full object-cover" />
              </div>
              <div className="flex-1">
                <div className="font-serif">{l.title}</div>
                <div className="text-xs text-muted-foreground">{l.variant} · Qty {l.quantity}</div>
              </div>
              <div className="text-sm tabular-nums">{money(l.price * l.quantity)}</div>
            </div>
          ))}
        </div>
        <div className="mt-8 space-y-2 text-sm border-t hairline pt-6">
          <div className="flex justify-between"><span>Subtotal</span><span className="tabular-nums">{money(subtotal)}</span></div>
          <div className="flex justify-between text-muted-foreground"><span>Shipping</span><span>{shipping === 0 ? "Free" : money(shipping)}</span></div>
          <div className="flex justify-between items-baseline pt-3 border-t hairline mt-3">
            <span className="eyebrow">Total</span>
            <span className="font-serif text-2xl tabular-nums">{money(total)}</span>
          </div>
        </div>
      </aside>
    </div>
  );
}

function Field({ label, ...props }: { label: string } & React.InputHTMLAttributes<HTMLInputElement>) {
  return (
    <label className="block">
      <span className="eyebrow text-muted-foreground">{label}</span>
      <input
        {...props}
        className="mt-2 w-full bg-transparent border-b hairline py-3 outline-none focus:border-foreground transition-colors"
      />
    </label>
  );
}
