import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { VITE_BASE_API_URL } from "@env";
import Footer from "../components/Footer";

export default function MarketScreen({ navigation }) {
  const [markets, setMarkets] = useState([]);
  const [activeMarket, setActiveMarket] = useState(null);
  const [marketProducts, setMarketProducts] = useState([]);

  useEffect(() => {
    fetchMarkets();
  }, []);

const fetchMarkets = async () => {
  try {
    const response = await fetch(`${VITE_BASE_API_URL}/api/market/all`);
    const json = await response.json();
    setMarkets(json);
  } catch (error) {
    console.log("Fetch error:", error);
    Alert.alert("❌ Error", "Failed to fetch markets: " + error.message);
  }
};


const handleMarketPress = async (market) => {
const newMarket = activeMarket?.MarketID === market.MarketID ? null : market;
setActiveMarket(newMarket);


  if (newMarket) {
    try {
      const response = await fetch(`${VITE_BASE_API_URL}/api/market/${newMarket.MarketID}`);
      const json = await response.json();;

      // Map products to simplified format for ProductScreen
      const products = (json.Products || []).map((p) => ({
        ProductID: p.ProductID,
        Name: p.Name,
        Category: p.Category,
        Photos: p.Photos || [],
      }));
      setMarketProducts(products);
    } catch (error) {
      console.error("Failed to fetch market products:", error);
      Alert.alert("❌ Error", "Failed to load products for market.");
      setMarketProducts([]);
    }
  } else {
    setMarketProducts([]);
  }
};



  const addToShoppingList = async (productId) => {
    try {
      const url = `${VITE_BASE_API_URL}/api/shopping-list/create`;
      const now = new Date().toISOString();

      const response = await fetch(url, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ProductID: productId,
          Status: "ToBuy",
          AddedAt: now,
          BoughtAt: null,
        }),
      });

      if (!response.ok) throw new Error(`Error ${response.status}`);

      const data = await response.json();
      Alert.alert("✅ Success", "Product added to buying list!");
    } catch (error) {
      console.error("Add error:", error);
      Alert.alert("❌ Error", "Failed to add product: " + error.message);
    }
  };

  const renderMarketChip = ({ item }) => {
    const isActive = activeMarket?.MarketID === item.MarketID;
    return (
      <TouchableOpacity
        style={[styles.marketChip, { backgroundColor: "#6c63ff20" }]}
        onPress={() => handleMarketPress(item)}
      >
        <Image
          source={{ uri: item.Photos?.[0] || "https://via.placeholder.com/60" }}
          style={styles.marketImage}
        />
      </TouchableOpacity>
    );
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
      <Text style={styles.headerTitle}>Browse Markets</Text>

      {/* Horizontal market list */}
      <FlatList
        horizontal
        data={markets}
        keyExtractor={(item) => item.MarketID.toString()}
        renderItem={renderMarketChip}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
      />

      {/* Show products of selected market */}
      {activeMarket && (
        <>
          <Text style={styles.sectionLabel}>
            {activeMarket.Name} Products
          </Text>
          <FlatList
            data={marketProducts}
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
        </>
      )}

      <Footer navigation={navigation} currentRoute="Market" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9fc" },
  headerTitle: { fontSize: 22, fontWeight: "700", marginBottom: 12, color: "#2d3436" },

  marketChip: {
    width: 90,
    height: 90,
    borderRadius: 16,
    marginRight: 12,
    justifyContent: "center",
    alignItems: "center",
  },
  marketImage: { width: 60, height: 60, borderRadius: 12 },

  sectionLabel: { fontSize: 16, fontWeight: "600", marginVertical: 8, color: "#444" },

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
  addButton: {
    marginTop: 6,
    backgroundColor: "#6c63ff",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 8,
    alignSelf: "flex-start",
  },
  addButtonText: { color: "#fff", fontSize: 13, fontWeight: "600" },
});
