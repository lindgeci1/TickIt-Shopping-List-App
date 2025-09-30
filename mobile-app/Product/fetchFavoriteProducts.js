import { VITE_BASE_API_URL } from "@env";
import { Alert } from "react-native";

export const fetchFavoriteProducts = async () => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/product/favorites`);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    return data; // return instead of calling setFavoriteProducts
  } catch (error) {
    console.error("Fetch favorite products error:", error);
    Alert.alert("❌ Error", "Failed to fetch favorite products: " + error.message);
    return []; // return empty array on error
  }
};
