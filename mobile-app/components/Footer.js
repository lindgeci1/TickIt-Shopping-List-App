import { MaterialCommunityIcons } from "@expo/vector-icons";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { Ionicons } from "@expo/vector-icons"; // <-- Make sure you install expo/vector-icons

export default function Footer({ navigation, currentRoute }) {
  const tabs = [
    {
      name: "Product",
      label: "Products",
      icon: "bag-handle-outline", // lighter outline
      activeIcon: "bag-handle", // filled version when active
    },
    {
      name: "Market",
      label: "Markets",
      icon: "storefront-outline",
      activeIcon: "storefront",
    },
    {
      name: "ShoppingList",
      label: "Lists",
      icon: "list-outline",
      activeIcon: "list",
    },
  ];

  return (
    <View style={styles.footer}>
      {tabs.map((tab) => {
        const isActive = currentRoute === tab.name;
        return (
          <TouchableOpacity
            key={tab.name}
            style={styles.iconContainer}
            onPress={() => navigation.navigate(tab.name)}
          >
            <Ionicons
              name={isActive ? tab.activeIcon : tab.icon}
              size={26}
              color={isActive ? "#6c63ff" : "#999"}
            />
            <Text style={[styles.label, isActive && styles.activeLabel]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
}

const styles = StyleSheet.create({
  footer: {
    height: 80,
    backgroundColor: "#fff",
    borderTopWidth: 1,
    borderColor: "#ddd",
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "flex-start", // 👈 align items at the top of footer
    paddingTop: 3, // 👈 push icons/text upward a little
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },

  iconContainer: {
    paddingTop: 5,
    alignItems: "center",
    flex: 1,
  },
  label: {
    fontSize: 12,
    color: "#999",
    marginTop: 4,
    fontStyle: "italic", // italic text like you asked
  },
  activeLabel: {
    color: "#6c63ff",
    fontWeight: "600",
  },
});
