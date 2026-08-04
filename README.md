# Albion Athletic Storefront

Build a minimalist, Shopify-structured e-commerce storefront for "ALBION Athletics," a premium unisex gym apparel brand. The layout should look like a bespoke Shopify theme utilizing sections and blocks. Use significant negative space and elegant typography (sharp sans-serif paired with a traditional serif). The color palette must evoke classic British sport: deep Oxford Blue, vintage off-white/cream, and rich Racing Green, set against a dark background.

Build out the following core Shopify template layouts with ultra-smooth animations:

1. Sections/Header.liquid: A minimalist top navbar featuring 'ALBION Athletics' typography, a desktop navigation menu link for 'COLLECTION 01' and 'ABOUT', and an icon that opens a Shopify-style slide-out AJAX cart drawer.

2. Templates/Index.json (Homepage):

- Hero Section Block: A striking full-width lifestyle banner of a unisex athlete training in a gym. The image must feel cool, gritty, and distinctly British. Overlayed with minimalist text: "ALBION ATHLETICS | DROP 01" and a Shopify button block linking to the collection.

- Featured Collection Section: A clean 4-column product grid mapping to a Shopify collection. Each product card must be simple, showing a high-quality product shot. On hover, the image subtly shifts to reveal details, with a minimalist "View Product" button appearing.

3. Templates/Product.json (Product Detail Page):

- Split-screen layout: 70% immersive product gallery on the left, 30% sticky details column on the right.

- Highlighting the unisex nature, tech details (e.g., "Heavyweight British Cotton"). Include interactive Shopify-style Variant Selectors (Size buttons XS-XL) and a primary "ADD TO BAG" form button that hooks directly into a mock AJAX cart response.

4. Sections/Cart-Drawer.liquid: A smooth, dark slide-out drawer that mimics Shopify's AJAX cart API. Displays line items, quantity changers, a subtotal, and a "PROCEED TO CHECKOUT" button.

5. Templates/Cart.json (Backup Cart Page) & Mock Checkout:

- A clean, minimalist backup checkout flow mimicking Shopify’s standard standard checkout layout (Customer Info -> Shipping -> Payment Summary).

- An "Order Confirmed" thank-you page.

Use high-quality placeholder images that feel premium and slightly moody. Keep the entire interaction flow streamlined, fast, and elegant.

This project was built with [Lovable](https://lovable.dev).

## Build with Lovable

Continue developing this project in the [Lovable editor](https://lovable.dev/projects/28ff5761-eac8-4a52-ad3f-0c50efae4d13).

- **Ship faster**: describe what you want to build and Lovable handles the code.
- **Stay in sync**: every change made in Lovable is committed straight to this repository.
- **Full ownership**: this code is yours. Push to `main` on GitHub and your changes sync back into Lovable, ready for your next prompt.

## Development

Prefer working locally? You need Node.js and npm — [install with nvm](https://github.com/nvm-sh/nvm#installing-and-updating).

```sh
git clone <this-repository-url>
cd <repository-name>
npm i
npm run dev
```
