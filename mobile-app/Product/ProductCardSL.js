import React, { useState, useMemo } from "react";
import {
  View,
  Text,
  Image,
  StyleSheet,
  TouchableOpacity,
  Modal,
  FlatList,
  ActivityIndicator,
} from "react-native";
import { useProductMarkets } from "./useProductMarkets";
import { assignProductToShoppingListItem } from "./assignProductToShoppingListItem"; // import the API function

export default function ProductCardSL({
  product,
  shoppingListItemId, // <-- pass this as prop
  selectionMode = false,
  selected = false,
  onSelect,
  showPrice = true,
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingMarkets, setLoadingMarkets] = useState(false);
  const [marketList, setMarketList] = useState([]);
  const [marketMessage, setMarketMessage] = useState("");
  const [apiError, setApiError] = useState(""); 
  const productArray = useMemo(() => [product], [product.ProductID]);

  const handleTap = async () => {
    setModalVisible(true);
    if (marketList.length > 0) return;

    setLoadingMarkets(true);
    try {
      const data = await useProductMarkets([product]);
      const productId = product.ProductID;
      const list = data[productId] || [];
      setMarketList(list);
    } catch (err) {
      console.error(err);
      setMarketMessage("Failed to fetch markets");
    } finally {
      setLoadingMarkets(false);
    }
  };

const handleSelectMarket = async (market) => {
  const payload = {
    shopping_list_item_id: shoppingListItemId,
    product_id: product.ProductID,
    market_id: market.id,
  };

  try {
    const result = await assignProductToShoppingListItem(payload);
    setApiError("");       // Clear any previous error
    setModalVisible(false); // Close modal on success
    return result;          // Return the backend response
  } catch (err) {
    // Show friendly UI message only
    setApiError(
      err.message.includes("already assigned")
        ? "This product is already assigned to this market."
        : "Failed to assign product to market."
    );

    // Auto-hide after 3 seconds
    setTimeout(() => setApiError(""), 3000);
  }
};






  return (
    <View style={styles.card}>
      {selectionMode && (
        <TouchableOpacity
          style={[styles.checkbox, selected && styles.checked]}
          onPress={onSelect}
        >
          {selected && <Text style={styles.checkMark}>✓</Text>}
        </TouchableOpacity>
      )}

      {/* Left side — product info */}
      <View style={styles.photoBox}>
        <Image
          source={{
            uri: product.Photos?.[0] || "https://via.placeholder.com/50",
          }}
          style={styles.photo}
          resizeMode="cover"
        />
      </View>

      <View style={styles.infoBox}>
        <Text style={styles.name}>{product.Name || "Unnamed Product"}</Text>
        <Text style={styles.category}>{product.Category || "No category"}</Text>
        {showPrice && product.Price != null && (
          <Text style={styles.price}>${product.Price}</Text>
        )}
      </View>

      {/* Vertical divider */}
      <View style={styles.divider} />

      {/* Right side — price or market */}
      <View style={styles.rightSection}>
        <TouchableOpacity style={styles.tapPriceBox} onPress={handleTap}>
          <Text style={styles.tapPriceText}>Tap for Price</Text>
        </TouchableOpacity>
      </View>

      {/* Modal for selecting market */}
      <Modal visible={modalVisible} transparent animationType="slide">
        <View style={styles.modalOverlay}>
          <View style={styles.modal}>
            <Text style={styles.modalTitle}>{product.Name} Prices</Text>

            {loadingMarkets ? (
              <ActivityIndicator size="small" color="#6c63ff" />
            ) : marketList.length > 0 ? (
              <FlatList
                data={marketList}
                keyExtractor={(item, index) => index.toString()}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    style={styles.row}
                    onPress={() => handleSelectMarket(item)}
                  >
                    <Image source={{ uri: item.logo }} style={styles.logo} />
                    <Text style={styles.marketName}>{item.name}</Text>
                    <Text style={styles.marketPrice}>
                      €{item.price.toFixed(2)}
                    </Text>
                  </TouchableOpacity>
                )}
              />
            ) : (
              <Text style={{ textAlign: "center", marginTop: 10 }}>
                {marketMessage}
              </Text>
            )}
{apiError ? (
  <Text style={{ color: "red", textAlign: "center", marginVertical: 8 }}>
    {apiError}
  </Text>
) : null}
            <TouchableOpacity
              style={styles.closeButton}
              onPress={() => setModalVisible(false)}
            >
              <Text style={styles.closeText}>Close</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f0f0ff",
    borderRadius: 12,
    padding: 10,
    marginVertical: 6,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: "#6c63ff",
    alignItems: "center",
    justifyContent: "center",
    marginRight: 10,
  },
  checked: { backgroundColor: "#6c63ff" },
  checkMark: { color: "#fff", fontWeight: "bold" },
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
  infoBox: { flex: 1, justifyContent: "center" },
  name: { fontSize: 15, fontWeight: "bold", color: "#2d3436", marginBottom: 2 },
  category: { fontSize: 12, color: "#888", marginBottom: 2 },
  price: { fontSize: 13, fontWeight: "600", color: "#444" },
  divider: {
    width: 1,
    height: "80%",
    backgroundColor: "#d0d0ff",
    marginHorizontal: 8,
  },
  rightSection: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  tapPriceBox: {
    paddingHorizontal: 10,
    paddingVertical: 6,
    backgroundColor: "#6c63ff20",
    borderRadius: 8,
  },
  tapPriceText: { fontSize: 12, fontWeight: "600", color: "#6c63ff" },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modal: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 20,
    maxHeight: "80%",
  },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  logo: {
    width: 28,
    height: 18,
    borderRadius: 3,
    borderWidth: 1,
    borderColor: "#6c63ff",
    marginRight: 8,
  },
  marketName: { flex: 1, fontSize: 14, color: "#333" },
  marketPrice: { fontSize: 14, fontWeight: "600" },
  closeButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#6c63ff",
    borderRadius: 8,
    alignItems: "center",
  },
  closeText: { color: "#fff", fontWeight: "700" },
});
