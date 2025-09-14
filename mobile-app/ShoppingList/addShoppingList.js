import { useState } from "react";

export const addShoppingList = (onCreate) => {
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("#155724");
  const [highlightId, setHighlightId] = useState(null);

  const handleCreate = async () => {
    if (!newListName.trim()) return;
    setLoading(true);
    console.log("Creating new shopping list:", newListName);

    try {
      const response = await onCreate(newListName.trim());
      console.log("Create response:", response);

      if (response?.errorMessage) { 
        setMessage(response.errorMessage); 
        setMessageColor("#c00"); 
      } else if (response?.data?.Shopping_List_ItemID) {
        setHighlightId(response.data.Shopping_List_ItemID);
        setTimeout(() => setHighlightId(null), 1500);
        setMessage("List created successfully!"); 
        setMessageColor("#155724");
        setTimeout(() => setMessage(""), 2000);
        setNewListName("");
      } else { 
        setMessage("Unexpected response from backend."); 
        setMessageColor("#c00"); 
      }
    } catch (error) {
      console.error("Error creating list:", error.response?.data || error);
      const backendMsg = error.response?.data?.errorMessage || error.response?.data?.message || "Error creating list. Please try again.";
      setMessage(backendMsg); 
      setMessageColor("#c00");
    }

    setLoading(false);
  };

  return {
    newListName, setNewListName,
    loading, message, messageColor, highlightId,
    handleCreate
  };
};
