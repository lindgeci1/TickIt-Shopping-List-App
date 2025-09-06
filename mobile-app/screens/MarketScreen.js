import React, { useState } from "react";
import {
  View,
  Text,
  Button,
  FlatList,
  StyleSheet,
  Alert,
  Image,
  TouchableOpacity,
} from "react-native";
import { VITE_BASE_API_URL } from "@env";

export default function MarketScreen() {
  const [data, setData] = useState([]);

  const fetchMarkets = async () => {
    try {
      const response = await fetch(`${VITE_BASE_API_URL}/api/market/all`);
      const json = await response.json();
      console.log("API response:", json);
      setData(json);
    } catch (error) {
      console.log("Fetch error:", error);
      Alert.alert("Error", "Failed to fetch markets: " + error.message);
    }
  };

  const renderMarket = ({ item }) => (
    <TouchableOpacity style={styles.card} activeOpacity={0.8}>
      <View style={styles.photoBox}>
        <Image
          source={{ uri: item.PhotoUrl || "https://via.placeholder.com/70" }}
          style={styles.photo}
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.name}>{item.Name || "Unnamed Market"}</Text>
        <Text style={styles.location}>{item.Location || "No location"}</Text>
        <Text style={styles.id}>ID: {item.MarketID}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Button
        title="Load Markets"
        onPress={fetchMarkets}
        color="#6c63ff" // Button matches theme
      />
      <FlatList
        data={data}
        keyExtractor={(item) => item.MarketID.toString()}
        renderItem={renderMarket}
        contentContainerStyle={{ paddingVertical: 10 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f0f0f5" },
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.12,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 4,
  },
  photoBox: {
    width: 70,
    height: 70,
    borderRadius: 12,
    backgroundColor: "#6c63ff20", // Slightly transparent theme color
    alignItems: "center",
    justifyContent: "center",
    marginRight: 15,
  },
  photo: { width: "100%", height: "100%", borderRadius: 12 },
  infoBox: {
    flex: 1,
    backgroundColor: "#6c63ff10", // subtle theme tint behind text
    padding: 8,
    borderRadius: 8,
  },
  name: { fontSize: 16, fontWeight: "bold", marginBottom: 4, color: "#333" },
  location: { fontSize: 14, color: "#555", marginBottom: 2 },
  id: { fontSize: 12, color: "#888" },
});
