import { useState, useEffect } from "react";

export const useShoppingListModal = ({ visible, onSelect, onCreate }) => {
  const [newListName, setNewListName] = useState("");
  const [selectedId, setSelectedId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("#155724");
  const [highlightId, setHighlightId] = useState(null);

  useEffect(() => { if (visible) setSelectedId(null); }, [visible]);

  const handleCreate = async () => {
    if (!newListName.trim()) return;
    setLoading(true);
    try {
      const response = await onCreate(newListName.trim());
      if (response?.errorMessage) { setMessage(response.errorMessage); setMessageColor("#c00"); }
      else if (response?.data?.Shopping_List_ItemID) {
        setHighlightId(response.data.Shopping_List_ItemID);
        setTimeout(() => setHighlightId(null), 1500);
        setMessage("List created successfully!"); setMessageColor("#155724");
        setTimeout(() => setMessage(""), 2000);
        setNewListName("");
      } else { setMessage("Unexpected response from backend."); setMessageColor("#c00"); }
    } catch (error) {
      console.error("Error creating list:", error.response?.data || error);
      const backendMsg = error.response?.data?.errorMessage || error.response?.data?.message || "Error creating list. Please try again.";
      setMessage(backendMsg); setMessageColor("#c00");
    }
    setLoading(false);
  };

  const handleSelect = async (item, onCloseModal) => {
    setSelectedId(item.Shopping_List_ItemID);
    setLoading(true);
    setMessage(`Adding product to "${item?.Name || 'list'}"...`);
    setMessageColor("#856404"); // yellow
    setTimeout(async () => {
      try { await onSelect(item); setMessage("Product added successfully!"); setMessageColor("#155724"); setTimeout(() => setMessage(""), 2000); }
      catch (err) { console.error(err); setMessage("Error adding product. Please try again."); setMessageColor("#c00"); setTimeout(() => setMessage(""), 2000); }
      setLoading(false); onCloseModal(); setSelectedId(null);
    }, 2000);
  };

  return {
    newListName, setNewListName, selectedId, showAll, setShowAll,
    loading, message, messageColor, highlightId,
    handleCreate, handleSelect
  };
};
