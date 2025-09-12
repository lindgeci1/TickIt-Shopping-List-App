import { Alert } from "react-native";
import { VITE_BASE_API_URL } from "@env";

export const handleMarketPress = async (market, activeMarket, setActiveMarket, setMarketProducts) => {
  const newMarket = activeMarket?.MarketID === market.MarketID ? null : market;
  setActiveMarket(newMarket);

  if (!newMarket) {
    setMarketProducts([]);
    return;
  }

  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/market/${newMarket.MarketID}`);
    const json = await response.json();

    const products = (json.Products || []).map((p) => ({
      ProductID: p.ProductID,
      Name: p.Name,
      Category: p.Category,
      Photos: p.Photos || [],
    }));

    setMarketProducts(products);
  } catch (error) {
    console.error("Failed to fetch market products:", error);
    Alert.alert("❌ Error", "Failed to load products for market.");
    setMarketProducts([]);
  }
};
