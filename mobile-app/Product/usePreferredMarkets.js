import { VITE_BASE_API_URL } from "@env";

/**
 * Fetch preferred market info for a list of products.
 * @param {Array} products - Array of product objects with ProductID.
 * @returns {Promise<Object>} - Returns an object with logos, messages, and prices keyed by ProductID.
 */
export async function usePreferredMarkets(products) {
  const logos = {};
  const messages = {};
  const prices = {};

  for (let product of products) {
    try {
      const res = await fetch(`${VITE_BASE_API_URL}/api/market/preferred/${product.ProductID}`);
      const data = await res.json();
      logos[product.ProductID] = data.PreferredMarketLogo || null;
      prices[product.ProductID] = data.FinalPrice ?? null;
      messages[product.ProductID] = data.message || "Product is not assigned to any market";
    } catch (err) {
      console.error("Failed to fetch preferred market", err);
      logos[product.ProductID] = null;
      prices[product.ProductID] = null;
      messages[product.ProductID] = "Product is not assigned to any market";
    }
  }

  return { logos, messages, prices };
}
