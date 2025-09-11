import { VITE_BASE_API_URL } from "@env";
import { Alert } from "react-native";

/**
 * Adds a product to a specific shopping list.
 *
 * @param {number} productId - The ID of the product to add
 * @param {number} shoppingListId - The ID of the target shopping list
 */
export const addToShoppingList = async (productId, shoppingListId) => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/product-shopping-list-item/assign/${productId}`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ProductID: productId, ShoppingListItemIDs: [shoppingListId] }),
    });

    const text = await response.text();
    // console.log("Add product raw response:", text);

    if (!response.ok) {
      Alert.alert("❌ Error", "Failed to add product: " + text);
      return;
    }

    Alert.alert("✅ Success", "Product added to list!");
  } catch (error) {
    console.error("Add to shopping list error:", error);
    Alert.alert("❌ Error", "Failed to add product: " + error.message);
  }
};
