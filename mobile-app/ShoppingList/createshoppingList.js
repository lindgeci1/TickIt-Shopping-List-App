import { VITE_BASE_API_URL } from "@env";

export async function createshoppingList(name) {
  if (!name) throw new Error("List name is required");

  const response = await fetch(
    `${VITE_BASE_API_URL}/api/shopping-list/create`,
    {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Name: name, AddedAt: new Date().toISOString() }),
    }
  );

  const data = await response.json();

  if (!response.ok) {
    throw new Error(data.message || "Failed to create list");
  }

  return data;
}
