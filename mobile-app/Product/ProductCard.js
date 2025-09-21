import React from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity } from "react-native";

export default function ProductCard({
  product,
  selectionMode = false,
  selected = false,
  onSelect,
  showPrice = true, 
  preferredMarketLogo, 
  preferredMarketPrice,
  marketMessage, // ✅ add this line
}) {

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

<View style={styles.infoBox}>
  <Text style={styles.name}>{product.Name || "Unnamed Product"}</Text>
  <Text style={styles.category}>{product.Category || "No category"}</Text>
  {showPrice && product.Price != null && (
    <Text style={styles.price}>${product.Price}</Text>
  )}

  {/* Add this line here */}
{/* Show message only if product has no preferred market */}
{!preferredMarketLogo && marketMessage && (
  <Text style={styles.marketMessage}>{marketMessage}</Text>
)}

</View>

{preferredMarketLogo && (
  <View style={styles.preferredBox}>
    <Text style={styles.preferredText}>Preferred:</Text>
    <Image
      source={{ uri: preferredMarketLogo }}
      style={styles.preferredLogo}
      resizeMode="cover"
    />
    {preferredMarketPrice != null && (
      <Text style={styles.preferredPrice}>€{preferredMarketPrice.toFixed(2)}</Text>
    )}
  </View>
)}



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
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6c63ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checked: { backgroundColor: "#6c63ff" },
  checkMark: { color: "#fff", fontWeight: "bold" },
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
 logoBox: {
  flexDirection: "row",       // horizontal layout
  alignItems: "center",
  marginLeft: 10,
},
preferredText: {
  fontSize: 12,
  color: "#6c63ff",   
  marginRight: 6,            // space between text and logo
},
logo: {
  width: 50,                  // rectangular shape
  height: 30,
  borderRadius: 6,            // small rounded corners
  borderWidth: 1.5,
  borderColor: "#6c63ff",
},

marketMessage: {
  fontSize: 12,
  color: "red",
  marginTop: 4,
  fontStyle: "italic",
},
logoPrice: {
  fontSize: 13,
  fontWeight: "600",
  color: "#444",
  marginLeft: 6, // space between logo and price
},preferredBox: {
  alignItems: "center",
  marginLeft: 10,
  justifyContent: "center",
},
preferredText: {
  fontSize: 10,             // smaller
  color: "#6c63ff",
  fontWeight: "600",
  marginBottom: 2,          // tighter spacing
},
preferredLogo: {
  width: 40,                // smaller logo
  height: 25,
  borderRadius: 4,
  borderWidth: 1,
  borderColor: "#6c63ff",
  marginBottom: 2,          // tighter spacing
},
preferredPrice: {
  fontSize: 12,             // slightly smaller price
  fontWeight: "700",
  color: "#444",
},


});
