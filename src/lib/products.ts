import p1 from "@/assets/p1.jpg.asset.json";
import p1b from "@/assets/p1b.jpg.asset.json";
import p2 from "@/assets/p2.jpg.asset.json";
import p3 from "@/assets/p3.jpg.asset.json";
import p4 from "@/assets/p4.jpg.asset.json";

export type Product = {
  handle: string;
  title: string;
  subtitle: string;
  price: number;
  colorLabel: string;
  images: string[];
  description: string;
  details: string[];
  sizes: string[];
};

export const products: Product[] = [
  {
    handle: "heavyweight-tee-cream",
    title: "Heavyweight Tee",
    subtitle: "Vintage Cream",
    price: 68,
    colorLabel: "Cream",
    images: [p1.url, p1b.url],
    description:
      "A defining piece of Drop 01. Cut from 280gsm loop-wheeled British cotton, boxed shoulders and a slightly cropped hem. Unisex fit. Made to be worn hard.",
    details: [
      "280gsm loop-wheeled British cotton",
      "Garment-dyed for a lived-in hand feel",
      "Boxed shoulder, unisex fit",
      "Woven ALBION label at hem",
      "Made in Portugal",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    handle: "training-hoodie-oxford",
    title: "Training Hoodie",
    subtitle: "Oxford Blue",
    price: 148,
    colorLabel: "Oxford",
    images: [p2.url, p1b.url],
    description:
      "Heavyweight brushed-back fleece with a structured hood and racer-cut sleeves. Built for slow winter miles and cold-room lifts.",
    details: [
      "440gsm brushed-back fleece",
      "Racer-cut raglan sleeves",
      "Twin-needle stitched throughout",
      "Unisex fit",
      "Made in Portugal",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    handle: "crewneck-racing-green",
    title: "Field Crewneck",
    subtitle: "Racing Green",
    price: 128,
    colorLabel: "Racing",
    images: [p3.url, p1b.url],
    description:
      "A proper crewneck. Dense, brushed-back French terry in a deep racing green, cut long in the body with ribbed cuffs and hem.",
    details: [
      "420gsm French terry",
      "Ribbed collar, cuffs and hem",
      "Long-body unisex fit",
      "Made in Portugal",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
  {
    handle: "field-short-cream",
    title: "Field Short",
    subtitle: "Vintage Cream",
    price: 88,
    colorLabel: "Cream",
    images: [p4.url, p1b.url],
    description:
      "Wide-leg training short in washed heavyweight cotton twill. Elastic waist with a soft cotton drawcord and deep side pockets.",
    details: [
      "Washed 280gsm cotton twill",
      "Elastic waist, cotton drawcord",
      "Deep side pockets",
      "Made in Portugal",
    ],
    sizes: ["XS", "S", "M", "L", "XL"],
  },
];

export const productByHandle = (h: string) => products.find((p) => p.handle === h);
