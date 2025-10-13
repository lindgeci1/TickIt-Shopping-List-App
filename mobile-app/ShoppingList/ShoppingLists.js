import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import ProductCardSL from "../Product/ProductCardSL";
import { removeProductsFromShoppingList } from "../Product/removeProductsFromShoppingList";
import { updateProductsStatusesFromShoppingList } from "../Product/updateProductsStatusesFromShoppingList";
import { deleteShoppingList } from "../ShoppingList/deleteShoppingList";
import { Feather } from "@expo/vector-icons";

export default function ShoppingLists({ item, index, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [showToBuy, setShowToBuy] = useState(false);
  const [showBought, setShowBought] = useState(false);

  useEffect(() => {
    if (item.Products) setProducts(item.Products.map(p => ({ ...p, Status: p.Status ?? "ToBuy" })));
  }, [item.Products]);

  const toggleSelection = (product) =>
    setSelectedProducts(prev => prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]);

  const handleDeleteList = () => {
    Alert.alert("Delete List", `Are you sure you want to delete "${item.Name}"?\nThis action cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => { 
          try { 
            await deleteShoppingList(item.Shopping_List_ItemID); 
            if (onDelete) onDelete(item.Shopping_List_ItemID); 
          } catch (e) { 
            Alert.alert("Error", "Failed to delete the shopping list."); 
          } 
        } 
      }
    ]);
  };

  const handleRemoveSelected = async () => {
    if (!selectedProducts.length) return;
    await removeProductsFromShoppingList(selectedProducts.map(p => p.ProductID), [item.Shopping_List_ItemID]);
    setProducts(prev => prev.filter(p => !selectedProducts.includes(p)));
    setSelectionMode(false);
    setSelectedProducts([]);
  };

  const handleUpdateSelected = async () => {
    if (!selectedProducts.length) return;
    await updateProductsStatusesFromShoppingList(selectedProducts.map(p => p.ProductID), [item.Shopping_List_ItemID]);
    setProducts(prev => prev.map(p => selectedProducts.includes(p) ? { ...p, Status: "Bought" } : p));
    setSelectionMode(false);
    setEditMode(false);
    setSelectedProducts([]);
  };

  const toBuyProducts = products.filter(p => p.Status === "ToBuy");
  const boughtProducts = products.filter(p => p.Status === "Bought");
  const boughtTotal = (boughtProducts ?? []).reduce((sum, p) => sum + Number(p.Price || 0), 0);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.headerRow}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.Name}</Text>
          <Text style={styles.createdAt}>{new Date(item.AddedAt).toLocaleDateString()} {new Date(item.AddedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}</Text>
        </View>
        <View style={styles.deleteContainer}>
          <View style={styles.verticalLine} />
          <TouchableOpacity onPress={handleDeleteList} style={styles.trashButton}><Feather name="trash-2" size={22} color="#c00" /></TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Text style={styles.count}>{products.length} Products</Text>

      {expanded && <>
        {/* Total Bought Price Bar */}
        <Text style={{ fontWeight: "600", color: "#333", marginVertical: 4 }}>
          Total Bought Price: ${boughtTotal.toFixed(2)}
        </Text>

        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowToBuy(!showToBuy)}>
          <Text style={styles.sectionTitle}>To Buy ({toBuyProducts.length})</Text>
          <Text style={styles.toggleIcon}>{showToBuy ? "−" : "+"}</Text>
        </TouchableOpacity>
        {showToBuy && <FlatList
          data={toBuyProducts}
          keyExtractor={p => p.ProductID.toString()}
          renderItem={({ item: product }) => (
            <ProductCardSL
              product={product}
              showPrice={true}
              selectionMode={selectionMode}
              selected={selectedProducts.includes(product)}
              onSelect={() => toggleSelection(product)}
            />
          )}
          scrollEnabled={false}
          style={styles.productList}
        />}

        <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowBought(!showBought)}>
          <Text style={styles.sectionTitle}>Bought ({boughtProducts.length})</Text>
          <Text style={styles.toggleIcon}>{showBought ? "−" : "+"}</Text>
        </TouchableOpacity>
        {showBought && <FlatList
          data={boughtProducts}
          keyExtractor={p => p.ProductID.toString()}
          renderItem={({ item: product }) => (
            <ProductCardSL
              product={product}
              showPrice={true}
              selectionMode={selectionMode}
              selected={selectedProducts.includes(product)}
              onSelect={() => toggleSelection(product)}
            />
          )}
          scrollEnabled={false}
          style={styles.productList}
        />}

        {!selectionMode ? 
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#6c63ff" }]} onPress={() => { setSelectionMode(true); setEditMode(false); }}><Text style={styles.actionText}>Remove</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#ffa500" }]} onPress={() => { setSelectionMode(true); setEditMode(true); }}><Text style={styles.actionText}>Edit</Text></TouchableOpacity>
          </View> :
          <View style={styles.actionsRow}>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: editMode ? "#6c63ff" : "#ff6b6b" }]} onPress={editMode ? handleUpdateSelected : handleRemoveSelected}><Text style={styles.actionText}>Confirm</Text></TouchableOpacity>
            <TouchableOpacity style={[styles.actionButton, { backgroundColor: "#aaa" }]} onPress={() => { setSelectionMode(false); setEditMode(false); setSelectedProducts([]); }}><Text style={styles.actionText}>Cancel</Text></TouchableOpacity>
          </View>
        }
      </>}
    </View>
  );
}

const styles = StyleSheet.create({
  card: { padding: 12, borderRadius: 12, marginBottom: 12, backgroundColor: "#8c82ff", shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 2 }, shadowRadius: 4, elevation: 3 },
  headerRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", padding: 12, backgroundColor: "#fff", borderRadius: 8, marginVertical: 6, elevation: 2, shadowColor: "#000", shadowOpacity: 0.1, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2 },
  textContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#6c63ff" },
  createdAt: { fontSize: 12, color: "#666", marginTop: 2 },
  count: { fontSize: 12, color: "#fff", marginVertical: 4 },
  sectionHeader: { flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 10, paddingHorizontal: 12, marginVertical: 4, backgroundColor: "#f5f5ff", borderRadius: 8 },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  toggleIcon: { fontSize: 18, fontWeight: "600", color: "#6c63ff" },
  productList: { marginTop: 4, marginBottom: 8 },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 10 },
  actionButton: { flex: 1, paddingVertical: 8, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "600" }
});
