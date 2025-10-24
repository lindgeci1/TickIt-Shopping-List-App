import { VITE_BASE_API_URL } from "@env";
import { Alert } from "react-native";

/**
 * Updates products in a shopping list (e.g., mark as bought).
 *
 * @param {number[]} productIds - Array of product IDs to update
 * @param {number[]} shoppingListIds - Array of shopping list IDs
 */
export const updateProductsStatusesFromShoppingList = async (productIds, shoppingListIds) => {
  try {
    console.log("Calling updateProductsStatusesFromShoppingList...");
    console.log("Products to update:", productIds);
    const response = await fetch(
      `${VITE_BASE_API_URL}/api/product-shopping-list-item/update`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ProductIDs: productIds,
          ShoppingListItemIDs: shoppingListIds,
        }),
      }
    );

    const text = await response.text();
    // console.log("Raw response:", text);

    if (!response.ok) {
      console.error("Failed to update products:", text);
      // Alert.alert("❌ Error", "Failed to update products: " + text);
      return;
    }

    console.log("Products updated successfully!");
    // Alert.alert(
    //   "Success",
    //   "The selected products have been successfully updated."
    // );
  } catch (error) {
    console.error("Update product status error:", error);
    Alert.alert("❌ Error", "Failed to update products: " + error.message);
  }
};
