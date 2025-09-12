import { Alert } from "react-native";
import { VITE_BASE_API_URL } from "@env";

export const fetchMarkets = async (setMarkets) => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/market/all`);
    const json = await response.json();
    setMarkets(json);
  } catch (error) {
    console.log("Fetch error:", error);
    Alert.alert("❌ Error", "Failed to fetch markets: " + error.message);
  }
};
