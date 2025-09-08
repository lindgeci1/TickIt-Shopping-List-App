import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
  TextInput,
} from "react-native";
import { VITE_BASE_API_URL } from "@env";

const categoriesList = [
  { name: "Food", color: "#FF9F43" },
  { name: "Hygiene", color: "#0ABDE3" },
  { name: "Drinks", color: "#10AC84" },
  { name: "Electronics", color: "#341f97" },
  { name: "Clothing", color: "#ff6b6b" },
  { name: "Cleaning", color: "#576574" },
];

export default function ProductScreen() {
  const [allProducts, setAllProducts] = useState([]); // raw data
  const [products, setProducts] = useState([]); // filtered data
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);
const addToShoppingList = async (productId) => {
  try {
    const url = `${VITE_BASE_API_URL}/api/shopping-list/create`;

    // 📌 Current time in ISO format (Laravel will parse this easily)
    const now = new Date().toISOString();

    const response = await fetch(url, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        ProductID: productId,
        Status: "ToBuy",
        AddedAt: now,   // 👈 send today's timestamp
        BoughtAt: null, // stays null
      }),
    });

    if (!response.ok) {
      throw new Error(`Error ${response.status}`);
    }

    const data = await response.json();
    Alert.alert("✅ Success", "Product added to buying list!");
    console.log("Created shopping list item:", data);
  } catch (error) {
    console.error("Add error:", error);
    Alert.alert("❌ Error", "Failed to add product: " + error.message);
  }
};

  const fetchProducts = async () => {
    try {
      const url = `${VITE_BASE_API_URL}/api/product/all`;
      const response = await fetch(url);
      const json = await response.json();
      setAllProducts(json);
      setProducts(json); // initially show all
    } catch (error) {
      console.log("Fetch error:", error);
      Alert.alert("Error", "Failed to fetch products: " + error.message);
    }
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    filterProducts(text, activeCategory);
  };

  const handleCategoryPress = (category) => {
    const newCategory = category === activeCategory ? null : category; // toggle
    setActiveCategory(newCategory);
    filterProducts(search, newCategory);
  };

const filterProducts = (query, category) => {
  let filtered = [...allProducts];

  // Normalize Category to capitalized form (e.g., "Food")
  filtered = filtered.map((p) => ({
    ...p,
    Category: p.Category
      ? p.Category.charAt(0).toUpperCase() + p.Category.slice(1).toLowerCase()
      : null,
  }));

  // Search filter
  if (query) {
    filtered = filtered.filter((p) =>
      p.Name?.toLowerCase().includes(query.toLowerCase())
    );
  }

  // Category filter (case-insensitive, but unified in display)
  if (category) {
    filtered = filtered.filter(
      (p) => p.Category?.toLowerCase() === category.toLowerCase()
    );
  }

  setProducts(filtered);
};


const renderProduct = ({ item }) => (
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
      <Text style={styles.price}>
        {item.Price != null ? `$${item.Price.toFixed(2)}` : "Price N/A"}
      </Text>

      {/* 👇 Add to Buying List Button */}
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => addToShoppingList(item.ProductID)}
      >
        <Text style={styles.addButtonText}>+ Add to Buying List</Text>
      </TouchableOpacity>
    </View>
  </View>
);


  return (
    <View style={styles.container}>
      {/* Page Header */}
      <Text style={styles.headerTitle}>Browse Products</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="🔍  Search products..."
        value={search}
        onChangeText={handleSearchChange}
      />

      {/* Categories */}
      <Text style={styles.sectionLabel}>Categories</Text>
<View style={styles.categoriesContainer}>
  {categoriesList.map((cat) => {
    const isActive = cat.name === activeCategory;
    return (
      <TouchableOpacity
        key={cat.name}
        style={[
          styles.categoryChip,
          {
            borderColor: "#6c63ff", // same purple border
            backgroundColor: isActive ? "#6c63ff22" : "#fff", // subtle purple when active
            borderRadius: 12, // rounded rectangle
            paddingVertical: 10,
            paddingHorizontal: 18,
          },
        ]}
        onPress={() => handleCategoryPress(cat.name)}
      >
        <Text
          style={[
            styles.categoryText,
            {
              color: isActive ? "#6c63ff" : "#6c63ff", // always purple text
              fontSize: 14,
              fontWeight: "700",
            },
          ]}
        >
          {cat.name}
        </Text>
      </TouchableOpacity>
    );
  })}
</View>



      {/* Products List */}
      <Text style={styles.sectionLabel}>
        {activeCategory
          ? `Showing ${activeCategory} products`
          : search
          ? `Results for "${search}"`
          : "All Products"}
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.ProductID.toString()}
        renderItem={renderProduct}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
            No products found
          </Text>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9fc" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#2d3436",
  },
  searchBar: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#444",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 15,
  },
  addButton: {
  marginTop: 6,
  backgroundColor: "#6c63ff",
  paddingVertical: 6,
  paddingHorizontal: 12,
  borderRadius: 8,
  alignSelf: "flex-start",
},
addButtonText: {
  color: "#fff",
  fontSize: 13,
  fontWeight: "600",
},
  categoryChip: {
    borderWidth: 1.5,
    paddingVertical: 6,
    paddingHorizontal: 14,
    borderRadius: 20,
    backgroundColor: "#fff",
    marginBottom: 8,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    elevation: 1,
  },
  categoryText: { fontSize: 13, fontWeight: "600" },
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
  price: { fontSize: 13, fontWeight: "600", color: "#6c63ff" },
});
