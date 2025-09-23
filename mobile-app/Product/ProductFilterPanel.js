import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  LayoutAnimation,
  Modal,
  FlatList,
  Image
} from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VITE_BASE_API_URL } from "@env";

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
}) {
  const [filterExpanded, setFilterExpanded] = useState(false);
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [showMarketModal, setShowMarketModal] = useState(false);
  const [allMarketProducts, setAllMarketProducts] = useState([]);

  const toggleFilterExpand = () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setFilterExpanded(!filterExpanded);
  };

  const handleMarketSelect = async (market) => {
    setActiveMarket(market);

    if (!market) {
      setAllMarketProducts([]);
      setMarketProducts([]);
      return;
    }

    try {
      const res = await fetch(
        `${VITE_BASE_API_URL}/api/market/${market.MarketID}`
      );
      const json = await res.json();
      const productsFromMarket = (json.Products || []).map((p) => ({
        ProductID: p.ProductID,
        Name: p.Name,
        Category: p.Category,
        Photos: p.Photos || [],
      }));
      setAllMarketProducts(productsFromMarket);

      // Apply category filter immediately if active
      if (activeCategory) {
        setMarketProducts(
          productsFromMarket.filter((p) => p.Category === activeCategory)
        );
      } else {
        setMarketProducts(productsFromMarket);
      }
    } catch (err) {
      console.error(err);
      setAllMarketProducts([]);
      setMarketProducts([]);
    }
  };

  const handleCategorySelect = (category) => {
    onCategoryPress(category);

    if (!category) {
      // No filter, show all from current market
      setMarketProducts(allMarketProducts);
    } else {
      setMarketProducts(
        allMarketProducts.filter((p) => p.Category === category)
      );
    }
  };

  return (
    <View
      style={{
        marginBottom: 10,
        padding: 12,
        backgroundColor: "#f5f5ff",
        borderRadius: 12,
      }}
    >
      {/* Search Section */}
      <View
        style={{
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
        }}
      >
        <Ionicons
          name="search-outline"
          size={20}
          color="#6c63ff"
          style={{ marginRight: 6 }}
        />
        <TextInput
          style={{ flex: 1, height: 40, fontSize: 15 }}
          placeholder="Search for a product..."
          placeholderTextColor="#777"
          value={search}
          onChangeText={onSearchChange}
        />
      </View>

      {/* Smaller, cleaner Filters button */}
      <TouchableOpacity
        onPress={toggleFilterExpand}
        style={{
          alignSelf: "flex-start",
          flexDirection: "row",
          alignItems: "center",
          backgroundColor: "#6c63ff",
          paddingHorizontal: 14,
          paddingVertical: 6,
          borderRadius: 20,
        }}
      >
        <Ionicons
          name="options-outline"
          size={18}
          color="#fff"
          style={{ marginRight: 6 }}
        />
        <Text style={{ color: "#fff", fontWeight: "600", fontSize: 14 }}>
          Filters
        </Text>
      </TouchableOpacity>

      {/* Compact Filter Dropdowns */}
      {filterExpanded && (
        <View
          style={{
            marginTop: 12,
            flexDirection: "row",
            justifyContent: "space-between",
            gap: 10,
          }}
        >
          {/* Category Dropdown */}
          <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
            <TouchableOpacity
              onPress={() => setShowCategoryModal(true)}
              style={{
                flex: 1,
                borderWidth: 1.5,
                borderColor: "#d1d1f0",
                borderRadius: 12,
                backgroundColor: "#fff",
                padding: 10,
              }}
            >
              <Text style={{ color: "#6c63ff", fontWeight: "600" }}>
                {activeCategory || "Select Category"}
              </Text>
            </TouchableOpacity>
            {activeCategory && (
              <TouchableOpacity
                onPress={() => handleCategorySelect(null)}
                style={{ marginLeft: 6 }}
              >
                <Ionicons name="close-circle" size={22} color="red" />
              </TouchableOpacity>
            )}
          </View>

          {/* Market Dropdown */}
      {/* Market Dropdown */}
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <TouchableOpacity
          onPress={() => setShowMarketModal(true)}
          style={{
            flex: 1,
            borderWidth: 1.5,
            borderColor: "#d1d1f0",
            borderRadius: 12,
            backgroundColor: "#fff",
            padding: 10,
            flexDirection: "row",
            alignItems: "center",
          }}
        >
          {/* Removed the gray circle / logo block completely */}
          <Text style={{ color: "#6c63ff", fontWeight: "600" }}>
            {activeMarket?.Name || "Select Market"}
          </Text>
        </TouchableOpacity>
        {activeMarket && (
          <TouchableOpacity
            onPress={() => {
              setActiveMarket(null);
              setAllMarketProducts([]);
              setMarketProducts([]);
            }}
            style={{ marginLeft: 6 }}
          >
            <Ionicons name="close-circle" size={22} color="red" />
          </TouchableOpacity>
        )}
      </View>

        </View>
      )}

      {/* Category Modal */}
      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
              Select Category
            </Text>
            <FlatList
              data={categoriesList} // 🔥 removed "Clear Selection"
              keyExtractor={(item, idx) => item.name}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    handleCategorySelect(item.name);
                    setShowCategoryModal(false);
                  }}
                  style={{ paddingVertical: 10 }}
                >
                  <Text style={{ fontSize: 15, color: "#333" }}>{item.name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowCategoryModal(false)}>
              <Text
                style={{
                  color: "red",
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* Market Modal */}
      <Modal visible={showMarketModal} transparent animationType="slide">
        <View
          style={{
            flex: 1,
            justifyContent: "center",
            backgroundColor: "rgba(0,0,0,0.4)",
          }}
        >
          <View
            style={{
              margin: 20,
              backgroundColor: "#fff",
              borderRadius: 12,
              padding: 16,
            }}
          >
            <Text style={{ fontWeight: "700", fontSize: 16, marginBottom: 12 }}>
              Select Market
            </Text>
            <FlatList
              data={markets} // 🔥 removed "Clear Selection"
              keyExtractor={(item, idx) => String(item.MarketID)}
              renderItem={({ item }) => (
                <TouchableOpacity
                  onPress={() => {
                    handleMarketSelect(item);
                    setShowMarketModal(false);
                  }}
                  style={{
                    paddingVertical: 10,
                    flexDirection: "row",
                    alignItems: "center",
                  }}
                >
                  {item.Photos?.[0] && (
                    <View
                      style={{
                        width: 28,
                        height: 28,
                        borderRadius: 14,
                        overflow: "hidden",
                        marginRight: 8,
                      }}
                    >
                      <Image
                        source={{ uri: item.Photos[0] }}
                        style={{ width: "100%", height: "100%" }}
                      />
                    </View>
                  )}
                  <Text style={{ fontSize: 15, color: "#333" }}>{item.Name}</Text>
                </TouchableOpacity>
              )}
            />
            <TouchableOpacity onPress={() => setShowMarketModal(false)}>
              <Text
                style={{
                  color: "red",
                  marginTop: 12,
                  textAlign: "center",
                }}
              >
                Cancel
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

    </View>
  );
}
