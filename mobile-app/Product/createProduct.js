import { VITE_BASE_API_URL } from "@env";

export async function createProduct({ name, category }) {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/product/create`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        Name: name,
        Category: category,
      }),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || `HTTP ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (err) {
    //  console.error("Add products error:", err);
    throw err;
  }
}
