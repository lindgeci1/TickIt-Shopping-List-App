import { VITE_BASE_API_URL } from "@env";

export async function useMarketPhotoPrice(productID, shoppingListItemID) {
  try {
    const response = await fetch(
      `${VITE_BASE_API_URL}/api/product/${productID}/shopping-list/${shoppingListItemID}/market-photo-price`
    );

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }

    const data = await response.json();
    // console.log(data)
    // Return structured object
    return {
      marketId: data.MarketID,
      name: data.Name,
      price: data.SelectedPrice ?? 0,
      photoURL: data.PhotoURL || null,
      selected: data.Selected ?? false, // assuming DTO contains a Selected field
    };
  } catch (err) {
    return null;
  }
}
