import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, StyleSheet, Image, TouchableOpacity, TextInput, Alert,
} from "react-native";
import Footer from "../components/Footer";
import ShoppingListModal from "../Product/ShoppingListModal";
import ProductCard from "../ShoppingList/ProductCard";
import { fetchProducts } from "../Product/fetchProducts";
import { fetchShoppingLists } from "../Product/fetchShoppingLists";
import { addToShoppingList } from "../Product/addToShoppingList";
import { filterProducts } from "../Product/filterProducts";
import { VITE_BASE_API_URL } from "@env";

const categoriesList = [
  { name: "Food" }, { name: "Hygiene" }, { name: "Drinks" },
  { name: "Electronics" }, { name: "Clothing" }, { name: "Cleaning" },
];

export default function ProductScreen({ navigation }) {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);

  useEffect(() => {
    fetchProducts(setAllProducts, setProducts);
    fetchShoppingLists(setShoppingLists);
  }, []);

  const handleSearchChange = (text) => {
    setSearch(text);
    filterProducts(allProducts, setProducts, text, activeCategory);
  };

  const handleCategoryPress = (category) => {
    const newCategory = category === activeCategory ? null : category;
    setActiveCategory(newCategory);
    filterProducts(allProducts, setProducts, search, newCategory);
  };

const renderProduct = ({ item }) => (
  <ProductCard
    product={item}
    showPrice={false}
    onAdd={(p) => {
      setSelectedProduct(p);
      setModalVisible(true);
    }}
  />
);


  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Browse Products</Text>

      <TextInput
        style={styles.searchBar}
        placeholder="🔍  Search products..."
        value={search}
        onChangeText={handleSearchChange}
      />

      <Text style={styles.sectionLabel}>Categories</Text>
      <View style={styles.categoriesContainer}>
        {categoriesList.map((cat) => {
          const isActive = cat.name === activeCategory;
          return (
            <TouchableOpacity
              key={cat.name}
              style={[styles.categoryChip, { backgroundColor: isActive ? "#6c63ff22" : "#fff" }]}
              onPress={() => handleCategoryPress(cat.name)}
            >
              <Text style={styles.categoryText}>{cat.name}</Text>
            </TouchableOpacity>
          );
        })}
      </View>

<FlatList
  data={products}
  keyExtractor={(item) => item.ProductID.toString()}
  renderItem={renderProduct}
  contentContainerStyle={{ paddingVertical: 10 }}
  showsVerticalScrollIndicator={false}
  ListEmptyComponent={() => (
    <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>No products found</Text>
  )}
/>


      {/* Shopping List Modal */}
      <ShoppingListModal
        visible={modalVisible}
        onClose={() => setModalVisible(false)}
        shoppingLists={shoppingLists}
        onSelect={async (list) => {
          if (!selectedProduct) return;
          await addToShoppingList(selectedProduct.ProductID, list.Shopping_List_ItemID);
          fetchShoppingLists(setShoppingLists);
          setSelectedProduct(null);
          setModalVisible(false);
        }}
        onCreate={async (name) => {
  try {
    const res = await fetch(`${VITE_BASE_API_URL}/api/shopping-list/create`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ Name: name, AddedAt: new Date().toISOString() }),
    });

    const newList = await res.json();

    if (!res.ok) {
      // Backend returned a validation error
      return { errorMessage: newList.message || "Failed to create list" };
    }

    // Success: update state and return data
    setShoppingLists((prev) => [...prev, newList]);
    return { data: newList };

  } catch (err) {
    console.error(err);
    return { errorMessage: err.message || "Network error" };
  }
}}
      />

      <Footer navigation={navigation} currentRoute="Product" />
    </View>
  );
}
const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9fc" },
  headerTitle: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#2d3436" },
  searchBar: { height: 45, borderWidth: 1, borderColor: "#ddd", borderRadius: 12, paddingHorizontal: 15, marginBottom: 15, backgroundColor: "#fff" },
  sectionLabel: { fontSize: 16, fontWeight: "600", marginVertical: 8, color: "#444" },
  categoriesContainer: { flexDirection: "row", flexWrap: "wrap", gap: 8, marginBottom: 15 },
  addButton: { marginTop: 6, backgroundColor: "#6c63ff", paddingVertical: 6, paddingHorizontal: 12, borderRadius: 8, alignSelf: "flex-start" },
  addButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
  categoryChip: { borderWidth: 1.5, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginBottom: 8 },
  categoryText: { fontSize: 13, fontWeight: "600", color: "#6c63ff" },
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#fff", borderRadius: 12, padding: 12, marginBottom: 12 },
  photoBox: { width: 55, height: 55, borderRadius: 12, backgroundColor: "#6c63ff20", alignItems: "center", justifyContent: "center", marginRight: 12, overflow: "hidden" },
  photo: { width: "100%", height: "100%", borderRadius: 12 },
  infoBox: { flex: 1 },
  name: { fontSize: 15, fontWeight: "bold", color: "#2d3436", marginBottom: 2 },
  category: { fontSize: 12, color: "#888", marginBottom: 2 },
});
