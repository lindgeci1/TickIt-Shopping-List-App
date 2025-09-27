import React, { useMemo } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function ProductCardBM({
  product,
  selectionMode = false,
  selected = false,
  onSelect,
  showPrice = true,
  preferredMarketLogo,
  preferredMarketPrice,
  marketMessage,
}) {
  // Make the array stable using useMemo
  const productArray = useMemo(() => [product], [product.ProductID]);


  return (
<View style={styles.card}>
  {selectionMode && (
    <TouchableOpacity
      style={[styles.checkbox, selected && styles.checked]}
      onPress={onSelect}
    >
      {selected && <Text style={styles.checkMark}>✓</Text>}
    </TouchableOpacity>
  )}

  <View style={styles.photoBox}>
    <Image
      source={{ uri: product.Photos?.[0] || "https://via.placeholder.com/50" }}
      style={styles.photo}
      resizeMode="cover"
    />
  </View>

  {/* Wrap info + preferred in a horizontal container */}
  <View style={styles.contentRow}>
    <View style={styles.infoBox}>
      <Text style={styles.name}>{product.Name || "Unnamed Product"}</Text>
      <Text style={styles.category}>{product.Category || "No category"}</Text>
      {showPrice && product.Price != null && (
        <Text style={styles.price}>${product.Price}</Text>
      )}
    </View>

  </View>
</View>

  );
}

// Styles remain the same as your original code
const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0f0ff", borderRadius: 12, padding: 10, marginVertical: 6 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#6c63ff", alignItems: "center", justifyContent: "center", marginRight: 10 },
  checked: { backgroundColor: "#6c63ff" },
  checkMark: { color: "#fff", fontWeight: "bold" },
  photoBox: { width: 55, height: 55, borderRadius: 12, backgroundColor: "#6c63ff20", alignItems: "center", justifyContent: "center", marginRight: 12, overflow: "hidden" },
  photo: { width: "100%", height: "100%", borderRadius: 12 },
  infoBox: { flex: 1 },
  name: { fontSize: 15, fontWeight: "bold", color: "#2d3436", marginBottom: 2 },
  category: { fontSize: 12, color: "#888", marginBottom: 2 },
  price: { fontSize: 13, fontWeight: "600", color: "#444" },
  marketMessage: { fontSize: 12, color: "red", marginTop: 4, fontStyle: "italic" },
preferredBox: {
  alignItems: "center",
  justifyContent: "center",
  marginLeft: 8,
  paddingVertical: 7,    // increase vertical padding
  paddingHorizontal: 7,  // increase horizontal padding
  backgroundColor: "#6c63ff10",
  borderRadius: 8,       // slightly rounder corners
},
preferredLogo: {
  width: 28,
  height: 18,
  borderRadius: 3,
  borderWidth: 1,
  borderColor: "#6c63ff",
  marginBottom: 2,
},
preferredPrice: {
  fontSize: 11,
  fontWeight: "600",
  color: "#444",
  fontStyle: "italic", // subtle, professional touch
},
  contentRow: {
  flex: 1,
  flexDirection: "row",
  alignItems: "center",
},

verticalLine: {
  width: 1,
  backgroundColor: "#ccc",
  marginHorizontal: 8,
  alignSelf: "stretch",
},

});
