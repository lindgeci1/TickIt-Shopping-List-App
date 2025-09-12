import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

export const renderMarketChip = (item, activeMarket, onPress) => {
  return (
    <TouchableOpacity
      style={[styles.marketChip, { backgroundColor: "#6c63ff20" }]}
      onPress={() => onPress(item)}
    >
      <Image
        source={{ uri: item.Photos?.[0] || "https://via.placeholder.com/60" }}
        style={styles.marketImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  marketChip: {
    width: 90,
    height: 90,
    borderRadius: 16,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  marketImage: { width: 60, height: 60, borderRadius: 12 },
});
