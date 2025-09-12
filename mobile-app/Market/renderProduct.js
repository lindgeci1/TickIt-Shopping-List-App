import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";

export const renderProduct = (item) => (
  <View style={styles.card}>
    <View style={styles.photoBox}>
      <Image
        source={{ uri: item.Photos?.[0] || "https://via.placeholder.com/50" }}
        style={styles.photo}
        resizeMode="cover"
      />
    </View>

    <View style={styles.infoBox}>
      <Text style={styles.name}>{item.Name || "Unnamed Product"}</Text>
      <Text style={styles.category}>{item.Category || "No category"}</Text>
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.07,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
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
});
