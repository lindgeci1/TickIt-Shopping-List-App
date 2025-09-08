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
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async (query = "") => {
    try {
      let url = `${VITE_BASE_API_URL}/api/product/all`;
      if (query) {
        url = `${VITE_BASE_API_URL}/api/product/search?name=${encodeURIComponent(
          query
        )}`;
      }
     const response = await fetch(url);
      const json = await response.json();
      setProducts(json);
    } catch (error) {
      console.log("Fetch error:", error);
      Alert.alert("Error", "Failed to fetch products: " + error.message);
    }
  };

  const handleSearchChange = (text) => {
    setSearch(text);
    fetchProducts(text);
  };

  const renderProduct = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
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
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="Search products..."
        value={search}
        onChangeText={handleSearchChange}
      />

      {/* Categories */}
      <View style={styles.categoriesContainer}>
        {categoriesList.map((cat) => (
          <TouchableOpacity
            key={cat.name}
            style={[styles.categoryBox, { backgroundColor: cat.color + "33" }]}
            onPress={() => fetchProducts(cat.name)}
          >
            <Text style={[styles.categoryText, { color: cat.color }]}>
              {cat.name}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Products List */}
      <Text style={styles.sectionTitle}>
        {search ? `Results for "${search}"` : "All Products"}
      </Text>
      <FlatList
        data={products}
        keyExtractor={(item) => item.ProductID.toString()}
        renderItem={renderProduct}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <Text>No products found</Text>}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f0f0f5" },
  searchBar: {
    height: 45,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 12,
    paddingHorizontal: 15,
    marginBottom: 15,
    backgroundColor: "#fff",
  },
  categoriesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    marginBottom: 15,
  },
  categoryBox: {
    width: "30%",
    marginBottom: 10,
    paddingVertical: 12,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  categoryText: { fontSize: 14, fontWeight: "bold" },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "700",
    marginBottom: 8,
    color: "#333",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 10,
    marginBottom: 10,
    shadowColor: "#000",
    shadowOpacity: 0.08,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  photoBox: {
    width: 50,
    height: 50,
    borderRadius: 10,
    backgroundColor: "#6c63ff20",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 12,
    overflow: "hidden",
  },
  photo: { width: "100%", height: "100%", borderRadius: 10 },
  infoBox: { flex: 1 },
  name: { fontSize: 14, fontWeight: "bold", color: "#333", marginBottom: 2 },
  category: { fontSize: 12, color: "#888", marginBottom: 2 },
  price: { fontSize: 12, fontWeight: "600", color: "#6c63ff" },
});
