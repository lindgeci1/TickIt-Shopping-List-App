import { VITE_BASE_API_URL } from "@env";
import { Alert } from "react-native";

export const addProductsToShoppingList = async (productIds, shoppingListIds) => {
  try {
    // console.log("Calling addToShoppingList...");
    // console.log("Products to add:", productIds);
    // console.log("Shopping lists:", shoppingListIds);

    const response = await fetch(`${VITE_BASE_API_URL}/api/product-shopping-list-item/assign`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ProductIDs: productIds, ShoppingListItemIDs: shoppingListIds }),
    });

    const text = await response.text();
    // console.log("Raw response:", text);

    if (!response.ok) {
      console.error("Failed to add products:", text);
      Alert.alert("❌ Error", "Failed to add products: " + text);
      return;
    }

    // console.log("Products added successfully!");
    Alert.alert(
      "Success",
      "The selected products have been successfully added to the shopping list."
    );
  } catch (error) {
    console.error("Add to shopping list error:", error);
    Alert.alert("❌ Error", "Failed to add product: " + error.message);
  }
};
