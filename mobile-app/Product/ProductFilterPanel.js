import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity, Modal, FlatList, Image, StyleSheet, Dimensions } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { VITE_BASE_API_URL } from "@env";
import { fetchFavoriteProducts } from "../Product/fetchFavoriteProducts";

const screenHeight = Dimensions.get("window").height;

export default function ProductFilterPanel({
  categoriesList, search, setSearch: setParentSearch, activeCategory, onCategoryPress,
  markets, activeMarket, setActiveMarket, setMarketProducts,
  setFavoriteProducts: setParentFavoriteProducts, favoritesMode, setProducts,
  setFavoritesMode, allProducts
}) {
  const [showFilterModal, setShowFilterModal] = useState(false);
  const [allMarketProducts, setAllMarketProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [tempCategory, setTempCategory] = useState(activeCategory);
  const [tempMarket, setTempMarket] = useState(activeMarket);
  const [tempFavoritesMode, setTempFavoritesMode] = useState(favoritesMode);
  useEffect(() => {
    setTempCategory(activeCategory);
    setTempMarket(activeMarket);
    setTempFavoritesMode(favoritesMode);
  }, [showFilterModal]);

  const applyFilters = (products, category, searchTerm) =>
    products.filter(p => (!category || p.Category === category) &&
                        (!searchTerm || p.Name.toLowerCase().includes(searchTerm.toLowerCase())));

  const handleMarketSelect = async market => {
    setTempMarket(market);
    setTempCategory(null); // Disable category when market is selected
    if (!market) { setAllMarketProducts([]); return; }
    try {
      const res = await fetch(`${VITE_BASE_API_URL}/api/market/${market.MarketID}`);
      const json = await res.json();
      const productsFromMarket = (json.Products || []).map(p => ({ ProductID: p.ProductID, Name: p.Name, Category: p.Category, Photos: p.Photos || [] }));
      setAllMarketProducts(productsFromMarket);
      setMarketProducts(applyFilters(productsFromMarket, null, search));
    } catch (err) { console.error(err); setAllMarketProducts([]); setMarketProducts([]); }
  };

  const handleCategorySelect = category => {
    setTempCategory(category);
    setTempMarket(null); // Disable market when category is selected
  };

  const handleSearchChange = text => {
    setParentSearch(text);
    if (tempFavoritesMode) {
      const filtered = favoriteProducts.filter(p => p.Name.toLowerCase().includes(text.toLowerCase()));
      setParentFavoriteProducts?.(filtered);
    } else {
      tempMarket ? setMarketProducts(applyFilters(allMarketProducts, null, text))
                 : setProducts(applyFilters(allProducts, tempCategory, text));
    }
  };

  const handleShowFavorites = async () => {
    try {
      const data = await fetchFavoriteProducts();
      setFavoriteProducts(data);
      setParentFavoriteProducts?.(data);
      setTempCategory(null);
      setTempMarket(null);
      setTempFavoritesMode(true);
    } catch (err) { console.error(err); }
  };

  const handleApply = () => {
    setFavoritesMode(tempFavoritesMode);
    onCategoryPress(tempCategory);
    setActiveMarket(tempMarket);
    if (tempFavoritesMode) setParentFavoriteProducts?.(favoriteProducts);
    else tempMarket ? setMarketProducts(applyFilters(allMarketProducts, null, search))
                    : setProducts(applyFilters(allProducts, tempCategory, search));
    setShowFilterModal(false);
  };

  const handleCancel = () => {
    setTempCategory(activeCategory);
    setTempMarket(activeMarket);
    setTempFavoritesMode(favoritesMode);
    setShowFilterModal(false);
  };

  return (
    <View style={{ marginBottom: 10, padding: 12, backgroundColor: "#f5f5ff", borderRadius: 12 }}>
      {/* Search */}
      <View style={styles.searchContainer}>
        <Ionicons name="search-outline" size={20} color="#6c63ff" style={{ marginRight: 6 }} />
        <TextInput style={styles.searchInput} placeholder="Search for a product..." placeholderTextColor="#777" value={search} onChangeText={handleSearchChange} />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => handleSearchChange("")} style={{ marginLeft: 6 }}>
            <Ionicons name="close-circle" size={18} color="#6c63ff" />
          </TouchableOpacity>
        )}
      </View>

      {/* Filter Button */}
     <TouchableOpacity onPress={() => setShowFilterModal(true)} style={{ flexDirection: "row", alignItems: "center", backgroundColor: "#6c63ff", paddingVertical: 4, paddingHorizontal: 8, borderRadius: 6, shadowColor: "#000", shadowOpacity: 0.05, shadowOffset: { width: 0, height: 1 }, shadowRadius: 2, elevation: 1, alignSelf: "flex-start" }}>
      <Ionicons name="options-outline" size={16} color="#fff" style={{ marginRight: 4 }} />
      <Text style={{ color: "#fff", fontWeight: "600", fontSize: 13 }}>Filters</Text>
      {(activeCategory || activeMarket || favoritesMode) && (
          <View style={{ backgroundColor: "#fff", borderRadius: 12, paddingHorizontal: 6, paddingVertical: 1, marginLeft: 6 }}>
            <Text style={{ color: "#6c63ff", fontSize: 11, fontWeight: "700" }}>● Active</Text>
          </View>
        )}

    </TouchableOpacity>


      {/* Bottom Sheet Modal */}
      <Modal visible={showFilterModal} transparent animationType="slide">
        <View style={styles.modalBackground}>
          <SafeAreaView style={styles.bottomSheet}>
            <View style={{ flexShrink: 1 }}>
              <Text style={styles.modalTitle}>Filters</Text>

      {/* Favorites Section */}
      <View style={styles.filterSection}>
        <Text style={styles.sectionTitle}>Favorites</Text>
        <Text style={styles.sectionHint}>Show only the products you marked as favorites.</Text>

        <View style={{ flexDirection: "row", alignItems: "center", marginTop: 4 }}>
          {console.log("Favorites button color:", tempFavoritesMode ? "#6c63ff" : "#f0f0f0")}
          <TouchableOpacity
            onPress={async () => {
              if (tempFavoritesMode) {
                setTempFavoritesMode(false);
                setFavoriteProducts([]);
              } else {
                await handleShowFavorites();
              }
            }}
            style={{
              paddingVertical: 6,
              paddingHorizontal: 12,
              borderRadius: 20,
              backgroundColor: tempFavoritesMode ? "#6c63ff" : "#f0f0f0",
              opacity: !!tempCategory || !!tempMarket ? 0.5 : 1,
            }}
            disabled={!!tempCategory || !!tempMarket} // <-- add this
          >
            <Text style={{
              color: tempFavoritesMode ? "#fff" : "#333",
              fontWeight: tempFavoritesMode ? "600" : "400",
              fontSize: 12
            }}>
              Show Favorites
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Category Section */}
      <View style={[styles.filterSection, tempMarket ? { opacity: 0.5 } : {}]} pointerEvents={tempMarket ? "none" : "auto"}>
        <Text style={styles.sectionTitle}>Category</Text>
        <Text style={styles.sectionHint}>Select a category to filter products.</Text>

        <FlatList
          data={categoriesList}
          keyExtractor={item => item.name}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ paddingVertical: 4, gap: 8 }}
          renderItem={({ item }) => (
            <TouchableOpacity
              onPress={() => {
                if (tempCategory === item.name) {
                  setTempCategory(null); // second click clears
                } else {
                  handleCategorySelect(item.name);
                }
              }}
              style={{
                paddingVertical: 6,
                paddingHorizontal: 12,
                borderRadius: 20,
                backgroundColor: tempCategory === item.name ? "#6c63ff" : "#f0f0f0",
                opacity: (!!tempCategory && tempCategory !== item.name) || !!tempFavoritesMode || !!tempMarket ? 0.5 : 1,
              }}
              disabled={!!tempCategory && tempCategory !== item.name || !!tempFavoritesMode || !!tempMarket} // <-- add
            >
              <Text style={{
                color: tempCategory === item.name ? "#fff" : "#333",
                fontWeight: tempCategory === item.name ? "600" : "400",
                fontSize: 12
              }}>
                {item.name}
              </Text>
            </TouchableOpacity>
          )}
        />
      </View>

          {/* Market Section */}
          <View style={styles.filterSection}>
            <Text style={styles.sectionTitle}>Market</Text>
            <Text style={styles.sectionHint}>Select a market to filter products.</Text>

            <FlatList
              data={markets}
              keyExtractor={item => String(item.MarketID)}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={{ paddingVertical: 4, gap: 8 }}
              renderItem={({ item }) => {
                const isDisabled = !!tempCategory || !!tempFavoritesMode; // disable only button
                const isSelected = tempMarket?.MarketID === item.MarketID;

                return (
                  <TouchableOpacity
                    onPress={async () => {
                      if (isDisabled) return; // ignore clicks if disabled
                      if (isSelected) {
                        setTempMarket(null);
                        setAllMarketProducts([]);
                        setMarketProducts([]);
                      } else {
                        await handleMarketSelect(item);
                      }
                    }}
                    style={{
                      flexDirection: "row",
                      alignItems: "center",
                      paddingVertical: 6,
                      paddingHorizontal: 12,
                      borderRadius: 20,
                      backgroundColor: isSelected ? "#6c63ff" : "#f0f0f0",
                      opacity: isDisabled && !isSelected ? 0.5 : 1, // dim only if disabled but not selected
                    }}
                  >
                    {item.Photos?.[0] && (
                      <View style={{ width: 24, height: 24, borderRadius: 12, overflow: "hidden", marginRight: 6 }}>
                        <Image source={{ uri: item.Photos[0] }} style={{ width: "100%", height: "100%" }} />
                      </View>
                    )}
                    <Text style={{
                      color: isSelected ? "#fff" : "#333",
                      fontWeight: isSelected ? "600" : "400",
                      fontSize: 12
                    }}>
                      {item.Name}
                    </Text>
                  </TouchableOpacity>
                );
              }}
            />
          </View>


            </View>

            {/* Buttons */}
            <View style={{ flexDirection: "row", justifyContent: "space-between", marginTop: 24, marginBottom: 12 }}>
              <TouchableOpacity onPress={handleCancel} style={styles.cancelButton}>
                <Text style={{ color: "#6c63ff", fontWeight: "600" }}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity onPress={handleApply} style={styles.applyButton}>
                <Text style={{ color: "#fff", fontWeight: "600" }}>Apply</Text>
              </TouchableOpacity>
            </View>
          </SafeAreaView>
        </View>
      </Modal>

    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: { flexDirection: "row", alignItems: "center", borderWidth: 1.5, borderColor: "#d1d1f0", borderRadius: 12, backgroundColor: "#fff", paddingHorizontal: 10, marginBottom: 12, shadowColor: "#000", shadowOpacity: 0.05, shadowRadius: 4, shadowOffset: { width: 0, height: 2 } },
  searchInput: { flex: 1, height: 40, fontSize: 15 },
  filterButton: { flexDirection: "row", alignItems: "center", backgroundColor: "#6c63ff", paddingHorizontal: 12, paddingVertical: 6, borderRadius: 12, alignSelf: "flex-start" },
  modalBackground: { flex: 1, justifyContent: "flex-end", backgroundColor: "rgba(0,0,0,0.4)" },
  bottomSheet: { maxHeight: screenHeight * 0.85, backgroundColor: "#fff", borderTopLeftRadius: 16, borderTopRightRadius: 16, padding: 16 },
  modalTitle: { fontWeight: "700", fontSize: 18, marginBottom: 12, textAlign: "center" },
  filterSection: { borderWidth: 1, borderColor: "#e0e0e0", borderRadius: 12, padding: 12, marginVertical: 8, backgroundColor: "#fff"},
  sectionTitle: { fontWeight: "600", fontSize: 16, marginBottom: 6 },
  optionRow: { flexDirection: "row", alignItems: "center", justifyContent: "space-between", paddingVertical: 10 },
  optionText: { fontSize: 15 },
  cancelButton: { flex: 1, borderWidth: 1, borderColor: "#6c63ff", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginRight: 8 },
  applyButton: { flex: 1, backgroundColor: "#6c63ff", borderRadius: 10, paddingVertical: 10, alignItems: "center", marginLeft: 8 },
  sectionHint: { fontStyle: "italic", fontSize: 13, color: "#555", marginBottom: 8 },
});