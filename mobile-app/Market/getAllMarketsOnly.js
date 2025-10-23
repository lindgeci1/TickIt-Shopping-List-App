import { VITE_BASE_API_URL } from "@env";

export async function getAllMarketsOnly() {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/market/all-only`);
    if (!response.ok) {
      throw new Error(`Failed to fetch markets: ${response.status}`);
    }
    const data = await response.json();
    return data; // array of Market objects with ID, Name, Location, Photos
  } catch (error) {
    console.error("Error fetching markets:", error);
    return [];
  }
}
