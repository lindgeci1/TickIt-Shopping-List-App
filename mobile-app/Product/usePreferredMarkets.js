import { useState, useEffect } from "react";
import { VITE_BASE_API_URL } from "@env";

export default function usePreferredMarkets(products) {
  const [preferredMarkets, setPreferredMarkets] = useState({});
  const [marketMessages, setMarketMessages] = useState({});
  const [preferredMarketPrices, setPreferredMarketPrices] = useState({});

  useEffect(() => {
    const fetchAllPreferredMarkets = async () => {
      const logos = {};
      const messages = {};
      const prices = {};

      for (let product of products) {
        if (!preferredMarkets[product.ProductID]) {
          try {
            const res = await fetch(`${VITE_BASE_API_URL}/api/product-market/preferred/${product.ProductID}`);
            const data = await res.json();
            logos[product.ProductID] = data.PreferredMarketLogo || null;
            prices[product.ProductID] = data.Price ?? null;
            messages[product.ProductID] = data.message || "Product is not assigned to any market";
          } catch (err) {
            console.error("Failed to fetch preferred market", err);
            logos[product.ProductID] = null;
            prices[product.ProductID] = null;
            messages[product.ProductID] = "Product is not assigned to any market";
          }
        }
      }

      setPreferredMarkets(prev => ({ ...prev, ...logos }));
      setMarketMessages(prev => ({ ...prev, ...messages }));
      setPreferredMarketPrices(prev => ({ ...prev, ...prices }));
    };

    if (products.length) fetchAllPreferredMarkets();
  }, [products]);

  return { preferredMarkets, marketMessages, preferredMarketPrices };
}
