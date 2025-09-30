import { VITE_BASE_API_URL } from "@env";
import { Alert } from "react-native";

export const fetchFavoriteProducts = async (setFavoriteProducts) => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/product/favorites`);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    setFavoriteProducts(data);
    // console.log("Fetched favorite products:", data);
  } catch (error) {
    console.error("Fetch favorite products error:", error);
    Alert.alert("❌ Error", "Failed to fetch favorite products: " + error.message);
  }
};
