import { VITE_BASE_API_URL } from "@env";

export async function updateShoppingList({ shopping_list_id, name }) {
  try {
    const now = new Date().toISOString(); // current date/time in ISO format

    const response = await fetch(
      `${VITE_BASE_API_URL}/api/shopping-list/update/${shopping_list_id}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          Name: name,
          AddedAt: now // add current timestamp
        }),
      }
    );

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || `HTTP ${response.status}`);
    }

    return data.message || "List updated successfully";
  } catch (err) {
    throw err;
  }
}
