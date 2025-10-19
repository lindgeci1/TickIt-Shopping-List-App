import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert, Modal } from "react-native";
import { Feather } from "@expo/vector-icons";
import ProductCardSL from "../Product/ProductCardSL";
import { removeProductsFromShoppingList } from "../Product/removeProductsFromShoppingList";
import { updateProductsStatusesFromShoppingList } from "../Product/updateProductsStatusesFromShoppingList";
import { addProductsToShoppingList } from "../Product/addProductsToShoppingList";
import { deleteShoppingList } from "../ShoppingList/deleteShoppingList";

export default function ShoppingLists({ item, index, onDelete, onUpdateProducts }) {
  const [expanded, setExpanded] = useState(false), [products, setProducts] = useState([]),
    [showToBuy, setShowToBuy] = useState(false), [showBought, setShowBought] = useState(false),
    [totalBoughtPrice, setTotalBoughtPrice] = useState(0), [retrieveMode, setRetrieveMode] = useState(false),
    [modalVisible, setModalVisible] = useState(false), [toBuySelectionMode, setToBuySelectionMode] = useState(false),
    [toBuyEditMode, setToBuyEditMode] = useState(false), [toBuySelectedProducts, setToBuySelectedProducts] = useState([]),
    [boughtSelectionMode, setBoughtSelectionMode] = useState(false), [boughtSelectedProducts, setBoughtSelectedProducts] = useState([]);

  useEffect(() => { if (item.Products) setProducts(item.Products.map(p => ({ ...p, Status: p.Status ?? "ToBuy" }))); }, [item.Products]);
  useEffect(() => { setTotalBoughtPrice(products.filter(p => p.Status === "Bought").reduce((sum, p) => sum + Number(p.Price || 0), 0)); }, [products]);

  const handleDeleteList = () => Alert.alert("Delete List", `Are you sure you want to delete "${item.Name}"?\nThis action cannot be undone.`, [
    { text: "Cancel", style: "cancel" },
    { text: "Delete", style: "destructive", onPress: async () => { try { await deleteShoppingList(item.Shopping_List_ItemID); if(onDelete) onDelete(item.Shopping_List_ItemID); } catch { Alert.alert("Error", "Failed to delete the shopping list."); } } }
  ]);

  const toggleSelection = (product, selectedProducts, setSelected) =>
    setSelected(prev => prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]);

  const handleRemoveSelected = async (selectedProducts, statusCheck) => {
    if (!selectedProducts.length) return;
    await removeProductsFromShoppingList(selectedProducts.map(p => p.ProductID), [item.Shopping_List_ItemID]);
    const updated = products.filter(p => !selectedProducts.includes(p));
    setProducts(updated); statusCheck === "ToBuy" ? setToBuySelectionMode(false) : setBoughtSelectionMode(false);
    statusCheck === "ToBuy" ? setToBuySelectedProducts([]) : setBoughtSelectedProducts([]);
    if (updated.filter(p => p.Status === statusCheck).length === 0) statusCheck === "ToBuy" ? setShowToBuy(false) : setShowBought(false);
    if(onUpdateProducts) onUpdateProducts(item.Shopping_List_ItemID, updated);
  };

  const handleUpdateSelectedToBuy = async () => {
    if (!toBuySelectedProducts.length) return;
    await updateProductsStatusesFromShoppingList(toBuySelectedProducts.map(p => p.ProductID), [item.Shopping_List_ItemID]);
    const updated = products.map(p => toBuySelectedProducts.includes(p) ? { ...p, Status: "Bought" } : p);
    setProducts(updated); setToBuySelectionMode(false); setToBuyEditMode(false); setToBuySelectedProducts([]);
    if (updated.filter(p => p.Status === "ToBuy").length === 0) setShowToBuy(false);
    if(onUpdateProducts) onUpdateProducts(item.Shopping_List_ItemID, updated);
  };

  const handleRetrieveSelectedBought = async () => {
    if (!boughtSelectedProducts.length) return;
    try {
      await addProductsToShoppingList(boughtSelectedProducts.map(p => p.ProductID), [item.Shopping_List_ItemID]);
      const updated = products.map(p => boughtSelectedProducts.includes(p) ? { ...p, Status: "ToBuy" } : p);
      setProducts(updated); setBoughtSelectionMode(false); setBoughtSelectedProducts([]); setRetrieveMode(false);
      if (updated.filter(p => p.Status === "Bought").length === 0) setShowBought(false);
      if(onUpdateProducts) onUpdateProducts(item.Shopping_List_ItemID, updated);
    } catch { Alert.alert("Error", "Failed to retrieve products."); }
  };

  const toBuyProducts = products.filter(p => p.Status === "ToBuy"), boughtProducts = products.filter(p => p.Status === "Bought");

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setModalVisible(true)} style={styles.headerRow}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.Name}</Text>
          <Text style={styles.createdAt}>{new Date(item.AddedAt).toLocaleDateString()} {new Date(item.AddedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
        </View>
        <View style={styles.deleteContainer}><View style={styles.verticalLine} /><TouchableOpacity onPress={handleDeleteList} style={styles.trashButton}><Feather name="trash-2" size={22} color="#c00" /></TouchableOpacity></View>
      </TouchableOpacity>
      <Text style={styles.count}>{products.length} Product(s)</Text>

      <Modal animationType="slide" transparent visible={modalVisible} onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{item.Name}</Text>
            <View style={styles.totalPriceContainer}><View style={styles.totalPriceLeft}><Feather name="shopping-cart" size={20} color="#6c63ff" /><Text style={styles.totalPriceLabel}>Total Bought</Text></View><Text style={styles.totalPriceValue}>€{totalBoughtPrice.toFixed(2)}</Text></View>

            <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowToBuy(!showToBuy)}><Text style={styles.sectionTitle}>To Buy ({toBuyProducts.length})</Text><Text style={styles.toggleIcon}>{showToBuy ? "−" : "+"}</Text></TouchableOpacity>
            {showToBuy && <>
              <FlatList data={toBuyProducts} keyExtractor={p => p.ProductID.toString()} scrollEnabled={false} style={styles.productList} renderItem={({ item: product }) => (
                <ProductCardSL product={product} shoppingListItemId={item.Shopping_List_ItemID} showPrice selectionMode={toBuySelectionMode} selected={toBuySelectedProducts.includes(product)}
                  onSelect={() => toggleSelection(product, toBuySelectedProducts, setToBuySelectedProducts)}
                  onPriceChange={price => setProducts(prev => prev.map(p => p.ProductID === product.ProductID ? { ...p, Price: price } : p))}
                />
              )}/>
              {!toBuySelectionMode ? <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: toBuyProducts.length ? "#6c63ff" : "#ccc" }]} disabled={!toBuyProducts.length} onPress={() => { setToBuySelectionMode(true); setToBuyEditMode(false); }}><Text style={styles.actionText}>Select to remove</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: toBuyProducts.length ? "#ffa500" : "#ccc" }]} disabled={!toBuyProducts.length} onPress={() => { setToBuySelectionMode(true); setToBuyEditMode(true); }}><Text style={styles.actionText}>Select To Buy</Text></TouchableOpacity>
              </View> : <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: toBuyEditMode ? "#6c63ff" : "#ff6b6b" }]} onPress={toBuyEditMode ? handleUpdateSelectedToBuy : () => handleRemoveSelected(toBuySelectedProducts, "ToBuy")}><Text style={styles.actionText}>Confirm</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#aaa" }]} onPress={() => { setToBuySelectionMode(false); setToBuyEditMode(false); setToBuySelectedProducts([]); }}><Text style={styles.actionText}>Cancel</Text></TouchableOpacity>
              </View>}
            </>}

            <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowBought(!showBought)}><Text style={styles.sectionTitle}>Bought ({boughtProducts.length})</Text><Text style={styles.toggleIcon}>{showBought ? "−" : "+"}</Text></TouchableOpacity>
            {showBought && <>
              <FlatList data={boughtProducts} keyExtractor={p => p.ProductID.toString()} scrollEnabled={false} style={styles.productList} renderItem={({ item: product }) => (
                <ProductCardSL product={product} shoppingListItemId={item.Shopping_List_ItemID} showPrice selectionMode={boughtSelectionMode} selected={boughtSelectedProducts.includes(product)}
                  onSelect={() => toggleSelection(product, boughtSelectedProducts, setBoughtSelectedProducts)}
                  onPriceChange={price => setProducts(prev => prev.map(p => p.ProductID === product.ProductID ? { ...p, Price: price } : p))}
                />
              )}/>
              {!boughtSelectionMode ? <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: boughtProducts.length ? "#6c63ff" : "#ccc" }]} disabled={!boughtProducts.length} onPress={() => { setBoughtSelectionMode(true); setRetrieveMode(false); }}><Text style={styles.actionText}>Select to remove</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: boughtProducts.length ? "#ffa500" : "#ccc" }]} disabled={!boughtProducts.length} onPress={() => { setBoughtSelectionMode(true); setRetrieveMode(true); }}><Text style={styles.actionText}>Select to retrieve</Text></TouchableOpacity>
              </View> : <View style={styles.actionsRow}>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: retrieveMode ? "#6c63ff" : "#ff6b6b" }]} onPress={retrieveMode ? handleRetrieveSelectedBought : () => handleRemoveSelected(boughtSelectedProducts, "Bought")}><Text style={styles.actionText}>Confirm</Text></TouchableOpacity>
                <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#aaa" }]} onPress={() => { setBoughtSelectionMode(false); setBoughtSelectedProducts([]); setRetrieveMode(false); }}><Text style={styles.actionText}>Cancel</Text></TouchableOpacity>
              </View>}
            </>}

            <TouchableOpacity style={{ backgroundColor:"#c00", paddingVertical:10, paddingHorizontal:25, borderRadius:8, alignSelf:"center", marginTop:15, shadowColor:"#000", shadowOffset:{width:0,height:2}, shadowOpacity:0.2, shadowRadius:3, elevation:3 }} onPress={() => setModalVisible(false)}>
              <Text style={{ color:"#fff", fontSize:16, fontWeight:"600" }}>Close</Text>
            </TouchableOpacity>

          </View>
        </View>
      </Modal>
    </View>
  );
}
const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 12, marginBottom: 12, backgroundColor: "#8c82ff", shadowColor: "#000", shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, backgroundColor: "#fff", borderRadius: 8, marginVertical: 6, elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2 },
  textContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#6c63ff" },
  createdAt: { fontSize: 12, color: "#666", marginTop: 2 },
  count: { fontSize: 12, color: "#fff", marginVertical: 4 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, marginVertical: 4, backgroundColor: "#f5f5ff", borderRadius: 8 },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  toggleIcon: { fontSize: 18, fontWeight: "600", color: "#6c63ff" },
  productList: { marginTop: 4, marginBottom: 8 },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 5, marginBottom: 10 },
  actionButton: { flex: 1, paddingVertical: 8, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "600" },
  totalPriceContainer: { backgroundColor: "#fff", paddingVertical: 12, paddingHorizontal: 16, borderRadius: 12, marginVertical: 10, flexDirection: "row", justifyContent: "space-between", alignItems: "center", shadowColor: "#000", shadowOpacity: 0.08, shadowOffset: { width: 0, height: 3 }, shadowRadius: 5, elevation: 3 },
  totalPriceLeft: { flexDirection: "row", alignItems: "center", gap: 6 },
  totalPriceLabel: { fontSize: 14, fontWeight: "600", color: "#333" },
  totalPriceValue: { fontSize: 18, fontWeight: "700", color: "#6c63ff" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modalContent: { width: "90%", maxHeight: "80%", backgroundColor: "#fff", borderRadius: 12, padding: 16 },
  closeButton: { position: "absolute", top: 10, right: 10, backgroundColor: "#6c63ff", padding: 8, borderRadius: 20, zIndex: 10 },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 12, color: "#6c63ff" }
});