import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity
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
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);

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

  const toggleSelection = (product) => {
    setSelectedProducts((prev) =>
      prev.includes(product)
        ? prev.filter((p) => p !== product)
        : [...prev, product]
    );
  };

  const handleAddToBuyingList = () => {
    if (!selectionMode) {
      // Activate selection mode
      setSelectionMode(true);
      setSelectedProducts([]);
    } else if (selectedProducts.length > 0) {
      // Open modal for adding to shopping list
      setModalVisible(true);
    }
  };

  const renderProduct = ({ item }) => (
<ProductCard
  product={item}
  selectionMode={selectionMode}
  selected={selectedProducts.includes(item)}
  onSelect={() => toggleSelection(item)}
  showPrice={false} // hide price
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
    <TouchableOpacity
      style={styles.globalAddButton}
      onPress={handleAddToBuyingList}
    >
      <Text style={styles.globalAddButtonText}>
        {selectionMode ? `Add ${selectedProducts.length} selected` : "+ Add to Buying List"}
      </Text>
    </TouchableOpacity>
    {/* Cancel button below categories */}
    {selectionMode && (
      <TouchableOpacity
        style={[styles.globalAddButton, { backgroundColor: "#ff6b6b", marginBottom: 12 }]}
        onPress={() => {
          setSelectionMode(false);
          setSelectedProducts([]);
        }}
      >
        <Text style={styles.globalAddButtonText}>Cancel</Text>
      </TouchableOpacity>
    )}

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

    {/* Shopping List Modal */}
    <ShoppingListModal
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      shoppingLists={shoppingLists}
      onSelect={async (list) => {
        const productIds = selectedProducts.map(p => p.ProductID);
        const shoppingListIds = [list.Shopping_List_ItemID];

        console.log("Adding products to list:", { productIds, shoppingListIds });
        
        await addToShoppingList(productIds, shoppingListIds);

        fetchShoppingLists(setShoppingLists);
        setSelectedProducts([]);
        setSelectionMode(false);
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
          if (!res.ok) return { errorMessage: newList.message || "Failed to create list" };
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
  categoryChip: { borderWidth: 1.5, paddingVertical: 6, paddingHorizontal: 14, borderRadius: 20, marginBottom: 8 },
  categoryText: { fontSize: 13, fontWeight: "600", color: "#6c63ff" },
  globalAddButton: {
    backgroundColor: "#6c63ff",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  globalAddButtonText: { color: "#fff", fontWeight: "700" },
});
