# Shopify-connected storefront — architectural changes

Your development store is created and connected. It currently has **0 products**, so the storefront will render a real "No products yet" state until products exist.

Design, typography, palette, layout, hover reveals and animations stay exactly as they are. Only the data and commerce layers change.

## What gets added

| New file | Purpose |
| --- | --- |
| `src/lib/shopify.ts` | Storefront API client (API version 2025-07), GraphQL queries for products, single product by handle, and collections; TypeScript types |
| `src/stores/cartStore.ts` | Zustand cart backed by real Shopify carts (`cartCreate`, `cartLinesAdd`, `cartLinesUpdate`, `cartLinesRemove`), persisted to localStorage, stores `cartId` + `checkoutUrl` |
| `src/hooks/useCartSync.ts` | Re-syncs cart on load and tab focus so completed orders clear |

## What gets removed

| Removed | Reason |
| --- | --- |
| `src/lib/products.ts` (all 4 mock products, prices, sizes, copy) | Replaced by live Shopify products |
| `src/lib/cart.tsx` (localStorage-only mock cart context) | Replaced by the Shopify-backed Zustand store |
| `src/routes/checkout.tsx` (3-step fake checkout) | Requirement 9 — checkout is Shopify's real hosted checkout |
| `src/routes/order-confirmed.tsx` | Owned by Shopify's post-purchase flow |
| Mock product image assets (`p1`–`p4`) once product imagery comes from Shopify | Images come from the CDN |

Nothing in your Shopify store is deleted — these are local mock files only.

## What gets rewired

- **Collection page** — loads products via TanStack Query (`ensureQueryData` in the loader + `useSuspenseQuery`), same grid, same two-image hover reveal (falls back gracefully when a product has one image). Empty state if the store has no products.
- **Product route** — stays `/products/$handle` and resolves any Shopify handle, current or future, so new products work with no code change. `notFound()` when the handle doesn't exist. Size/variant buttons come from Shopify product options; unavailable variants are disabled.
- **Add to Bag** — adds the selected Shopify variant to the real cart.
- **Buy Now** — adds to cart, then opens the Shopify checkout URL.
- **Cart drawer + `/cart` page** — quantity changers and remove call Shopify cart mutations; totals use Shopify prices and currency.
- **Checkout button** — opens the Storefront-API `checkoutUrl` (with `channel=online_store`) in a new tab. No custom checkout.
- **Home page** — featured products come from Shopify instead of the mock array.
- **Money formatting** — driven by the currency code returned by Shopify rather than a hardcoded GBP formatter.

## Technical notes

- Storefront API version `2025-07`, called from the browser with the public storefront token (safe to expose).
- Reads use route loaders priming the TanStack Query cache; no `useEffect` fetching.
- Fully typed; no `any` on product/variant shapes.
- Routing stays TanStack Router file-based — no new route paths except removing the two mock checkout routes.

## After approval

Once the code is in, tell me the products you want (name + price) and I'll create them in Shopify so the storefront fills up.
