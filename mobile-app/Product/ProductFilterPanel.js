import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Modal,
  FlatList,
  Image,
  Alert
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VITE_BASE_API_URL } from "@env";
import { fetchFavoriteProducts } from "../Product/fetchFavoriteProducts";

export default function ProductFilterPanel({
  categoriesList,
  search,
  onSearchChange,
  activeCategory,
  onCategoryPress,
  markets,
  activeMarket,
  setActiveMarket,
  setMarketProducts,
  setFavoriteProducts: setParentFavoriteProducts,
   favoritesMode,
   setProducts,
  setFavoritesMode,
  setSearch // added if you pass search setter from parent
  , allProducts
}) {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [allMarketProducts, setAllMarketProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  // const [favoritesMode, setFavoritesMode] = useState(false);

  const toggleFilterExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilterExpanded(!filterExpanded);
  };
const applyFilters = (products, category, searchTerm) => {
  return products.filter(p => {
    const matchesCategory = category ? p.Category === category : true;
    const matchesSearch = searchTerm
      ? p.Name.toLowerCase().includes(searchTerm.toLowerCase())
      : true;
    return matchesCategory && matchesSearch;
  });
};
const handleMarketSelect = async (market) => {
  setActiveMarket(market);
  if (!market) {
    setAllMarketProducts([]);
    setMarketProducts([]);
    return;
  }
  try {
    const res = await fetch(`${VITE_BASE_API_URL}/api/market/${market.MarketID}`);
    const json = await res.json();
    const productsFromMarket = (json.Products || []).map(p => ({
      ProductID: p.ProductID,
      Name: p.Name,
      Category: p.Category,
      Photos: p.Photos || []
    }));
    setAllMarketProducts(productsFromMarket);

    // Use the latest search term here too
    setMarketProducts(applyFilters(productsFromMarket, activeCategory, search));
  } catch (err) {
    console.error(err);
    setAllMarketProducts([]);
    setMarketProducts([]);
  }
};
const handleCategorySelect = (category) => {
  onCategoryPress(category);
  setMarketProducts(applyFilters(allMarketProducts, category, search));
};
const handleSearchChange = (text) => {
  setSearch(text);

  if (favoritesMode) return; // optionally skip if showing favorites

  if (activeMarket) {
    setMarketProducts(applyFilters(allMarketProducts, activeCategory, text));
  } else {
    // filter allProducts directly
    setParentFavoriteProducts?.(null); // optional: reset favorites
    setMarketProducts([]); // clear marketProducts
    setProducts(applyFilters(allProducts, activeCategory, text)); // <--- update products array
  }
};

const handleShowFavorites = async () => {
  try {
    const favoriteData = await fetchFavoriteProducts();
    setFavoriteProducts(favoriteData);
    setParentFavoriteProducts?.(favoriteData);

    // Reset other filters
    onCategoryPress(null);
    setActiveMarket(null);
    setAllMarketProducts([]);
    setSearch?.(""); // clear search if setter provided
    setFavoritesMode(true); // enable favorites mode
  } catch (err) {
    console.error(err);
    Alert.alert("❌ Error", "Failed to fetch favorites");
  }
};


  return (
    <View style={{ marginBottom: 10, padding: 12, backgroundColor: "#f5f5ff", borderRadius: 12 }}>
      {/* Search */}
      <View style={{ flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#d1d1f0", borderRadius: 12, backgroundColor: "#fff", paddingHorizontal: 10, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>
        <Ionicons name="search-outline" size={20} color="#6c63ff" style={{ marginRight: 6 }} />
        <TextInput
          style={{
            flex: 1,
            height: 40,
            fontSize: 15,
            backgroundColor: "#fff",
            color: "#000"
          }}
          placeholder="Search for a product..."
          placeholderTextColor="#777"
          value={search}
          onChangeText={handleSearchChange}
        />

      </View>

      {/* Filters Button */}
      <TouchableOpacity onPress={toggleFilterExpand} style={{ alignSelf: "flex-start", flexDirection: "row", alignItems: "center", backgroundColor: "#6c63ff", paddingHorizontal: 14, paddingVertical: 6, borderRadius: 20 }}>
        <Ionicons name="options-outline" size={18} color="#fff" style={{ marginRight: 6 }} />
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>Filters</Text>
      </TouchableOpacity>


{/* Filters */}
{filterExpanded && (
  <View style={{ marginTop: 12, padding: 12, backgroundColor: "#fff", borderRadius: 8, gap: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } }}>

    {/* Favorites Row */}
    <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
      <TouchableOpacity
        onPress={handleShowFavorites}
        disabled={!!activeCategory || !!activeMarket} 
        style={{
          flex: 1,
          borderWidth: 1,
          borderColor: "#d1d1f0",
          borderRadius: 6,
          backgroundColor: (!!activeCategory || !!activeMarket) ? "#f0f0f0" : "#f9f9ff",
          paddingVertical: 8,
          alignItems: "center",
          marginRight: 6
        }}
      >
        <Text style={{ color: (!!activeCategory || !!activeMarket) ? "#aaa" : "#6c63ff", fontWeight: "600", fontSize: 13 }}>
          Favorites
        </Text>
      </TouchableOpacity>

      {(favoriteProducts.length > 0 || favoritesMode) && (
        <TouchableOpacity
          onPress={() => {
            setFavoriteProducts([]);
            setParentFavoriteProducts?.([]);
            setMarketProducts([]);
            setFavoritesMode(false);
          }}
          style={{ padding: 4 }}
        >
          <Ionicons name="close-circle" size={20} color="red" />
        </TouchableOpacity>
      )}
    </View>

    {/* Grid: Category & Market */}
    <View style={{ flexDirection: "row", gap: 8 }}>
      {/* Category */}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => !favoritesMode && setShowCategoryModal(true)}
          disabled={favoritesMode}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#d1d1f0",
            borderRadius: 6,
            backgroundColor: favoritesMode ? "#f0f0f0" : "#f9f9ff",
            paddingVertical: 8,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ color: favoritesMode ? "#aaa" : "#6c63ff", fontWeight: "600", fontSize: 13 }}>
            {activeCategory || "Category"}
          </Text>
        </TouchableOpacity>
        {activeCategory && !favoritesMode && (
          <TouchableOpacity onPress={() => handleCategorySelect(null)} style={{ marginLeft: 6 }}>
            <Ionicons name="close-circle" size={20} color="red" />
          </TouchableOpacity>
        )}
      </View>

      {/* Market */}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => !favoritesMode && setShowMarketModal(true)}
          disabled={favoritesMode}
          style={{
            flex: 1,
            borderWidth: 1,
            borderColor: "#d1d1f0",
            borderRadius: 6,
            backgroundColor: favoritesMode ? "#f0f0f0" : "#f9f9ff",
            paddingVertical: 8,
            paddingHorizontal: 10,
          }}
        >
          <Text style={{ color: favoritesMode ? "#aaa" : "#6c63ff", fontWeight: "600", fontSize: 13 }}>
            {activeMarket?.Name || "Market"}
          </Text>
        </TouchableOpacity>
        {activeMarket && !favoritesMode && (
          <TouchableOpacity onPress={() => { setActiveMarket(null); setAllMarketProducts([]); setMarketProducts([]); }} style={{ marginLeft: 6 }}>
            <Ionicons name="close-circle" size={20} color="red" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  </View>
)}




      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <View style={{ margin: 20, backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
            <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>Select Category</Text>
            <FlatList
              data={categoriesList}
              keyExtractor={(item) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { handleCategorySelect(item.name); setShowCategoryModal(false); }} style={{ paddingVertical: 10 }}>
                  <Text style={{ fontSize: 15, color: "#333" }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Text style={{ color: "red", marginTop: 12, textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Market Modal */}
      <Modal visible={showMarketModal} transparent animationType="slide">
        <View style={{ flex: 1, justifyContent: "center", backgroundColor: "rgba(0,0,0,0.4)" }}>
          <View style={{ margin: 20, backgroundColor: "#fff", borderRadius: 12, padding: 16 }}>
            <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>Select Market</Text>
            <FlatList
              data={markets}
              keyExtractor={(item) => String(item.MarketID)}
              renderItem={({ item }) => (
                <TouchableOpacity onPress={() => { handleMarketSelect(item); setShowMarketModal(false); }} style={{ paddingVertical: 10, flexDirection: "row", alignItems: "center" }}>
                  {item.Photos?.[0] && (
                    <View style={{ width: 28, height: 28, borderRadius: 14, overflow: "hidden", marginRight: 8 }}>
                      <Image source={{ uri: item.Photos[0] }} style={{ width: "100%", height: "100%" }} />
                    </View>
                  )}
                  <Text style={{ fontSize: 15, color: "#333" }}>{item.Name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowMarketModal(false)}>
              <Text style={{ color: "red", marginTop: 12, textAlign: "center" }}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
