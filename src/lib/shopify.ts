import { toast } from "sonner";

export const SHOPIFY_API_VERSION = "2025-07";
export const SHOPIFY_STORE_PERMANENT_DOMAIN =
  "albion-athletic-storefront-qm5r5-dseexuys.myshopify.com";
export const SHOPIFY_STOREFRONT_URL = `https://${SHOPIFY_STORE_PERMANENT_DOMAIN}/api/${SHOPIFY_API_VERSION}/graphql.json`;
export const SHOPIFY_STOREFRONT_TOKEN = "8e1c9e5ce6ed24a5c3ee85e2ba2dd856";

export type Money = { amount: string; currencyCode: string };

export type ShopifyVariant = {
  id: string;
  title: string;
  price: Money;
  availableForSale: boolean;
  selectedOptions: Array<{ name: string; value: string }>;
  image: { url: string; altText: string | null } | null;
};

export type ShopifyProductNode = {
  id: string;
  title: string;
  description: string;
  handle: string;
  productType: string;
  vendor: string;
  priceRange: { minVariantPrice: Money };
  images: { edges: Array<{ node: { url: string; altText: string | null } }> };
  variants: { edges: Array<{ node: ShopifyVariant }> };
  options: Array<{ name: string; values: string[] }>;
};

export type ShopifyProduct = { node: ShopifyProductNode };

export type ShopifyCollection = {
  id: string;
  handle: string;
  title: string;
  description: string;
  image: { url: string; altText: string | null } | null;
};

const PRODUCT_FRAGMENT = `
  id
  title
  description
  handle
  productType
  vendor
  priceRange { minVariantPrice { amount currencyCode } }
  images(first: 10) { edges { node { url altText } } }
  variants(first: 50) {
    edges {
      node {
        id
        title
        price { amount currencyCode }
        availableForSale
        selectedOptions { name value }
        image { url altText }
      }
    }
  }
  options { name values }
`;

export const PRODUCTS_QUERY = `
  query GetProducts($first: Int!, $query: String) {
    products(first: $first, query: $query) {
      edges { node { ${PRODUCT_FRAGMENT} } }
    }
  }
`;

export const PRODUCT_BY_HANDLE_QUERY = `
  query GetProduct($handle: String!) {
    product(handle: $handle) { ${PRODUCT_FRAGMENT} }
  }
`;

export const COLLECTIONS_QUERY = `
  query GetCollections($first: Int!) {
    collections(first: $first) {
      edges { node { id handle title description image { url altText } } }
    }
  }
`;

export const COLLECTION_PRODUCTS_QUERY = `
  query GetCollectionProducts($handle: String!, $first: Int!) {
    collection(handle: $handle) {
      id
      handle
      title
      description
      products(first: $first) { edges { node { ${PRODUCT_FRAGMENT} } } }
    }
  }
`;

export async function storefrontApiRequest<T = unknown>(
  query: string,
  variables: Record<string, unknown> = {},
): Promise<{ data?: T } | undefined> {
  const response = await fetch(SHOPIFY_STOREFRONT_URL, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": SHOPIFY_STOREFRONT_TOKEN,
    },
    body: JSON.stringify({ query, variables }),
  });

  if (response.status === 402) {
    toast.error("Shopify: Payment required", {
      description:
        "Shopify API access requires an active Shopify billing plan. Visit https://admin.shopify.com to upgrade.",
    });
    return undefined;
  }

  if (!response.ok) {
    throw new Error(`HTTP error! status: ${response.status}`);
  }

  const json = (await response.json()) as {
    data?: T;
    errors?: Array<{ message: string }>;
  };

  if (json.errors?.length) {
    throw new Error(
      `Error calling Shopify: ${json.errors.map((e) => e.message).join(", ")}`,
    );
  }

  return json;
}

export async function fetchProducts(first = 50, query?: string): Promise<ShopifyProduct[]> {
  const res = await storefrontApiRequest<{
    products: { edges: ShopifyProduct[] };
  }>(PRODUCTS_QUERY, { first, query: query ?? null });
  return res?.data?.products?.edges ?? [];
}

export async function fetchProductByHandle(
  handle: string,
): Promise<ShopifyProductNode | null> {
  const res = await storefrontApiRequest<{ product: ShopifyProductNode | null }>(
    PRODUCT_BY_HANDLE_QUERY,
    { handle },
  );
  return res?.data?.product ?? null;
}

export async function fetchCollections(first = 20): Promise<ShopifyCollection[]> {
  const res = await storefrontApiRequest<{
    collections: { edges: Array<{ node: ShopifyCollection }> };
  }>(COLLECTIONS_QUERY, { first });
  return (res?.data?.collections?.edges ?? []).map((e) => e.node);
}

export async function fetchCollectionProducts(
  handle: string,
  first = 50,
): Promise<{ collection: ShopifyCollection | null; products: ShopifyProduct[] }> {
  const res = await storefrontApiRequest<{
    collection:
      | (ShopifyCollection & { products: { edges: ShopifyProduct[] } })
      | null;
  }>(COLLECTION_PRODUCTS_QUERY, { handle, first });
  const c = res?.data?.collection ?? null;
  if (!c) return { collection: null, products: [] };
  const { products, ...collection } = c;
  return { collection, products: products?.edges ?? [] };
}

export const productsQueryOptions = (query?: string) => ({
  queryKey: ["shopify", "products", query ?? "all"] as const,
  queryFn: () => fetchProducts(50, query),
});

export const productQueryOptions = (handle: string) => ({
  queryKey: ["shopify", "product", handle] as const,
  queryFn: () => fetchProductByHandle(handle),
});

export const collectionsQueryOptions = () => ({
  queryKey: ["shopify", "collections"] as const,
  queryFn: () => fetchCollections(20),
});

/** Format a Shopify money value using its own currency code. */
export function money(amount: string | number, currencyCode = "USD") {
  const value = typeof amount === "string" ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(undefined, {
    style: "currency",
    currency: currencyCode,
    maximumFractionDigits: Number.isInteger(value) ? 0 : 2,
  }).format(Number.isFinite(value) ? value : 0);
}

export const productImages = (p: ShopifyProductNode) =>
  p.images.edges.map((e) => e.node);

export const productVariants = (p: ShopifyProductNode) =>
  p.variants.edges.map((e) => e.node);
