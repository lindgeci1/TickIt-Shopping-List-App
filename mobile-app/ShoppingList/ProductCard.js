import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function ProductCard({ product, showPrice = false, onAdd }) {
  return (
    <View style={styles.card}>
      <View style={styles.photoBox}>
        <Image
          source={{ uri: product.Photos?.[0] || "https://via.placeholder.com/50" }}
          style={styles.photo}
          resizeMode="cover"
        />
      </View>
      <View style={styles.infoBox}>
        <Text style={styles.name}>{product.Name || "Unnamed Product"}</Text>
        <Text style={styles.category}>{product.Category || "No category"}</Text>

        {showPrice && (
          <Text style={styles.price}>
            ${product.Price != null ? product.Price : 0}
          </Text>
        )}

        {onAdd && (
          <TouchableOpacity
            style={styles.addButton}
            onPress={() => onAdd(product)}
          >
            <Text style={styles.addButtonText}>+ Add to Buying List</Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0ff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
  },
  photoBox: {
    width: 55,
    height: 55,
    borderRadius: 12,
    backgroundColor: "#6c63ff20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%", borderRadius: 12 },
  infoBox: { flex: 1 },
  name: { fontSize: 15, fontWeight: "bold", color: "#2d3436", marginBottom: 2 },
  category: { fontSize: 12, color: "#888", marginBottom: 2 },
  price: { fontSize: 13, fontWeight: "600", color: "#444" },
  addButton: {
    marginTop: 6,
    backgroundColor: "#6c63ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
