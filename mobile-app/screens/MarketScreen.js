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

  const renderMarket = ({ item }) => (
    <View style={styles.card}>
      <View style={styles.photoBox}>
        <Image
          source={{ uri: item.PhotoUrl || "https://via.placeholder.com/50" }}
          style={styles.photo}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.name}>{item.Name || "Unnamed Market"}</Text>
        <Text style={styles.location}>{item.Location || "No location"}</Text>
      </View>
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Page Header */}
      <Text style={styles.headerTitle}>Browse Markets</Text>

      {/* Markets List */}
      <FlatList
        data={markets}
        keyExtractor={(item) => item.MarketID.toString()}
        renderItem={renderMarket}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => (
          <Text style={{ textAlign: "center", marginTop: 20, color: "#666" }}>
            No markets found
          </Text>
        )}
      />

      {/* Footer */}
      <Footer navigation={navigation} currentRoute="Market" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9fc" },
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#2d3436",
  },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
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

  infoBox: {
    flex: 1,
    padding: 8,
    borderRadius: 8,
  },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#333" },
  location: { fontSize: 14, color: "#555", marginBottom: 2 },
  id: { fontSize: 12, color: "#888" },
});
