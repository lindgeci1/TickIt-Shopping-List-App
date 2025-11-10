import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput, TouchableOpacity, Modal, Keyboard  } from "react-native";
import ShoppingLists from "../ShoppingList/ShoppingLists";
import ShoppingListFilterPanel from "../ShoppingList/ShoppingListFilterPanel";
import { fetchShoppingLists } from "../ShoppingList/fetchShoppingLists";
import { createshoppingList } from "../ShoppingList/createshoppingList";
import Toast from "../utils/Toast";

export default function ShoppingListScreen({ navigation, topPadding }) {
  const [lists, setLists] = useState([]);
  const [allLists, setAllLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [search, setSearch] = useState("");
  const [activeQuickDate, setActiveQuickDate] = useState(null);
  const [customDate, setCustomDate] = useState(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [newListName, setNewListName] = useState("");

  const loadLists = async () => {
    setLoading(true);
    setErrorMessage("");
    let fetchedLists = [];
    await fetchShoppingLists((data) => {
      fetchedLists = data;
      setLists(data);
    }, setErrorMessage);
    setAllLists(fetchedLists);
    setLoading(false);
  };

  const handleAddList = async () => {
    Keyboard.dismiss();
    if (!newListName.trim()) {
      setToastMessage("Please enter a valid list name.");
      return;
    }

    try {
      const createdList = await createshoppingList(newListName.trim());
      setLists(prev => [createdList, ...prev]);
      setAllLists(prev => [createdList, ...prev]);
      setToastMessage(`List "${newListName}" created successfully.`);
      setNewListName("");
      setIsModalVisible(false);
    } catch (err) {
      const errorMsg = err?.response?.data?.message || err.message || "Failed to create list.";
      setToastMessage(errorMsg);
    }
  };

  useEffect(() => {
    loadLists();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" color="#6c63ff" style={{ flex: 1 }} />;

return (
  <View style={[styles.container, { paddingTop: topPadding + 15 }]}>
    
    {/* Header */}
    <View style={styles.headerRow}>
      <Text style={styles.header}>Shopping Lists</Text>
      <TouchableOpacity 
        style={styles.addIconButton}
        onPress={() => setIsModalVisible(true)}
      >
        <Text style={styles.addIconText}>＋</Text>
      </TouchableOpacity>
    </View>

    {/* Search/filter panel */}
    <ShoppingListFilterPanel
      allLists={allLists}
      setFilteredLists={setLists}
      search={search}
      setSearch={setSearch}
      activeQuickDate={activeQuickDate}
      setActiveQuickDate={setActiveQuickDate}
      customDate={customDate}
      setCustomDate={setCustomDate}
    />

  {/* <View style={styles.addListContainer}>
    <TouchableOpacity 
      style={styles.addListButton}
      onPress={() => setIsModalVisible(true)}
    >
      <Text style={styles.addListButtonText}>+ Add a List</Text>
    </TouchableOpacity>
  </View> */}


    {/* Error message */}
    {errorMessage.length > 0 && (
      <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
    )}

    {/* Shopping lists */}
    <FlatList
      data={lists}
      keyExtractor={(item) => item.Shopping_List_ItemID.toString()}
      renderItem={({ item, index }) => (
        <ShoppingLists
          item={item}
          index={index}
          navigation={navigation}
           listName={item.Name}         // Pass list name
          onProductAdded={(productName, listName) => {
            setToastMessage(`Product "${productName}" was successfully added to list "${listName}"`);
          }}
        onDelete={(deletedId) => {
          setLists(prev => prev.filter(list => list.Shopping_List_ItemID !== deletedId));
          setAllLists(prev => prev.filter(list => list.Shopping_List_ItemID !== deletedId));
          setToastMessage(`List "${item.Name}" deleted successfully.`);
        }}
          onUpdateProducts={(listId, updatedProducts) => {
            setLists(prev =>
              prev.map(list => {
                if (list.Shopping_List_ItemID === listId) {
                  return { ...list, Products: updatedProducts };
                }
                const updatedProductIds = updatedProducts.map(p => p.ProductID);
                const listProductsUpdated = list.Products.map(p =>
                  updatedProductIds.includes(p.ProductID)
                    ? updatedProducts.find(up => up.ProductID === p.ProductID)
                    : p
                );
                return { ...list, Products: listProductsUpdated };
              })
            );
          }}
        />
      )}
      contentContainerStyle={{ paddingBottom: 120 }}
      showsVerticalScrollIndicator={false}
      ListEmptyComponent={() => (
        <Text style={styles.emptyText}>No lists found</Text>
      )}
    />

    {/* Modal for creating new list */}
    <Modal visible={isModalVisible} transparent animationType="slide">
      <View style={styles.modalOverlay}>
        <View style={styles.modalContent}>
          <Text style={styles.modalHeader}>New Shopping List</Text>
          <TextInput
            style={styles.modalInput}
            placeholder="Enter list name"
            placeholderTextColor="#999"
            value={newListName}
            onChangeText={setNewListName}
          />
          <View style={styles.modalButtons}>
            <TouchableOpacity style={styles.modalCancel} onPress={() => {setIsModalVisible(false); setNewListName("");}}>
              <Text style={styles.modalCancelText}>Cancel</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.modalAdd} onPress={handleAddList}>
              <Text style={styles.modalAddText}>Create</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>

    {/* Toast message */}
    <View style={styles.toastContainer} pointerEvents="none">
      {toastMessage !== "" && (
        <Toast
          message={toastMessage}
          duration={3000}
          onHide={() => setToastMessage("")}
        />
      )}
    </View>

  </View>
);

}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9fc" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 20 },
  addListButton: { backgroundColor: "#6c63ff", borderRadius: 8, paddingVertical: 8, paddingHorizontal: 16, alignSelf: "flex-start", marginBottom: 20, elevation: 2, },
  addListButtonText: { color: "#fff", fontWeight: "700", fontSize: 14 },
  emptyText: { textAlign: "center", marginTop: 40, color: "#6c63ff", fontSize: 16, fontWeight: "500", fontStyle: "italic" },
  modalOverlay: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "rgba(0,0,0,0.3)" },
  modalContent: { width: "85%", backgroundColor: "#fff", borderRadius: 12, padding: 20 },
  modalHeader: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  modalInput: { borderWidth: 1, borderColor: "#d1d1f0", borderRadius: 12, paddingHorizontal: 16, fontSize: 16, height: 45, marginBottom: 20, color: "#000"},
  modalButtons: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  modalCancel: { flex: 1, marginRight: 10, alignItems: "center", paddingVertical: 10, borderRadius: 12, borderWidth: 1, borderColor: "#6c63ff" },
  modalCancelText: { color: "#6c63ff", fontWeight: "600", fontSize: 16 },
  modalAdd: { flex: 1, alignItems: "center", paddingVertical: 10, borderRadius: 12, backgroundColor: "#6c63ff" },
  modalAddText: { color: "#fff", fontWeight: "700", fontSize: 16 },
  toastContainer: {
  position: "absolute",
  bottom: 60,
  left: 0,
  right: 0,
  alignItems: "center",
  zIndex: 9999,
  elevation: 9999,
},
headerRow: {
  flexDirection: "row",
  alignItems: "center",
  justifyContent: "space-between",
  marginBottom: 20,
},

header: {
  fontSize: 22,
  fontWeight: "700",
  color: "#6c63ff",
},

addIconButton: {
  width: 36,
  height: 36,
  borderRadius: 18,
  backgroundColor: "#6c63ff",
  alignItems: "center",
  justifyContent: "center",
  elevation: 3,
},

addIconText: {
  color: "#fff",
  fontSize: 22,
  lineHeight: 24,
  fontWeight: "700",
},

});
