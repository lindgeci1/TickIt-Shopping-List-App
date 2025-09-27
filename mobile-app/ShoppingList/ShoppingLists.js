import React, { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import ProductCardSL from "../Product/ProductCardSL";
import { removeProductsFromShoppingList } from "../Product/removeProductsFromShoppingList";
import { updateProductsStatusesFromShoppingList } from "../Product/updateProductsStatusesFromShoppingList";
import { deleteShoppingList } from "../ShoppingList/deleteShoppingList";
import { Feather } from "@expo/vector-icons"; // Trash bin icon
export default function ShoppingLists({ item, index, onDelete }) {
  const [expanded, setExpanded] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [editMode, setEditMode] = useState(false); // distinguish remove vs edit
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [showToBuy, setShowToBuy] = useState(false);
  const [showBought, setShowBought] = useState(false);

  useEffect(() => {
    if (item.Products) {
      const normalizedProducts = item.Products.map((p) => ({
        ...p,
        Status: p.Status ?? "ToBuy",
      }));
      setProducts(normalizedProducts);
    }
  }, [item.Products]);

  const toggleSelection = (product) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };
const handleDeleteList = () => {
    Alert.alert(
      "Delete List",
      `Are you sure you want to delete "${item.Name}"?\nThis action cannot be undone.`,
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await deleteShoppingList(item.Shopping_List_ItemID);

              // Notify parent
              if (onDelete) {
                onDelete(item.Shopping_List_ItemID);
              }
            } catch (error) {
              console.log("Delete failed:", error);
              Alert.alert("Error", "Failed to delete the shopping list.");
            }
          },
        },
      ]
    );
  };
  // Remove workflow
  const handleRemoveSelected = async () => {
    if (selectedProducts.length === 0) return;

    const productIds = selectedProducts.map((p) => p.ProductID);
    const shoppingListIds = [item.Shopping_List_ItemID];

    await removeProductsFromShoppingList(productIds, shoppingListIds);

    setProducts((prev) => prev.filter((p) => !selectedProducts.includes(p)));

    setSelectionMode(false);
    setSelectedProducts([]);
  };

  // Edit workflow: move selected products to "Bought"
  const handleUpdateSelected = async () => {
    if (selectedProducts.length === 0) return;

    const productIds = selectedProducts.map((p) => p.ProductID);
    const shoppingListIds = [item.Shopping_List_ItemID];

    await updateProductsStatusesFromShoppingList(productIds, shoppingListIds);

    // Update local state
    setProducts((prev) =>
      prev.map((p) =>
        selectedProducts.includes(p) ? { ...p, Status: "Bought" } : p
      )
    );

    setSelectionMode(false);
    setEditMode(false);
    setSelectedProducts([]);
  };

  const listBackgroundColor = index % 2 === 0 ? "#f9f9fc" : "#f0f0ff";

  const toBuyProducts = products.filter((p) => p.Status === "ToBuy");
  const boughtProducts = products.filter((p) => p.Status === "Bought");

  return (
        <View style={styles.card}>
              {/* Header */}
            <TouchableOpacity
          onPress={() => setExpanded(!expanded)}
          style={styles.headerRow}
        >
        <View style={styles.textContainer}>
          <Text style={styles.name}>{item.Name}</Text>
          <Text style={styles.createdAt}>
            {new Date(item.AddedAt).toLocaleDateString()}{" "}
            {new Date(item.AddedAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Text>
        </View>

        <View style={styles.deleteContainer}>
          <View style={styles.verticalLine} />
          <TouchableOpacity onPress={handleDeleteList} style={styles.trashButton}>
            <Feather name="trash-2" size={22} color="#c00" />
          </TouchableOpacity>
        </View>
      </TouchableOpacity>


      <Text style={styles.count}>{products.length} Products</Text>

      {/* Sections visible only when expanded */}
      {expanded && (
        <View>
          {/* To Buy Section */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowToBuy(!showToBuy)}
          >
            <Text style={styles.sectionTitle}>
              To Buy ({toBuyProducts.length})
            </Text>
            <Text style={styles.toggleIcon}>{showToBuy ? "−" : "+"}</Text>
          </TouchableOpacity>
          {showToBuy && (
            <FlatList
              data={toBuyProducts}
              keyExtractor={(p) => p.ProductID.toString()}
              renderItem={({ item: product }) => (
                <ProductCardSL
                  product={product}
                  showPrice={false}
                  selectionMode={selectionMode}
                  selected={selectedProducts.includes(product)}
                  onSelect={() => toggleSelection(product)}
                />
              )}
              scrollEnabled={false}
              style={styles.productList}
            />
          )}

          {/* Bought Section */}
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => setShowBought(!showBought)}
          >
            <Text style={styles.sectionTitle}>
              Bought ({boughtProducts.length})
            </Text>
            <Text style={styles.toggleIcon}>{showBought ? "−" : "+"}</Text>
          </TouchableOpacity>
          {showBought && (
            <FlatList
              data={boughtProducts}
              keyExtractor={(p) => p.ProductID.toString()}
              renderItem={({ item: product }) => (
                <ProductCardSL
                  product={product}
                  showPrice={false}
                  selectionMode={selectionMode}
                  selected={selectedProducts.includes(product)}
                  onSelect={() => toggleSelection(product)}
                />
              )}
              scrollEnabled={false}
              style={styles.productList}
            />
          )}

          {/* Action buttons */}
          {!selectionMode ? (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#6c63ff" }]}
                onPress={() => {
                  setSelectionMode(true);
                  setEditMode(false); // Remove mode
                }}
              >
                <Text style={styles.actionText}>Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#ffa500" }]}
                onPress={() => {
                  setSelectionMode(true);
                  setEditMode(true); // Edit mode
                }}
              >
                <Text style={styles.actionText}>Edit</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[
                  styles.actionButton,
                  { backgroundColor: editMode ? "#6c63ff" : "#ff6b6b" },
                ]}
                onPress={editMode ? handleUpdateSelected : handleRemoveSelected}
              >
                <Text style={styles.actionText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#aaa" }]}
                onPress={() => {
                  setSelectionMode(false);
                  setEditMode(false);
                  setSelectedProducts([]);
                }}
              >
                <Text style={styles.actionText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          )}
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
card: {
  padding: 12,
  borderRadius: 12,
  marginBottom: 12,
   backgroundColor: "#8c82ff", // lighter theme color
  shadowColor: "#000",
  shadowOpacity: 0.1,
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
    elevation: 2, // shadow for Android
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
  },
    textContainer: {
    flex: 1, // take remaining space
  },
  name: { fontSize: 16, fontWeight: "700", color: "#6c63ff" },
      createdAt: {
    fontSize: 12,
    color: "#666",
    marginTop: 2,
  },
count: { 
  fontSize: 12, 
  color: "#fff", // changed to white
  marginVertical: 4,
},


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

  productList: {
    marginTop: 4,
    marginBottom: 8,
  },

  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
  },
  actionButton: {
    flex: 1,
    paddingVertical: 8,
    borderRadius: 8,
    marginHorizontal: 5,
    alignItems: "center",
  },
  actionText: { color: "#fff", fontWeight: "600" },
});
