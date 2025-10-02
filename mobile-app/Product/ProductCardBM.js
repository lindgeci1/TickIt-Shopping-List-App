import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export default function ProductCardBM({ productWrapper }) {
  // productWrapper: { Product: {...}, Price: number, Market: { Name, Photos } }
  const { Product, Price, Market } = productWrapper;
  const marketLogo = Market?.Photos?.[0];

  return (
    <View style={styles.card}>
      {/* Left: Product Photo */}
      <View style={styles.photoBox}>
        <Image
          source={{ uri: Product.Photos?.[0] || "https://via.placeholder.com/50" }}
          style={styles.photo}
          resizeMode="cover"
        />
      </View>

      {/* Middle: Product Info */}
      <View style={styles.infoBox}>
        <Text style={styles.name}>{Product.Name || "Unnamed Product"}</Text>
        <Text style={styles.category}>{Product.Category || "No category"}</Text>
      </View>

      {/* Vertical line */}
      {marketLogo && <View style={styles.verticalLine} />}

      {/* Right: Market Logo + Price */}
      {marketLogo && (
        <View style={styles.marketBox}>
          <Image
            source={{ uri: marketLogo }}
            style={styles.marketLogo}
            resizeMode="cover"
          />
          <Text style={styles.marketPrice}>€{Number(Price).toFixed(2)}</Text>
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
    padding: 12,
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
  category: { fontSize: 12, color: "#888" },
  marketBox: {
    alignItems: "center",
    justifyContent: "center",
    marginLeft: 10,
    paddingVertical: 6,
    paddingHorizontal: 8,
    backgroundColor: "#6c63ff10",
    borderRadius: 8,
  },
    verticalLine: {
    width: 1,
    backgroundColor: "#ccc",
    marginHorizontal: 8,
    alignSelf: "stretch", // makes it stretch the height of the row
  },
  marketLogo: { width: 28, height: 18, borderRadius: 3, marginBottom: 2, borderWidth: 1, borderColor: "#6c63ff" },
  marketPrice: { fontSize: 12, fontWeight: "600", color: "#444", fontStyle: "italic" },
});
