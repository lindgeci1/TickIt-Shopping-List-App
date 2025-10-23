import { Alert } from "react-native";
import { VITE_BASE_API_URL } from "@env";

export const fetchCategories = async (setCategories) => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/product/categories`);
    const json = await response.json();
    setCategories(json);
  } catch (error) {
    console.log("Fetch error:", error);
    Alert.alert("❌ Error", "Failed to fetch categories: " + error.message);
  }
};
