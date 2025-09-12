import React, { useState } from "react";
import { View, Text, TouchableOpacity, FlatList, StyleSheet } from "react-native";
import ProductCard from "./ProductCard";

export default function ShoppingListItemCard({ item }) {
  const [expanded, setExpanded] = useState(false);

  return (
    <View style={styles.card}>
      <TouchableOpacity onPress={() => setExpanded(!expanded)}>
        <Text style={styles.name}>{item.Name}</Text>
        <Text style={styles.count}>{item.Products.length} Products</Text>
      </TouchableOpacity>

      {expanded && (
        <FlatList
          data={item.Products}
          keyExtractor={(p) => p.ProductID.toString()}
          renderItem={({ item: product }) => <ProductCard product={product} />}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: "#fff",
    padding: 12,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  name: { fontSize: 16, fontWeight: "600", color: "#6c63ff" },
  count: { fontSize: 12, color: "#666", marginTop: 2 },
});
