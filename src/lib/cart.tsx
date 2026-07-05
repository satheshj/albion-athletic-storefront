import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";

export type CartLine = {
  id: string;
  handle: string;
  title: string;
  variant: string;
  price: number;
  image: string;
  quantity: number;
};

type CartCtx = {
  lines: CartLine[];
  count: number;
  subtotal: number;
  open: boolean;
  openCart: () => void;
  closeCart: () => void;
  add: (line: Omit<CartLine, "id" | "quantity"> & { quantity?: number }) => void;
  update: (id: string, qty: number) => void;
  remove: (id: string) => void;
  clear: () => void;
};

const Ctx = createContext<CartCtx | null>(null);
const KEY = "albion-cart-v1";

export function CartProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<CartLine[]>([]);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) setLines(JSON.parse(raw));
    } catch {}
  }, []);
  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(lines)); } catch {}
  }, [lines]);

  const add: CartCtx["add"] = useCallback((line) => {
    const id = `${line.handle}::${line.variant}`;
    setLines((prev) => {
      const existing = prev.find((l) => l.id === id);
      if (existing) {
        return prev.map((l) => (l.id === id ? { ...l, quantity: l.quantity + (line.quantity ?? 1) } : l));
      }
      return [...prev, { ...line, id, quantity: line.quantity ?? 1 }];
    });
    setOpen(true);
  }, []);

  const update = useCallback((id: string, qty: number) => {
    setLines((prev) => prev.flatMap((l) => (l.id === id ? (qty <= 0 ? [] : [{ ...l, quantity: qty }]) : [l])));
  }, []);
  const remove = useCallback((id: string) => setLines((prev) => prev.filter((l) => l.id !== id)), []);
  const clear = useCallback(() => setLines([]), []);

  const value = useMemo<CartCtx>(() => {
    const count = lines.reduce((s, l) => s + l.quantity, 0);
    const subtotal = lines.reduce((s, l) => s + l.quantity * l.price, 0);
    return {
      lines, count, subtotal, open,
      openCart: () => setOpen(true),
      closeCart: () => setOpen(false),
      add, update, remove, clear,
    };
  }, [lines, open, add, update, remove, clear]);

  return <Ctx.Provider value={value}>{children}</Ctx.Provider>;
}

export function useCart() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useCart outside CartProvider");
  return c;
}

export const money = (n: number) =>
  new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP", maximumFractionDigits: 0 }).format(n);
