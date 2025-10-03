import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Ionicons } from "@expo/vector-icons";

export default function Footer({ navigation, currentRoute }) {
  const tabs = [
    { name: "Product", label: "Products", icon: "bag-handle-outline", activeIcon: "bag-handle" },
    { name: "Market", label: "Markets", icon: "storefront-outline", activeIcon: "storefront" },
    { name: "ShoppingList", label: "Lists", icon: "list-outline", activeIcon: "list" },
  ];

  return (
    <SafeAreaView
      edges={["bottom"]}
      style={styles.safeArea}
    >
      <View style={styles.footer}>
        {tabs.map((tab) => {
          const isActive = currentRoute === tab.name;
          return (
            <TouchableOpacity
              key={tab.name}
              style={styles.iconContainer}
              onPress={() => {
                const currentIndex = tabs.findIndex((t) => t.name === currentRoute);
                const nextIndex = tabs.findIndex((t) => t.name === tab.name);
                const direction = nextIndex > currentIndex ? "right" : "left";

                navigation.navigate(tab.name, { direction });
              }}
            >
              <Ionicons
                name={isActive ? tab.activeIcon : tab.icon}
                size={26}
                color={isActive ? "#6c63ff" : "#999"}
              />
              <Text style={[styles.label, isActive && styles.activeLabel]}>{tab.label}</Text>
            </TouchableOpacity>
          );
        })}
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: "#fff",
  },
  footer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    borderTopWidth: 1,
    borderColor: "#ddd",
    paddingVertical: 8,
    backgroundColor: "#fff",
  },
  iconContainer: {
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginTop: 2,
    fontStyle: "italic",
  },
  activeLabel: {
    color: "#6c63ff",
    fontWeight: "600",
  },
});
