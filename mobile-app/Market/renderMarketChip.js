import React from "react";
import { TouchableOpacity, Image, StyleSheet } from "react-native";

export const renderMarketChip = (item, activeMarket, onPress) => {
  return (
    <TouchableOpacity
      style={[
        styles.marketChip,
        activeMarket?.MarketID === item.MarketID && {
          borderWidth: 2,
          borderColor: "#6c63ff",
        },
      ]}
      onPress={() => onPress(item)}
    >
      <Image
        source={{ uri: item.Photos?.[0] || "https://via.placeholder.com/50" }}
        style={styles.marketImage}
      />
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  marketChip: {
    width: 60,          // smaller width
    height: 60,         // smaller height
    borderRadius: 12,   // slightly smaller radius
    marginRight: 8,     // reduce spacing
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c63ff20",
  },
  marketImage: {
    width: 40,          // smaller image
    height: 40,
    borderRadius: 8,
  },
});
