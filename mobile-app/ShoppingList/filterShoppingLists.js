    import { useState, useEffect } from "react";

export const filterShoppingLists = ({ visible, onSelect }) => {
  const [selectedId, setSelectedId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("#155724");

  useEffect(() => { 
    if (visible) setSelectedId(null); 
  }, [visible]);

  const handleSelect = async (item, onCloseModal) => {
    setSelectedId(item.Shopping_List_ItemID);
    setLoading(true);
    setMessage(`Adding product to "${item?.Name || 'list'}"...`);
    setMessageColor("#856404"); // yellow

    console.log("Selected list for adding product:", item);

    setTimeout(async () => {
      try { 
        console.log("Calling onSelect for list:", item);
        await onSelect(item); 
        setMessage("Product added successfully!"); 
        setMessageColor("#155724"); 
        setTimeout(() => setMessage(""), 2000); 
      }
      catch (err) { 
        console.error("Error adding product:", err); 
        setMessage("Error adding product. Please check console."); 
        setMessageColor("#c00"); 
        setTimeout(() => setMessage(""), 2000); 
      }
      setLoading(false); 
      onCloseModal(); 
      setSelectedId(null);
    }, 2000);
  };

  return {
    selectedId, showAll, setShowAll,
    loading, message, messageColor,
    handleSelect
  };
};
