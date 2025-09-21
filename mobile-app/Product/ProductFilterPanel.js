import React, { useState } from "react";
import { View, Text, TextInput, FlatList, TouchableOpacity, Image, LayoutAnimation } from "react-native";
import { VITE_BASE_API_URL } from "@env";
import { Ionicons } from "@expo/vector-icons"; // add this at top
export default function ProductFilterPanel({
  categoriesList,
  search,
  onSearchChange,
  activeCategory,
  onCategoryPress,
  markets,
  activeMarket,
  setActiveMarket,      // <-- we need this to update in parent
  setMarketProducts,    // <-- we also pass this from parent
}) {
  const [filterExpanded, setFilterExpanded] = useState(false);

  const toggleFilterExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilterExpanded(!filterExpanded);
  };

  const handleMarketSelect = async (market) => {
    const newMarket = activeMarket?.MarketID === market.MarketID ? null : market;
    setActiveMarket(newMarket);

    if (!newMarket) {
      setMarketProducts([]);
      return;
    }

    try {
      const res = await fetch(`${VITE_BASE_API_URL}/api/market/${market.MarketID}`);
      const json = await res.json();
      const productsFromMarket = (json.Products || []).map((p) => ({
        ProductID: p.ProductID,
        Name: p.Name,
        Category: p.Category,
        Photos: p.Photos || [],
      }));
      setMarketProducts(productsFromMarket);
    } catch (err) {
      console.error(err);
      setMarketProducts([]);
    }
  };

  return (
<View style={{ marginBottom: 10, padding: 12, backgroundColor: "#f5f5ff", borderRadius: 12 }}>
  {/* Search Section: always visible */}
<View style={{
  flexDirection: "row",
  alignItems: "center",
  borderWidth: 1.5,
  borderColor: "#d1d1f0",
  borderRadius: 12,
  backgroundColor: "#fff",
  paddingHorizontal: 10,
  marginBottom: 12,
  shadowColor: "#000",
  shadowOpacity: 0.05,
  shadowRadius: 4,
  shadowOffset: { width: 0, height: 2 },
}}>
  <Ionicons name="search-outline" size={20} color="#6c63ff" style={{ marginRight: 6 }} />
  <TextInput
    style={{ flex: 1, height: 40, fontSize: 15 }}
    placeholder="Search for a product..."
    placeholderTextColor="#777"
    value={search}
    onChangeText={onSearchChange}
  />
</View>

  {/* Collapsible Filter Header */}
  <TouchableOpacity
    onPress={toggleFilterExpand}
    style={{
      backgroundColor: filterExpanded ? "#6c63ff33" : "#6c63ff77", // darker/more noticeable when collapsed
      padding: 10,
      borderRadius: 10
    }}
  >
    <Text style={{ color: "#fff", fontWeight: "700", fontSize: 16 }}>
      Filters 
    </Text>
  </TouchableOpacity>

  {/* Filter Content: categories + markets */}
{/* Filter Content: categories + markets */}
{filterExpanded && (
  <View style={{ marginTop: 12 }}>
    {/* Categories Section */}
    <Text style={{ color: "#555", fontWeight: "600", marginBottom: 6 }}>Filter by Category</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {categoriesList.map((item) => {
        const isActive = item.name === activeCategory;
        return (
          <TouchableOpacity
            key={item.name}
            onPress={() => onCategoryPress(item.name)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 16,         // pill-like
              marginRight: 8,
              marginBottom: 8,
              borderWidth: 1.5,
              borderColor: isActive ? "#6c63ff" : "#d1d1f0",
              backgroundColor: isActive ? "#6c63ff22" : "#fff",
              justifyContent: "center",
              alignItems: "center"
            }}
          >
            <Text style={{ color: isActive ? "#6c63ff" : "#555", fontWeight: "600" }}>
              {item.name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>

    <View style={{ height: 1, backgroundColor: "#e0e0e0", marginVertical: 10 }} />

    {/* Markets Section (now pill-like buttons too) */}
    <Text style={{ color: "#555", fontWeight: "600", marginBottom: 6 }}>Filter by Market</Text>
    <View style={{ flexDirection: "row", flexWrap: "wrap" }}>
      {markets.map((item) => {
        const isActive = activeMarket?.MarketID === item.MarketID;
        return (
          <TouchableOpacity
            key={item.MarketID}
            onPress={() => handleMarketSelect(item)}
            style={{
              paddingHorizontal: 12,
              paddingVertical: 8,
              borderRadius: 16,          // same as categories
              marginRight: 8,
              marginBottom: 8,
              borderWidth: 1.5,
              borderColor: isActive ? "#6c63ff" : "#d1d1f0",
              backgroundColor: isActive ? "#6c63ff22" : "#fff",
              flexDirection: "row",
              alignItems: "center"
            }}
          >
            {item.Photos[0] && (
              <Image
                source={{ uri: item.Photos[0] }}
                style={{ width: 24, height: 24, borderRadius: 12, marginRight: 6 }}
              />
            )}
            <Text style={{ color: isActive ? "#6c63ff" : "#555", fontWeight: "600" }}>
              {item.Name}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
)}

</View>


  );
}
