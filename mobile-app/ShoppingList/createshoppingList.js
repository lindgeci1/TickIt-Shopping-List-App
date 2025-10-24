import { VITE_BASE_API_URL } from "@env";

export async function createshoppingList(name) {
  if (!name) throw new Error("List name is required");

  try {
    const response = await fetch(
      `${VITE_BASE_API_URL}/api/shopping-list/create`,
      {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ Name: name, AddedAt: new Date().toISOString() }),
      }
    );

    const text = await response.text(); // read raw response text
    // console.log("API raw response:", text);

    let data;
    try {
      data = JSON.parse(text); // try parsing JSON
    } catch (e) {
      throw new Error(`Invalid JSON response: ${text}`);
    }

    if (!response.ok) {
      throw new Error(data.message || "Failed to create list");
    }

    return data;
  } catch (err) {
    // console.error("API call error:", err);
    throw err;
  }
}
