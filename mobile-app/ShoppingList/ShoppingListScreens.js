import React, { useState, useEffect } from "react";
import { View, Text, Modal, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform } from "react-native";
import { VITE_BASE_API_URL } from "@env";
import Toast from "../utils/Toast";
import { createshoppingList } from "./createshoppingList";
import { Ionicons } from "@expo/vector-icons";
export default function ShoppingListScreens({ visible, onClose, shoppingLists, onSelect }) {
  const [newListName, setNewListName] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [messageColor, setMessageColor] = useState("#155724");
  const [highlightId, setHighlightId] = useState(null);
  const [showAll, setShowAll] = useState(false);
  const [selectedId, setSelectedId] = useState(null);
  const [addingProducts, setAddingProducts] = useState(false); // track adding state
  const [toastMessage, setToastMessage] = useState(null);
useEffect(() => {
  if (visible) {
    setHighlightId(null);
    setSelectedId(null); // clear previous selection
  }
}, [visible]);
  const showTempMessage = (msg, color = "#155724") => {
    setMessage(msg);
    setMessageColor(color);
    setTimeout(() => setMessage(""), 2000); // hide after 2 seconds
  };

const handleCreate = async () => {
  if (!newListName) return;
  setLoading(true);
  try {
    const newList = await createshoppingList(newListName);
    shoppingLists.push(newList);
    setNewListName("");
    setToastMessage("List created successfully!");
  } catch (err) {
    showTempMessage(err.message || "Network error", "#721c24");
  } finally {
    setLoading(false);
  }
};

  const handleSelect = async (list) => {
    setSelectedId(list.Shopping_List_ItemID);
    setAddingProducts(true);
    showTempMessage("Adding product(s) to list...", "#856404"); // yellow color for adding
    await new Promise((resolve) => setTimeout(resolve, 2000)); // show for 2 seconds
    await onSelect(list); // call the parent callback
    setAddingProducts(false);
  };

  const reversedLists = Array.isArray(shoppingLists) ? [...shoppingLists].reverse() : [];
  const displayedLists = showAll ? reversedLists : reversedLists.slice(0, 2);

return (
  <>
    <Modal visible={visible} animationType="slide" transparent>
      <KeyboardAvoidingView
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        style={styles.overlay}
      >
        {/* Toast inside the overlay */}
       

        <View style={styles.container}>
          <Text style={styles.title}>Select Shopping List</Text>

          {/* Description / Instruction */}
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionHint}>
              Select the list where you want the product to be in.
            </Text>
            <View style={styles.separator} />
          </View>

      {shoppingLists.length > 0 ? (
        <>
          <FlatList
            data={displayedLists}
            keyExtractor={(item, i) => item?.Shopping_List_ItemID?.toString() || i.toString()}
            renderItem={({ item, index }) =>
              item && (
                <TouchableOpacity
                  style={[
                    styles.listItem,
                    (item.Shopping_List_ItemID === selectedId || addingProducts) && styles.disabledButton,
                  ]}
                  disabled={loading || addingProducts}
                  onPress={() => handleSelect(item)}
                >
                  {addingProducts && item.Shopping_List_ItemID === selectedId ? (
                    <View style={{ flexDirection: "row", alignItems: "center" }}>
                      <ActivityIndicator size="small" color="#856404" />
                      <Text style={{ marginLeft: 5, color: "#856404", fontWeight: "600" }}>Adding...</Text>
                    </View>
                  ) : (
                    <Text style={styles.listText}>{item?.Name || "Unnamed List"}</Text>
                  )}
                </TouchableOpacity>
              )
            }
            style={{ maxHeight: 200, marginBottom: 5 }}
          />


          {shoppingLists.length > 3 && !showAll && (
            <TouchableOpacity onPress={() => setShowAll(true)} style={styles.showMoreButton}>
              <Text style={styles.showMoreText}>Show More</Text>
            </TouchableOpacity>
          )}
          {showAll && (
            <TouchableOpacity onPress={() => setShowAll(false)} style={styles.showMoreButton}>
              <Text style={styles.showMoreText}>Collapse All</Text>
            </TouchableOpacity>
          )}
        </>
      ) : (
        <Text style={styles.emptyText}>No lists yet, create one below</Text>
      )}


          <View style={styles.createContainer}>
            <TextInput
              style={styles.input}
              placeholder="New list name..."
              placeholderTextColor="#555"
              value={newListName}
              onFocus={() => showAll && setShowAll(false)}
              onChangeText={setNewListName}
            />
            <TouchableOpacity
              style={[styles.createButton, (loading || addingProducts) && { opacity: 0.5 }]}
              onPress={handleCreate}
              disabled={loading || addingProducts}
            >
              {loading ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#fff" />
                  <Text style={[styles.createButtonText, { marginLeft: 5 }]}>Creating...</Text>
                </View>
              ) : addingProducts ? (
                <View style={{ flexDirection: "row", alignItems: "center" }}>
                  <ActivityIndicator size="small" color="#856404" />
                  <Text style={[styles.createButtonText, { color: "#fff", marginLeft: 5 }]}>
                    Adding product(s)...
                  </Text>
                </View>
              ) : (
                <Text style={styles.createButtonText}>Create List</Text>
              )}
            </TouchableOpacity>

            {/* Close button below the Add List */}
            <TouchableOpacity
              style={[styles.closeInlineButton, { marginTop: 10 }]}
              onPress={() => {
                onClose();
                setToastMessage(null); // reset toast
              }}
              disabled={addingProducts}
            >
              <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
        {toastMessage && (
  <Toast
    message={toastMessage}
    onHide={() => setToastMessage(null)}
  />
)}
      </KeyboardAvoidingView>
    </Modal>
  </>
);


}
const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    width: "90%",
    maxHeight: "80%",
    backgroundColor: "#fff",
    borderRadius: 15,
    padding: 20,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 10,
    elevation: 10,
  },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 15, color: "#2d3436" },
  listItem: {
    paddingVertical: 12,
    paddingHorizontal: 15,
    borderRadius: 12,
    backgroundColor: "#f5f5f5",
    marginBottom: 8,
  },
  disabledButton: { opacity: 0.5 },
  selectedListItem: { backgroundColor: "#6c63ff20" },
  listText: { fontSize: 16, color: "#2d3436" },
  emptyText: { textAlign: "center", color: "#888", marginVertical: 15, fontStyle: "italic" },
  showMoreButton: { alignItems: "center", paddingVertical: 8 },
  showMoreText: { color: "#6c63ff", fontWeight: "600", fontSize: 14 },
  createContainer: { marginTop: 10 },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    fontSize: 16,
    color: "#000",
  },
  createButton: {
    backgroundColor: "#6c63ff",
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: "center",
  },
  createButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  highlightItem: { backgroundColor: "#6c63ff40", borderWidth: 1, borderColor: "#6c63ff" },
  successContainer: { backgroundColor: "#d4edda", padding: 10, borderRadius: 12, marginTop: 10 },
  successText: { color: "#155724", textAlign: "center", fontWeight: "600" },
closeInlineButton: {
  backgroundColor: "#c00",
  paddingVertical: 10,
  paddingHorizontal: 20, // small horizontal padding
  borderRadius: 10,
  alignItems: "center",
  alignSelf: "center", // don't stretch full width
  marginTop: 10,           // space below Add List
}
,
  sectionHeader: {
  marginBottom: 8,
},
sectionHint: {
  fontStyle: "italic",
  color: "#555",
  fontSize: 13,
  marginBottom: 4,
},
separator: {
  height: 1,
  backgroundColor: "#ddd",
  marginVertical: 4,
},
listItemContent: {
  flexDirection: "row",
  alignItems: "center",
  gap: 10,
},
listIconNumber: {
  flexDirection: "row",
  alignItems: "center",
  width: 40,
},
listNumber: {
  fontSize: 16,
  fontWeight: "700",
  color: "#6c63ff",
},
listText: {
  fontSize: 16,
  color: "#2d3436",
  flexShrink: 1,
},

});

