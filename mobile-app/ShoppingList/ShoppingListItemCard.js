import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet, Alert } from "react-native";
import ProductCard from "./ProductCard";
import { removeFromShoppingList } from "./removeFromShoppingList";

export default function ShoppingListItemCard({ item, index }) {
  const [expanded, setExpanded] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
  const [products, setProducts] = useState(item.Products); // local copy for realtime updates

  const toggleSelection = (product) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  const handleRemoveSelected = async () => {
    if (selectedProducts.length === 0) return;

    const productIds = selectedProducts.map((p) => p.ProductID);
    const shoppingListIds = [item.Shopping_List_ItemID];

    await removeFromShoppingList(productIds, shoppingListIds);

    // Remove products locally to update UI in real-time
    setProducts((prev) =>
      prev.filter((p) => !selectedProducts.includes(p))
    );

    setSelectionMode(false);
    setSelectedProducts([]);
  };

  const listBackgroundColor = index % 2 === 0 ? "#f9f9fc" : "#f0f0ff";

  return (
    <View style={[styles.card, { backgroundColor: listBackgroundColor }]}>
      <TouchableOpacity
        onPress={() => setExpanded(!expanded)}
        style={styles.headerRow}
      >
        <Text style={styles.name}>{item.Name}</Text>
        <Text style={styles.createdAt}>{new Date(item.AddedAt).toLocaleDateString()}</Text>
      </TouchableOpacity>

      <Text style={styles.count}>{products.length} Products</Text>

      {expanded && products.length > 0 && (
        <View>
          <FlatList
            data={products}
            keyExtractor={(p) => p.ProductID.toString()}
            renderItem={({ item: product }) => (
              <ProductCard
                product={product}
                showPrice={false}
                selectionMode={selectionMode}
                selected={selectedProducts.includes(product)}
                onSelect={() => toggleSelection(product)}
              />
            )}
            scrollEnabled={false}
          />

          {/* Action buttons */}
          {!selectionMode ? (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#6c63ff" }]}
                onPress={() => setSelectionMode(true)}
              >
                <Text style={styles.actionText}>Remove Products</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#ffa500" }]}
                onPress={() => Alert.alert("Edit", "Edit list feature coming soon")}
              >
                <Text style={styles.actionText}>Edit List</Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.actionsRow}>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#ff6b6b" }]}
                onPress={handleRemoveSelected}
              >
                <Text style={styles.actionText}>Confirm Remove</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionButton, { backgroundColor: "#aaa" }]}
                onPress={() => {
                  setSelectionMode(false);
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
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  name: { fontSize: 16, fontWeight: "600", color: "#6c63ff" },
  createdAt: { fontSize: 12, color: "#666" },
  count: { fontSize: 12, color: "#666", marginVertical: 4 },
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
