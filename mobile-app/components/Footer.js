import React from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";

export default function Footer({ navigation, currentRoute }) {
  return (
    <View style={styles.footer}>
      {/* Products Icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("Product")}
      >
        <View
          style={[
            styles.iconPlaceholder,
            currentRoute === "Product" && styles.activeIcon,
          ]}
        >
          <Text
            style={[
              styles.iconText,
              currentRoute === "Product" && styles.activeIconText,
            ]}
          >
            P
          </Text>
        </View>
        <Text
          style={[
            styles.label,
            currentRoute === "Product" && styles.activeLabel,
          ]}
        >
          Products
        </Text>
      </TouchableOpacity>

      {/* Market Icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("Market")}
      >
        <View
          style={[
            styles.iconPlaceholder,
            currentRoute === "Market" && styles.activeIcon,
          ]}
        >
          <Text
            style={[
              styles.iconText,
              currentRoute === "Market" && styles.activeIconText,
            ]}
          >
            M
          </Text>
        </View>
        <Text
          style={[
            styles.label,
            currentRoute === "Market" && styles.activeLabel,
          ]}
        >
          Markets
        </Text>
      </TouchableOpacity>

      {/* Shopping List Icon */}
      <TouchableOpacity
        style={styles.iconContainer}
        onPress={() => navigation.navigate("ShoppingList")}
      >
        <View
          style={[
            styles.iconPlaceholder,
            currentRoute === "ShoppingList" && styles.activeIcon,
          ]}
        >
          <Text
            style={[
              styles.iconText,
              currentRoute === "ShoppingList" && styles.activeIconText,
            ]}
          >
            S
          </Text>
        </View>
        <Text
          style={[
            styles.label,
            currentRoute === "ShoppingList" && styles.activeLabel,
          ]}
        >
          Lists
        </Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 70,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: -15,
  },
  iconContainer: {
    alignItems: "center",
    marginHorizontal: 20,
  },
  iconPlaceholder: {
    width: 35,
    height: 35,
    borderRadius: 18,
    backgroundColor: "#6c63ff",
    justifyContent: "center",
    alignItems: "center",
  },
  iconText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 14,
  },
  label: {
    fontSize: 12,
    color: "#6c63ff",
    marginTop: 4,
  },
  activeIcon: {
    backgroundColor: "#574bff",
  },
  activeIconText: {
    fontSize: 14,
  },
  activeLabel: {
    fontSize: 12,
    fontWeight: "700",
    color: "#574bff",
  },
});
