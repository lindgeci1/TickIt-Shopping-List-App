import { VITE_BASE_API_URL } from "@env";

export async function assignProductToShoppingListItem({ shopping_list_item_id, product_id, market_id }) {
  try {
    const response = await fetch(
      `${VITE_BASE_API_URL}/api/shopping-list-item-product-market/assign-market`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          shopping_list_item_id,
          product_id,
          market_id,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    // console.error("Error assigning product-market:", err);
    throw err;
  }
}
