import React, { useState, useEffect, useMemo } from "react";
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
import { assignProductToShoppingListItem } from "./assignProductToShoppingListItem";
import { useMarketPhotoPrice } from "./useMarketPhotoPrice";
import { removeProductFromShoppingList } from "./removeProductFromShoppingList";

export default function ProductCardSL({
  product,
  shoppingListItemId,
  selectionMode = false,
  selected = false,
  onSelect,
  showPrice = true,
  onPriceChange
}) {
  const [modalVisible, setModalVisible] = useState(false);
  const [loadingMarkets, setLoadingMarkets] = useState(false);
  const [marketList, setMarketList] = useState([]);
  const [marketMessage, setMarketMessage] = useState("");
  const [apiError, setApiError] = useState("");
  const [linkedMarket, setLinkedMarket] = useState(null);
  const [loadingLinkedMarket, setLoadingLinkedMarket] = useState(true);
  const productArray = useMemo(() => [product], [product.ProductID]);
useEffect(() => {
  if (linkedMarket?.price) {
    onPriceChange?.(linkedMarket.price);
  }
}, [linkedMarket?.price]);
useEffect(() => {
  const fetchLinkedMarket = async () => {
    setLoadingLinkedMarket(true);
    try {
      const data = await useMarketPhotoPrice(product.ProductID, shoppingListItemId);
      setLinkedMarket(data); // could be null if no linked market
    } catch (err) {
      console.error("Failed to fetch linked market:", err);
      setLinkedMarket(null);
    } finally {
      setLoadingLinkedMarket(false);
    }
  };
  fetchLinkedMarket();
}, [product.ProductID, shoppingListItemId]);

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
      await assignProductToShoppingListItem(payload);
      setApiError("");
      setModalVisible(false);
      const data = await useMarketPhotoPrice(product.ProductID, shoppingListItemId);
      setLinkedMarket(data);
    } catch (err) {
      setApiError(
        err.message.includes("already assigned")
          ? "This product is already assigned to this market."
          : "Failed to assign product to market."
      );
      setTimeout(() => setApiError(""), 3000);
    }
  };

return (
  <View style={styles.card}>
    {selectionMode && (
      <TouchableOpacity style={[styles.checkbox, selected && styles.checked]} onPress={onSelect}>
        {selected && <Text style={styles.checkMark}>✓</Text>}
      </TouchableOpacity>
    )}

    {/* Product photo */}
    <View style={styles.photoBox}>
      <Image source={{ uri: product.Photos?.[0] || "https://via.placeholder.com/50" }} style={styles.photo} resizeMode="cover" />
    </View>

    {/* Product info */}
    <View style={styles.infoBox}>
      <Text style={styles.name}>{product.Name || "Unnamed Product"}</Text>
      <Text style={styles.category}>{product.Category || "No category"}</Text>
    </View>

    {/* Vertical line if market exists */}
    {linkedMarket && <View style={styles.verticalLine} />}

    {/* Linked market */}
    <View style={styles.rightSection}>
      {linkedMarket ? (
        <View style={{ position: "relative", marginLeft: 4 }}>
          {/* Market info box */}
          <View style={[styles.marketBox, product.Status === "Bought" && { opacity: 0.6 }]}>
            <Image source={{ uri: linkedMarket.photoURL }} style={styles.marketLogo} resizeMode="cover" />
            <Text style={styles.marketPrice}>€{linkedMarket.price.toFixed(2)}</Text>
          </View>

          {/* X button */}
          {product.Status !== "Bought" && (
            <TouchableOpacity
              style={styles.removeButton}
              onPress={async () => {
                try {
                  await removeProductFromShoppingList(product.ProductID, shoppingListItemId);
                  const data = await useMarketPhotoPrice(product.ProductID, shoppingListItemId);
                  setLinkedMarket(data);
                } catch (err) {
                  console.error("Failed to remove linked market:", err);
                }
              }}
            >
              <Text style={styles.removeText}>✕</Text>
            </TouchableOpacity>
          )}
        </View>
      ) : (
        <TouchableOpacity style={styles.tapPriceBox} onPress={product.Status !== "Bought" ? handleTap : undefined}>
          <Text style={styles.tapPriceText}>Tap for Price</Text>
        </TouchableOpacity>
      )}
    </View>

    {/* Modal */}
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
                <TouchableOpacity style={styles.row} onPress={() => handleSelectMarket(item)}>
                  <Image source={{ uri: item.logo }} style={styles.logo} />
                  <Text style={styles.marketName}>{item.name}</Text>
                  <Text style={styles.marketPrice}>€{item.price.toFixed(2)}</Text>
                </TouchableOpacity>
              )}
            />
          ) : (
            <Text style={{ textAlign: "center", marginTop: 10 }}>{marketMessage}</Text>
          )}

          {apiError && <Text style={{ color: "red", textAlign: "center", marginVertical: 8 }}>{apiError}</Text>}

          <TouchableOpacity style={styles.closeButton} onPress={() => setModalVisible(false)}>
            <Text style={styles.closeText}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  </View>
);
}
const styles = StyleSheet.create({
  card: { flexDirection: "row", alignItems: "center", backgroundColor: "#f0f0ff", borderRadius: 12, padding: 12, marginVertical: 6 },
  checkbox: { width: 24, height: 24, borderRadius: 12, borderWidth: 2, borderColor: "#6c63ff", alignItems: "center", justifyContent: "center", marginRight: 10 },
  checked: { backgroundColor: "#6c63ff" },
  checkMark: { color: "#fff", fontWeight: "bold" },
  photoBox: { width: 55, height: 55, borderRadius: 12, backgroundColor: "#6c63ff20", alignItems: "center", justifyContent: "center", marginRight: 12, overflow: "hidden" },
  photo: { width: "100%", height: "100%", borderRadius: 12 },
  infoBox: { flex: 1 },
  name: { fontSize: 15, fontWeight: "bold", color: "#2d3436", marginBottom: 2 },
  category: { fontSize: 12, color: "#888" },
  verticalLine: { width: 1, backgroundColor: "#ccc", marginHorizontal: 1, alignSelf: "stretch" },
  marketBox: { alignItems: "center", justifyContent: "center", marginLeft: 1, paddingVertical: 6, paddingHorizontal: 8, backgroundColor: "#6c63ff10", borderRadius: 8 },
  marketLogo: { width: 33, height: 23, borderRadius: 3, marginBottom: 2, borderWidth: 1, borderColor: "#6c63ff" },
  marketPrice: { fontSize: 12, fontWeight: "600", color: "#444", fontStyle: "italic" },
  tapPriceBox: { paddingHorizontal: 12, paddingVertical: 6, backgroundColor: "#6c63ff20", borderRadius: 12, borderWidth: 1, borderColor: "#6c63ff", alignItems: "center", justifyContent: "center", minWidth: 90 },
  tapPriceText: { fontSize: 12, fontWeight: "600", color: "#6c63ff", textAlign: "center" },
  modalOverlay: { flex: 1, backgroundColor: "rgba(0,0,0,0.5)", justifyContent: "center", alignItems: "center" },
  modal: { width: "90%", backgroundColor: "#fff", borderRadius: 12, padding: 20, maxHeight: "80%" },
  modalTitle: { fontSize: 18, fontWeight: "700", marginBottom: 15 },
  row: { flexDirection: "row", alignItems: "center", marginBottom: 12 },
  logo: { width: 28, height: 18, borderRadius: 3, borderWidth: 1, borderColor: "#6c63ff", marginRight: 8 },
  marketName: { flex: 1, fontSize: 14, color: "#333" },
  closeButton: { marginTop: 10, padding: 10, backgroundColor: "#6c63ff", borderRadius: 8, alignItems: "center" },
  closeText: { color: "#fff", fontWeight: "700" },
  removeButton: { position: "absolute", top: -6, right: -6, backgroundColor: "#ff6b6b", width: 20, height: 20, borderRadius: 10, alignItems: "center", justifyContent: "center", zIndex: 10 },
  removeText: { color: "#fff", fontSize: 12, fontWeight: "bold" },
});