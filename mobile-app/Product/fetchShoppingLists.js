import { VITE_BASE_API_URL } from "@env";

export const fetchShoppingLists = async (setShoppingLists, setErrorMessage) => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/shopping-list/all`);
    if (!response.ok) {
      // Try to parse backend validation message
      const errorData = await response.json().catch(() => null);
      if (errorData?.message) {
        setErrorMessage(errorData.message);
        console.error("Backend validation error:", errorData);
      } else {
        throw new Error(`Error ${response.status}`);
      }
      return;
    }

    const data = await response.json();
    setShoppingLists(data);
    // console.log("Fetched shopping lists:", data);
  } catch (error) {
    // Show backend message if exists
    console.error("Error fetching lists:", error.response?.data || error);
    if (error.response?.data?.message) {
      setErrorMessage(error.response.data.message);
    } else {
      setErrorMessage("Failed to fetch shopping lists. Please try again.");
    }
  }
};
