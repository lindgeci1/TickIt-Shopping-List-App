import { VITE_BASE_API_URL } from "@env";
import { Alert } from "react-native";

/**
 * Removes products from one or more shopping lists.
 *
 * @param {number[]} productIds - Array of product IDs to remove
 * @param {number[]} shoppingListIds - Array of shopping list IDs
 */
export const removeProductsFromShoppingList = async (productIds, shoppingListIds) => {
  try {
    console.log("Calling removeProductsFromShoppingList...");
    console.log("Products to remove:", productIds);
    console.log("Shopping lists:", shoppingListIds);

    const response = await fetch(
      `${VITE_BASE_API_URL}/api/product-shopping-list-item/remove`,
      {
        method: "DELETE",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ProductIDs: productIds,
          ShoppingListItemIDs: shoppingListIds,
        }),
      }
    );

    const text = await response.text();
    console.log("Raw response:", text);

    if (!response.ok) {
      console.error("Failed to remove products:", text);
      // Alert.alert("❌ Error", "Failed to remove products: " + text);
      return;
    }

    console.log("Products removed successfully!");
//    Alert.alert(
//   "Success",
//   "The selected products have been successfully removed from the shopping list."
// );

  } catch (error) {
    console.error("Remove from shopping list error:", error);
    Alert.alert("❌ Error", "Failed to remove product: " + error.message);
  }
};
