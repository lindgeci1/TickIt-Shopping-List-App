import { VITE_BASE_API_URL } from "@env";
import { Alert } from "react-native";

export const removeProductFromMarketShoppingList = async (productId, shoppingListItemId) => {
  try {
    const response = await fetch(
      `${VITE_BASE_API_URL}/api/shopping-list-item-product-market/${productId}/shopping-list/${shoppingListItemId}/remove`,
      {
        method: "DELETE",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );

    if (!response.ok) throw new Error(`Error ${response.status}`);

    const data = await response.json();
    console.log("Remove product response:", data);
    return data;
  } catch (error) {
    // console.error("Remove product error:", error);
    // Alert.alert("❌ Error", "Failed to remove product: " + error.message);
    return null;
  }
};
