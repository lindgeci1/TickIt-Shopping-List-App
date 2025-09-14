import { VITE_BASE_API_URL } from "@env";

export const deleteShoppingList = async (id, onSuccess, setErrorMessage) => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/shopping-list/delete/${id}`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
      },
    });

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

    // Optionally parse backend response if needed
    const data = await response.json().catch(() => null);

    // Call onSuccess callback to refresh list or show a message
    if (onSuccess) onSuccess(data);
  } catch (error) {
    console.error("Error deleting shopping list:", error.response?.data || error);
    if (error.response?.data?.message) {
      setErrorMessage(error.response.data.message);
    } else {
      setErrorMessage("Failed to delete shopping list. Please try again.");
    }
  }
};
