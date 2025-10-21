import { VITE_BASE_API_URL } from "@env";
export async function updateShoppingList({ shopping_list_id, name }) {
  try {
    const response = await fetch(
      `${VITE_BASE_API_URL}/api/shopping-list/update/${shopping_list_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: name }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      // Throw the backend message directly
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.message || "List updated successfully";
  } catch (err) {
    // Let the caller handle the toast message
    throw err;
  }
}

