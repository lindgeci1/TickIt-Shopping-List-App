import { VITE_BASE_API_URL } from "@env";

/**
 * Fetch preferred market info for products.
 * Returns array of products, each may have:
 * - preferredMarketLogo
 * - marketMessage
 */
export async function fetchPreferredMarkets(products) {
  const updatedProducts = [];

  for (let product of products) {
    try {
      const res = await fetch(`${VITE_BASE_API_URL}/api/product-market/preferred/${product.ProductID}`);
      const data = await res.json();

      // Always spread product
      const updatedProduct = { ...product };

      if (data.logoUrl) {
        updatedProduct.preferredMarketLogo = data.logoUrl;
      }

      if (data.message) {
        updatedProduct.marketMessage = data.message;
      }

      updatedProducts.push(updatedProduct);

    } catch (err) {
      console.error(err);
      updatedProducts.push(product);
    }
  }

  return updatedProducts;
}
