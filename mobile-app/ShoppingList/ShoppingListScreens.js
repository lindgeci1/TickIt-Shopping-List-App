import React, { useState, useEffect } from "react";
import { View, Text, Modal, FlatList, TouchableOpacity, TextInput, StyleSheet, ActivityIndicator, KeyboardAvoidingView, Platform, Keyboard } from "react-native";
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
  const [addingProducts, setAddingProducts] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);
  const [keyboardHeight, setKeyboardHeight] = useState(0);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  useEffect(() => {
    if (visible) {
      setHighlightId(null);
      setSelectedId(null);
    }
  }, [visible]);

  const showTempMessage = (msg, color = "#155724") => {
    setMessage(msg);
    setMessageColor(color);
    setTimeout(() => setMessage(""), 2000);
  };

  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", (e) => { setKeyboardHeight(e.endCoordinates.height); setKeyboardVisible(true); });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => { setKeyboardHeight(0); setKeyboardVisible(false); });
    return () => { showSub.remove(); hideSub.remove(); };
  }, []);

  const handleCreate = async () => {
    if (!newListName) return;
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      const newList = await createshoppingList(newListName);
      await new Promise(resolve => setTimeout(resolve, 500));
      const successMessage = newList?.message || "List created successfully!";
      setToastMessage(successMessage);
      shoppingLists.push(newList);
      setNewListName("");
    } catch (err) {
      // console.log("API call error:", err);
      const apiMessage = err?.response?.data?.message || err?.message || "Something went wrong";
      setToastMessage(apiMessage);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = async (list) => {
    setSelectedId(list.Shopping_List_ItemID);
    setAddingProducts(true);
    // console.log("Adding products to list:", list); 
    showTempMessage("Adding product(s) to list...", "#856404");
    await new Promise((resolve) => setTimeout(resolve, 2000));
    await onSelect(list);
    setAddingProducts(false);
  };

  const reversedLists = Array.isArray(shoppingLists) ? [...shoppingLists].reverse() : [];
  const displayedLists = showAll ? reversedLists : reversedLists.slice(0, 2);

  return (
    <>
      <Modal visible={visible} animationType="slide" transparent>
        <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} style={styles.overlay}>
          {toastMessage && (
            <View style={{ position: "absolute", alignSelf: "center", zIndex: 9999, bottom: keyboardVisible ? keyboardHeight + 80 : "25%" }}>
              <Toast message={toastMessage} onHide={() => setToastMessage(null)} />
            </View>
          )}
          <View style={styles.container}>
            <Text style={styles.title}>Select Shopping List</Text>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionHint}>Select the list where you want the product to be in.</Text>
              <View style={styles.separator} />
            </View>

            {shoppingLists.length > 0 ? (
              <>
                <FlatList
                  data={displayedLists}
                  keyExtractor={(item, i) => item?.Shopping_List_ItemID?.toString() || i.toString()}
                  renderItem={({ item, index }) => item && (
                    <TouchableOpacity
                      style={[styles.listItem, (item.Shopping_List_ItemID === selectedId || addingProducts) && styles.disabledButton]}
                      disabled={loading || addingProducts}
                      onPress={() => handleSelect(item)}
                    >
                      {addingProducts && item.Shopping_List_ItemID === selectedId ? (
                        <View style={{ flexDirection: "row", alignItems: "center" }}>
                          <ActivityIndicator size="small" color="#856404" />
                          <Text style={{ marginLeft: 5, color: "#856404", fontWeight: "600" }}>Adding...</Text>
                        </View>
                      ) : (
                        <View style={styles.listItemContent}>
                          <Text style={styles.listNumber}>{index + 1}.</Text>
                          <Text style={styles.listText}>{item?.Name || "Unnamed List"}</Text>
                        </View>
                      )}
                    </TouchableOpacity>
                  )}
                  style={{ maxHeight: 250, marginBottom: 5 }}
                />
                {shoppingLists.length > 2 && !showAll && (
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
                style={[styles.input, (loading || addingProducts) && { backgroundColor: "#eee", color: "#888" }]}
                placeholder="New list name..."
                placeholderTextColor="#555"
                value={newListName}
                onFocus={() => showAll && setShowAll(false)}
                onChangeText={setNewListName}
                editable={!loading && !addingProducts}
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
                    <Text style={[styles.createButtonText, { color: "#fff", marginLeft: 5 }]}>Adding product(s)...</Text>
                  </View>
                ) : (
                  <Text style={styles.createButtonText}>Create List</Text>
                )}
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.closeInlineButton, { marginTop: 10 }, (loading || addingProducts) && { opacity: 0.5 }]}
                onPress={() => { onClose(); setNewListName(""); setToastMessage(null); setMessage(""); setSelectedId(null); setHighlightId(null); setShowAll(false); setAddingProducts(false); }}
                disabled={loading || addingProducts}
              >
                <Text style={{ color: "#fff", fontWeight: "600", fontSize: 16 }}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </KeyboardAvoidingView>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  overlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  container: { width: "90%", maxHeight: "80%", backgroundColor: "#fff", borderRadius: 10, padding: 20, shadowColor: "#000", shadowOpacity: 0.1, shadowRadius: 10, elevation: 10 },
  title: { fontSize: 20, fontWeight: "700", marginBottom: 15, color: "#2d3436" },
  listItem: { paddingVertical: 8, paddingHorizontal: 15, borderRadius: 12, backgroundColor: "#f7f6fc", marginBottom: 10, borderWidth: 1, borderColor: "#e0e0e0", shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 5, shadowOffset: { width: 0, height: 2 }, flexDirection: "row", alignItems: "center" },
  disabledButton: { opacity: 0.5 },
  selectedListItem: { backgroundColor: "#6c63ff1a", borderColor: "#6c63ff" },
  listText: { fontSize: 16, color: "#333", flexShrink: 1 },
  emptyText: { textAlign: "center", color: "#888", marginVertical: 15, fontStyle: "italic" },
  showMoreButton: { alignItems: "center", paddingVertical: 8 },
  showMoreText: { color: "#6c63ff", fontWeight: "600", fontSize: 14 },
  createContainer: { marginTop: 10 },
  input: { borderWidth: 1, borderColor: "#ccc", borderRadius: 10, padding: 10, marginBottom: 10, fontSize: 15, color: "#000" },
  createButton: { backgroundColor: "#6c63ff", paddingVertical: 10, borderRadius: 10, alignItems: "center" },
  createButtonText: { color: "#fff", fontWeight: "600", fontSize: 16 },
  highlightItem: { backgroundColor: "#6c63ff40", borderWidth: 1, borderColor: "#6c63ff" },
  successContainer: { backgroundColor: "#d4edda", padding: 10, borderRadius: 10, marginTop: 10 },
  successText: { color: "#155724", textAlign: "center", fontWeight: "600" },
  closeInlineButton: { backgroundColor: "#c00", paddingVertical: 10, paddingHorizontal: 20, borderRadius: 10, alignItems: "center", alignSelf: "center", marginTop: 10 },
  sectionHeader: { marginBottom: 8 },
  sectionHint: { fontStyle: "italic", color: "#555", fontSize: 13, marginBottom: 4 },
  separator: { height: 1, backgroundColor: "#ddd", marginVertical: 4 },
  listItemContent: { flexDirection: "row", alignItems: "center", gap: 10, paddingVertical: 2, marginHorizontal: 10 },
  listIconNumber: { flexDirection: "row", alignItems: "center", width: 40 },
  listNumber: { fontSize: 16, fontWeight: "700", color: "#6c63ff" }
});
