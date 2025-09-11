import { VITE_BASE_API_URL } from "@env";
import { Alert } from "react-native";

export const fetchProducts = async (setAllProducts, setProducts) => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/product/all`);
    if (!response.ok) throw new Error(`Error ${response.status}`);
    const data = await response.json();
    setAllProducts(data);
    setProducts(data);
    // console.log("Fetched products:", data);
  } catch (error) {
    console.error("Fetch products error:", error);
    Alert.alert("❌ Error", "Failed to fetch products: " + error.message);
  }
};
