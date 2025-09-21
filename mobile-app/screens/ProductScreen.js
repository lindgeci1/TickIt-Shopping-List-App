import React, { useState, useEffect } from "react";
import {
  View, Text, FlatList, StyleSheet, TextInput, TouchableOpacity
} from "react-native";
import Footer from "../components/Footer";
import ShoppingListScreen from "../ShoppingList/ShoppingListScreen";
import ProductCardTOBrowse from "../Product/ProductCardTOBrowse";
import { fetchProducts } from "../Product/fetchProducts";
import { fetchShoppingLists } from "../ShoppingList/fetchShoppingLists";
import { addProductsToShoppingList } from "../Product/addProductsToShoppingList";
import { filterProducts } from "../Product/filterProducts";
import { VITE_BASE_API_URL } from "@env";

const categoriesList = [
  { name: "Food" }, { name: "Hygiene" }, { name: "Drinks" },
  { name: "Electronics" }, { name: "Clothing" }, { name: "Cleaning" },
];

export default function ProductScreen({ navigation, topPadding }) {
  const [allProducts, setAllProducts] = useState([]);
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");
  const [activeCategory, setActiveCategory] = useState(null);
  const [shoppingLists, setShoppingLists] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectionMode, setSelectionMode] = useState(false);
  const [selectedProducts, setSelectedProducts] = useState([]);
const [preferredMarkets, setPreferredMarkets] = useState({});
const [marketMessages, setMarketMessages] = useState({});
const [preferredMarketPrices, setPreferredMarketPrices] = useState({});
  useEffect(() => {
    fetchProducts(setAllProducts, setProducts);
    fetchShoppingLists(setShoppingLists);
  }, []);
useEffect(() => {
  const fetchAllPreferredMarkets = async () => {
    const logos = {};
    const messages = {};
    const prices = {}; // <-- new object to store prices

    for (let product of products) {
      if (!preferredMarkets[product.ProductID]) {
        try {
          const res = await fetch(`${VITE_BASE_API_URL}/api/product-market/preferred/${product.ProductID}`);
          const data = await res.json();
        console.log("Preferred market API response:", data);
          logos[product.ProductID] = data.PreferredMarketLogo || null;
          prices[product.ProductID] = data.Price ?? null;
          messages[product.ProductID] = data.message || "Product is not assigned to any market"; // default message

        } catch (err) {
          console.error("Failed to fetch preferred market", err);
          logos[product.ProductID] = null;
          prices[product.ProductID] = null; // fallback if error
          messages[product.ProductID] = "Product is not assigned to any market";
        }
      }
    }

    setPreferredMarkets(prev => ({ ...prev, ...logos }));
    setMarketMessages(prev => ({ ...prev, ...messages }));
    setPreferredMarketPrices(prev => ({ ...prev, ...prices })); // <-- update state
  };

  if (products.length) fetchAllPreferredMarkets();
}, [products]);

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
  <ProductCardTOBrowse
    product={item}
    selectionMode={selectionMode}
    selected={selectedProducts.includes(item)}
    onSelect={() => toggleSelection(item)}
    showPrice={false} // general product price
    preferredMarketLogo={preferredMarkets[item.ProductID]}
    preferredMarketPrice={preferredMarketPrices[item.ProductID]}
    marketMessage={marketMessages[item.ProductID]}
  />
);

return (
<View style={[styles.container, { paddingTop: topPadding + 15 }]}>

<Text style={[styles.headerTitle, { marginBottom: 20 }]}>Browse Products</Text>

{/* Search input only, no header */}
<TextInput
  style={styles.searchBar}
  placeholder="Search products..."
  placeholderTextColor="#555" // same as categoryText
  value={search}
  onChangeText={handleSearchChange}
/>


{/* Categories below */}
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
            backgroundColor: isActive ? "#6c63ff22" : "#e8e8ff",
            borderColor: isActive ? "#6c63ff" : "#d1d1f0",
          }
        ]}
        onPress={() => handleCategoryPress(cat.name)}
      >
        <Text style={[
          styles.categoryText,
          { color: isActive ? "#6c63ff" : "#555" }
        ]}>{cat.name}</Text>
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
  key="two-columns" // <-- force FlatList to treat it as fresh
  data={products}
  keyExtractor={(item) => item.ProductID.toString()}
  renderItem={renderProduct}
  numColumns={2} // fixed number of columns
  columnWrapperStyle={{ justifyContent: "space-between" }}
  contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}
  showsVerticalScrollIndicator={false}
  ListEmptyComponent={() => (
    <Text style={styles.emptyText}>
      No products found
    </Text>
  )}
/>


    {/* Shopping List Modal */}
    <ShoppingListScreen
      visible={modalVisible}
      onClose={() => setModalVisible(false)}
      shoppingLists={shoppingLists}
      onSelect={async (list) => {
        const productIds = selectedProducts.map(p => p.ProductID);
        const shoppingListIds = [list.Shopping_List_ItemID];

        console.log("Adding products to list:", { productIds, shoppingListIds });
        
        await addProductsToShoppingList(productIds, shoppingListIds);

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
headerTitle: {
  fontSize: 24,
  fontWeight: "700",
  marginBottom: 15,
  color: "#6c63ff", // purple theme
},
searchBar: {
  height: 48,
  borderWidth: 1.5,           // same as category chips
  borderColor: "#d1d1f0",     // same as inactive category border
  borderRadius: 12,
  paddingHorizontal: 16,
  backgroundColor: "#e8e8ff", // same as inactive category background
  color: "#333",
  fontSize: 16,
  marginBottom: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2, // subtle shadow for Android
},
  sectionLabel: { fontSize: 16, fontWeight: "600", marginVertical: 8, color: "#444" },
categoriesContainer: { 
  flexDirection: "row", 
  flexWrap: "wrap", 
  justifyContent: "center", // center all chips in the row
  marginBottom: 15,
  gap: 10, // optional, space between chips (if your RN version supports it)
},
categoryChip: { 
  width: "30%",               // smaller width, won't expand to edges
  height: 30,                 
  borderWidth: 1.5, 
  borderRadius: 20, 
  marginBottom: 12,           // space between rows
  alignItems: "center",       
  justifyContent: "center",   
  paddingHorizontal: 0,
},
categoryText: { 
  fontSize: 14,               
  fontWeight: "600", 
  color: "#6c63ff" 
},


  globalAddButton: {
    backgroundColor: "#6c63ff",
    paddingVertical: 10,
    borderRadius: 12,
    alignItems: "center",
    marginBottom: 12,
  },
  globalAddButtonText: { color: "#fff", fontWeight: "700" },
  emptyText: {
  textAlign: "center",
  marginTop: 40,       // a bit more spacing
  color: "#6c63ff",    // purple theme
  fontSize: 16,
  fontWeight: "500",
  fontStyle: "italic",
}

});
