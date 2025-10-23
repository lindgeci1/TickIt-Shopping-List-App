import { Alert } from "react-native";
import { VITE_BASE_API_URL } from "@env";

export const fetchProductsByCategory = async (category, setProducts) => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/product/category/${category}`);
    const json = await response.json();
    setProducts(json);
  } catch (error) {
    console.log("Fetch error:", error);
    Alert.alert("❌ Error", "Failed to fetch products: " + error.message);
  }
};
