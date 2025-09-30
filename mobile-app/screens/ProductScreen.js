import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  LayoutAnimation,
} from "react-native";
import Footer from "../components/Footer";
import ShoppingListScreen from "../ShoppingList/ShoppingListScreen";
import ProductCardBP from "../Product/ProductCardBP";
import { fetchProducts } from "../Product/fetchProducts";
import { fetchShoppingLists } from "../ShoppingList/fetchShoppingLists";
import { addProductsToShoppingList } from "../Product/addProductsToShoppingList";
import { filterProducts } from "../Product/filterProducts";
import { fetchMarkets } from "../Market/fetchMarkets"; // adjust path
import ProductFilterPanel from "../Product/ProductFilterPanel";
import usePreferredMarkets from "../Product/usePreferredMarkets"; // adjust path
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
  const [markets, setMarkets] = useState([]);
  const [activeMarket, setActiveMarket] = useState(null);
  const [marketProducts, setMarketProducts] = useState([]);
const { preferredMarkets, marketMessages, preferredMarketPrices } = usePreferredMarkets(products);
const [favoriteProducts, setFavoriteProducts] = useState([]);
  useEffect(() => {
    fetchProducts(setAllProducts, setProducts);
    fetchShoppingLists(setShoppingLists);
    fetchMarkets(setMarkets);
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
      setSelectionMode(true);
      setSelectedProducts([]);
    } else if (selectedProducts.length > 0) {
      setModalVisible(true);
    }
  };

  const renderProduct = ({ item }) => (
    <ProductCardBP
      product={item}
      selectionMode={selectionMode}
      selected={selectedProducts.includes(item)}
      onSelect={() => toggleSelection(item)}
      showPrice={false}
      preferredMarketLogo={preferredMarkets[item.ProductID]}
      preferredMarketPrice={preferredMarketPrices[item.ProductID]}
      marketMessage={marketMessages[item.ProductID]}
    />
  );

  /** ---------------- Filter Panel ---------------- */
  const [filterExpanded, setFilterExpanded] = useState(false);
  const toggleFilterExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilterExpanded(!filterExpanded);
  };

  /** ---------------- Render ---------------- */
  return (
    <View style={[styles.container, { paddingTop: topPadding + 15 }]}>
      <Text style={[styles.headerTitle, { marginBottom: 15 }]}>Browse Products</Text>

      {/* Filter Screen List */}
<ProductFilterPanel
  categoriesList={categoriesList}
  search={search}
  onSearchChange={handleSearchChange}
  activeCategory={activeCategory}
  onCategoryPress={handleCategoryPress}
  markets={markets}
  activeMarket={activeMarket}
  setActiveMarket={setActiveMarket}
  setMarketProducts={setMarketProducts}
  setFavoriteProducts={setFavoriteProducts} // <- new prop
/>

      {/* Add to Buying List */}
      <TouchableOpacity
        style={styles.globalAddButton}
        onPress={handleAddToBuyingList}
      >
        <Text style={styles.globalAddButtonText}>
          {selectionMode ? `Add ${selectedProducts.length} selected` : "+ Add to Buying List"}
        </Text>
      </TouchableOpacity>

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

      {/* Products Grid */}
<FlatList
  data={favoriteProducts.length > 0 ? favoriteProducts : (activeMarket ? marketProducts : products)}
  keyExtractor={(item) => item.ProductID.toString()}
  renderItem={renderProduct}
  numColumns={2}
  columnWrapperStyle={{ justifyContent: "space-between" }}
  contentContainerStyle={{ paddingBottom: 120 }}
  showsVerticalScrollIndicator={false}
  ListEmptyComponent={() => (
    <Text style={styles.emptyText}>No products found</Text>
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
          await addProductsToShoppingList(productIds, shoppingListIds);

          fetchShoppingLists(setShoppingLists);
          setSelectedProducts([]);
          setSelectionMode(false);
          setModalVisible(false);
        }}
      />
      <Footer navigation={navigation} currentRoute="Product" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9fc" },
  headerTitle: { fontSize: 24, fontWeight: "700", marginBottom: 15, color: "#6c63ff" },
  searchBar: { height: 40, borderWidth: 1.5, borderColor: "#d1d1f0", borderRadius: 12, paddingHorizontal: 12, backgroundColor: "#e8e8ff", color: "#333", fontSize: 16, marginBottom: 10 },
  globalAddButton: { backgroundColor: "#6c63ff", paddingVertical: 10, borderRadius: 12, alignItems: "center", marginBottom: 12 },
  globalAddButtonText: { color: "#fff", fontWeight: "700" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#6c63ff", fontSize: 16, fontWeight: "500", fontStyle: "italic" },
});