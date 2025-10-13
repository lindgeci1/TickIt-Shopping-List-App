import { VITE_BASE_API_URL } from "@env";

export async function useProductMarkets(products) {
  const allMarkets = {}; // key: productId -> array of markets

  for (const product of products) {
    try {
      const response = await fetch(
        `${VITE_BASE_API_URL}/api/product/${product.ProductID}/markets`
      );
      if (!response.ok) throw new Error(`HTTP ${response.status}`);
      const data = await response.json();

      allMarkets[product.ProductID] = data.map(market => ({
        id: market.MarketID,
        name: market.Name,
        price: market.Price ?? 0,
        logo: market.PhotoURL || null,
      }));
    } catch (err) {
      console.error(`Error fetching markets for ${product.Name}:`, err);
      allMarkets[product.ProductID] = [];
    }
  }

  return allMarkets; // returns { [productId]: [{id, name, price, logo}, ...] }
}
