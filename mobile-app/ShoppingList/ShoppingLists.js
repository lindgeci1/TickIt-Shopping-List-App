import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import ProductCardSL from "../Product/ProductCardSL";
import { removeProductsFromShoppingList } from "../Product/removeProductsFromShoppingList";
import { updateProductsStatusesFromShoppingList } from "../Product/updateProductsStatusesFromShoppingList";
import { deleteShoppingList } from "../ShoppingList/deleteShoppingList";
import { Feather } from "@expo/vector-icons";
import { addProductsToShoppingList } from "../Product/addProductsToShoppingList";
export default function ShoppingLists({ item, index, onDelete, onUpdateProducts  }) {
  const [expanded, setExpanded] = useState(false);
  const [products, setProducts] = useState([]);
  const [showToBuy, setShowToBuy] = useState(false);
  const [showBought, setShowBought] = useState(false);
  const [totalBoughtPrice, setTotalBoughtPrice] = useState(0);
  const [retrieveMode, setRetrieveMode] = useState(false);
  // independent states for "To Buy"
  const [toBuySelectionMode, setToBuySelectionMode] = useState(false);
  const [toBuyEditMode, setToBuyEditMode] = useState(false);
  const [toBuySelectedProducts, setToBuySelectedProducts] = useState([]);

  // independent states for "Bought"
  const [boughtSelectionMode, setBoughtSelectionMode] = useState(false);
  const [boughtSelectedProducts, setBoughtSelectedProducts] = useState([]);

  useEffect(() => {
    if (item.Products)
      setProducts(item.Products.map(p => ({ ...p, Status: p.Status ?? "ToBuy" })));
  }, [item.Products]);

  useEffect(() => {
    const boughtProducts = products.filter(p => p.Status === "Bought");
    const total = boughtProducts.reduce((sum, p) => sum + Number(p.Price || 0), 0);
    // console.log("LOG Total Bought Price:", total);
    setTotalBoughtPrice(total);
  }, [products]);

  const handleDeleteList = () => {
    Alert.alert("Delete List", `Are you sure you want to delete "${item.Name}"?\nThis action cannot be undone.`, [
      { text: "Cancel", style: "cancel" },
      {
        text: "Delete",
        style: "destructive",
        onPress: async () => {
          try {
            await deleteShoppingList(item.Shopping_List_ItemID);
            if (onDelete) onDelete(item.Shopping_List_ItemID);
          } catch (e) {
            Alert.alert("Error", "Failed to delete the shopping list.");
          }
        },
      },
    ]);
  };

  // To Buy handlers
  const toggleToBuySelection = (product) =>
    setToBuySelectedProducts(prev =>
      prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]
    );

const handleRemoveSelectedToBuy = async () => {
  if (!toBuySelectedProducts.length) return;
  await removeProductsFromShoppingList(
    toBuySelectedProducts.map(p => p.ProductID),
    [item.Shopping_List_ItemID]
  );
  const updatedProducts = products.filter(p => !toBuySelectedProducts.includes(p));
  setProducts(updatedProducts);
  setToBuySelectionMode(false);
  setToBuySelectedProducts([]);
  // Collapse only if no To Buy products remain
  if (updatedProducts.filter(p => p.Status === "ToBuy").length === 0) {
    setShowToBuy(false);
  }
  if (onUpdateProducts) onUpdateProducts(item.Shopping_List_ItemID, updatedProducts);
};

const handleUpdateSelectedToBuy = async () => {
  if (!toBuySelectedProducts.length) return;
  await updateProductsStatusesFromShoppingList(
    toBuySelectedProducts.map(p => p.ProductID),
    [item.Shopping_List_ItemID]
  );
  const updatedProducts = products.map(p =>
    toBuySelectedProducts.includes(p) ? { ...p, Status: "Bought" } : p
  );
  setProducts(updatedProducts);
  setToBuySelectionMode(false);
  setToBuyEditMode(false);
  setToBuySelectedProducts([]);
  // Collapse only if no To Buy products remain
  if (updatedProducts.filter(p => p.Status === "ToBuy").length === 0) {
    setShowToBuy(false);
  }
  if (onUpdateProducts) onUpdateProducts(item.Shopping_List_ItemID, updatedProducts);
};
  // Bought handlers
  const toggleBoughtSelection = (product) =>
    setBoughtSelectedProducts(prev =>
      prev.includes(product) ? prev.filter(p => p !== product) : [...prev, product]
    );


const handleRemoveSelectedBought = async () => {
  if (!boughtSelectedProducts.length) return;
  await removeProductsFromShoppingList(
    boughtSelectedProducts.map(p => p.ProductID),
    [item.Shopping_List_ItemID]
  );
  const updatedProducts = products.filter(p => !boughtSelectedProducts.includes(p));
  setProducts(updatedProducts);
  setBoughtSelectionMode(false);
  setBoughtSelectedProducts([]);
  // Collapse only if no Bought products remain
  if (updatedProducts.filter(p => p.Status === "Bought").length === 0) {
    setShowBought(false);
  }
  if (onUpdateProducts) onUpdateProducts(item.Shopping_List_ItemID, updatedProducts);
};
const handleRetrieveSelectedBought = async () => {
  if (!boughtSelectedProducts.length) return;
  try {
    await addProductsToShoppingList(
      boughtSelectedProducts.map(p => p.ProductID),
      [item.Shopping_List_ItemID]
    );
    const updatedProducts = products.map(p =>
      boughtSelectedProducts.includes(p) ? { ...p, Status: "ToBuy" } : p
    );
    setProducts(updatedProducts);
    setBoughtSelectionMode(false);
    setBoughtSelectedProducts([]);
    // Collapse only if no Bought products remain
    if (updatedProducts.filter(p => p.Status === "Bought").length === 0) {
      setShowBought(false);
    }
    if (onUpdateProducts) onUpdateProducts(item.Shopping_List_ItemID, updatedProducts);
  } catch (error) {
    Alert.alert("Error", "Failed to retrieve products.");
  }
};

  const toBuyProducts = products.filter(p => p.Status === "ToBuy");
  const boughtProducts = products.filter(p => p.Status === "Bought");

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)} style={styles.headerRow}>
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.Name}</Text>
          <Text style={styles.createdAt}>
            {new Date(item.AddedAt).toLocaleDateString()}{" "}
            {new Date(item.AddedAt).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </Text>
        </View>
        <View style={styles.deleteContainer}>
          <View style={styles.verticalLine} />
          <TouchableOpacity onPress={handleDeleteList} style={styles.trashButton}>
            <Feather name="trash-2" size={22} color="#c00" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>

      <Text style={styles.count}>{products.length} Product(s)</Text>

      {expanded && (
        <>
        <View style={styles.totalPriceContainer}>
          <View style={styles.totalPriceLeft}>
            <Feather name="shopping-cart" size={20} color="#6c63ff" />
            <Text style={styles.totalPriceLabel}>Total Bought</Text>
          </View>
          <Text style={styles.totalPriceValue}>€{totalBoughtPrice.toFixed(2)}</Text>
        </View>



          {/* To Buy Section */}
          <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowToBuy(!showToBuy)}>
            <Text style={styles.sectionTitle}>To Buy ({toBuyProducts.length})</Text>
            <Text style={styles.toggleIcon}>{showToBuy ? "−" : "+"}</Text>
          </TouchableOpacity>

          {showToBuy && (
            <>
              <FlatList
                data={toBuyProducts}
                keyExtractor={p => p.ProductID.toString()}
                renderItem={({ item: product }) => (
                  <ProductCardSL
                    product={product}
                    shoppingListItemId={item.Shopping_List_ItemID}
                    showPrice={true}
                    selectionMode={toBuySelectionMode}
                    selected={toBuySelectedProducts.includes(product)}
                    onSelect={() => toggleToBuySelection(product)}
                    onPriceChange={(price) => {
                      setProducts(prev =>
                        prev.map(p =>
                          p.ProductID === product.ProductID ? { ...p, Price: price } : p
                        )
                      );
                    }}
                  />
                )}
                scrollEnabled={false}
                style={styles.productList}
              />
            {!toBuySelectionMode ? (
              <View style={styles.actionsRow}>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: toBuyProducts.length ? "#6c63ff" : "#ccc" }
                  ]}
                  disabled={!toBuyProducts.length}
                  onPress={() => {
                    setToBuySelectionMode(true);
                    setToBuyEditMode(false);
                  }}
                >
                  <Text style={styles.actionText}>Select to remove</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.actionButton,
                    { backgroundColor: toBuyProducts.length ? "#ffa500" : "#ccc" }
                  ]}
                  disabled={!toBuyProducts.length}
                  onPress={() => {
                    setToBuySelectionMode(true);
                    setToBuyEditMode(true);
                  }}
                >
                  <Text style={styles.actionText}>Select To Buy</Text>
                </TouchableOpacity>
              </View>
            ) : (
                <View style={styles.actionsRow}>
                  <TouchableOpacity
                    style={[
                      styles.actionButton,
                      { backgroundColor: toBuyEditMode ? "#6c63ff" : "#ff6b6b" },
                    ]}
                    onPress={
                      toBuyEditMode
                        ? handleUpdateSelectedToBuy
                        : handleRemoveSelectedToBuy
                    }
                  >
                    <Text style={styles.actionText}>Confirm</Text>
                  </TouchableOpacity>
                  <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: "#aaa" }]}
                    onPress={() => {
                      setToBuySelectionMode(false);
                      setToBuyEditMode(false);
                      setToBuySelectedProducts([]);
                    }}
                  >
                    <Text style={styles.actionText}>Cancel</Text>
                  </TouchableOpacity>
                </View>
              )}
            </>
          )}

          {/* Bought Section */}
          <TouchableOpacity style={styles.sectionHeader} onPress={() => setShowBought(!showBought)}>
            <Text style={styles.sectionTitle}>Bought ({boughtProducts.length})</Text>
            <Text style={styles.toggleIcon}>{showBought ? "−" : "+"}</Text>
          </TouchableOpacity>

          {showBought && (
            <>
              <FlatList
                data={boughtProducts}
                keyExtractor={p => p.ProductID.toString()}
                renderItem={({ item: product }) => (
                  <ProductCardSL
                    product={product}
                    shoppingListItemId={item.Shopping_List_ItemID}
                    showPrice={true}
                    selectionMode={boughtSelectionMode}
                    selected={boughtSelectedProducts.includes(product)}
                    onSelect={() => toggleBoughtSelection(product)}
                    onPriceChange={(price) => {
                      setProducts(prev =>
                        prev.map(p =>
                          p.ProductID === product.ProductID ? { ...p, Price: price } : p
                        )
                      );
                    }}
                  />
                )}
                scrollEnabled={false}
                style={styles.productList}
              />

{!boughtSelectionMode ? (
  <View style={styles.actionsRow}>
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor: boughtProducts.length ? "#6c63ff" : "#ccc" },
      ]}
      disabled={!boughtProducts.length}
      onPress={() => {
        setBoughtSelectionMode(true);
        setRetrieveMode(false);
      }}
    >
      <Text style={styles.actionText}>Select to remove</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor: boughtProducts.length ? "#ffa500" : "#ccc" },
      ]}
      disabled={!boughtProducts.length}
      onPress={() => {
        setBoughtSelectionMode(true);
        setRetrieveMode(true);
      }}
    >
      <Text style={styles.actionText}>Select to retrieve</Text>
    </TouchableOpacity>
  </View>
) : (
  <View style={styles.actionsRow}>
    <TouchableOpacity
      style={[
        styles.actionButton,
        { backgroundColor: retrieveMode ? "#6c63ff" : "#ff6b6b" },
      ]}
      onPress={retrieveMode ? handleRetrieveSelectedBought : handleRemoveSelectedBought}
    >
      <Text style={styles.actionText}>Confirm</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor: "#aaa" }]}
      onPress={() => {
        setBoughtSelectionMode(false);
        setBoughtSelectedProducts([]);
        setRetrieveMode(false);
      }}
    >
      <Text style={styles.actionText}>Cancel</Text>
    </TouchableOpacity>
  </View>
)}


            </>
          )}
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    backgroundColor: "#8c82ff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  headerRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 12,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginVertical: 6,
    elevation: 2,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
  textContainer: { flex: 1 },
  name: { fontSize: 16, fontWeight: "700", color: "#6c63ff" },
  createdAt: { fontSize: 12, color: "#666", marginTop: 2 },
  count: { fontSize: 12, color: "#fff", marginVertical: 4 },
  sectionHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginVertical: 4,
    backgroundColor: "#f5f5ff",
    borderRadius: 8,
  },
  sectionTitle: { fontSize: 15, fontWeight: "600", color: "#333" },
  toggleIcon: { fontSize: 18, fontWeight: "600", color: "#6c63ff" },
  productList: { marginTop: 4, marginBottom: 8 },
  actionsRow: { flexDirection: "row", justifyContent: "space-between", marginTop: 5, marginBottom: 10 },
  actionButton: { flex: 1, paddingVertical: 8, borderRadius: 8, marginHorizontal: 5, alignItems: "center" },
  actionText: { color: "#fff", fontWeight: "600" },
 totalPriceContainer: {
  backgroundColor: "#fff",
  paddingVertical: 12,
  paddingHorizontal: 16,
  borderRadius: 12,
  marginVertical: 10,
  flexDirection: "row",
  justifyContent: "space-between",
  alignItems: "center",
  shadowColor: "#000",
  shadowOpacity: 0.08,
  shadowOffset: { width: 0, height: 3 },
  shadowRadius: 5,
  elevation: 3,
},
totalPriceLeft: {
  flexDirection: "row",
  alignItems: "center",
  gap: 6, // space between icon and text
},
totalPriceLabel: {
  fontSize: 14,
  fontWeight: "600",
  color: "#333",
},
totalPriceValue: {
  fontSize: 18,
  fontWeight: "700",
  color: "#6c63ff",
},

});
