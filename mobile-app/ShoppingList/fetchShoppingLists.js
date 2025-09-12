import { VITE_BASE_API_URL } from "@env";
import { Alert } from "react-native";

/**
 * Fetches all shopping lists from the API.
 * @returns {Promise<Array>} Array of shopping list objects
 */
export const fetchShoppingLists = async () => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/shopping-list/all`);
    if (!response.ok) {
      const text = await response.text();
      console.error("Failed to fetch shopping lists:", text);
      Alert.alert("Error", "Failed to fetch shopping lists: " + text);
      return [];
    }
    const json = await response.json();
    return json;
  } catch (error) {
    console.error("Error fetching shopping lists:", error);
    Alert.alert("Error", "Failed to fetch shopping lists: " + error.message);
    return [];
  }
};
