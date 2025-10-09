import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity } from "react-native";
import ProductCardBM from "../Product/ProductCardBM";
import { fetchMarkets } from "../Market/fetchMarkets";
import { handleMarketPress } from "../Market/handleMarketPress";
import { renderMarketChip } from "../Market/renderMarketChip";

export default function MarketScreen({ navigation, topPadding }) {
  const [markets, setMarkets] = useState([]);
  const [activeMarket, setActiveMarket] = useState(null);
  const [marketProducts, setMarketProducts] = useState([]);
  const [showAllMarkets, setShowAllMarkets] = useState(false); // collapsed/expanded toggle

  useEffect(() => {
    fetchMarkets((data) => setMarkets(data));
  }, []);

  const handleMarketSelection = (market) => {
    handleMarketPress(
      market,
      activeMarket,
      setActiveMarket,
      (products) => {
        const productsWithMarket = market.Products.map((p) => ({
          Product: p.Product,
          Price: p.Price,
          Market: market,
        }));
        setMarketProducts(productsWithMarket);
      }
    );
  };

  // Determine markets to show (collapse if needed)
  const marketsToShow = showAllMarkets ? markets : markets.slice(0, 1);

  return (
    <View style={[styles.container, { paddingTop: topPadding + 15 }]}>
      <Text style={[styles.headerTitle, { marginBottom: 20 }]}>Browse Markets</Text>

      {!activeMarket && markets.length > 0 && (
        <Text style={styles.helperText}>Tap a market to view products with their prices</Text>
      )}

      <View style={styles.separator} />

      <FlatList
        horizontal
        data={marketsToShow}
        keyExtractor={(item, index) => item?.MarketID?.toString() || index.toString()}
        renderItem={({ item }) => renderMarketChip(item, activeMarket, handleMarketSelection)}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
        ListFooterComponent={() => {
          // Show +X chip if collapsed
          if (!showAllMarkets && markets.length > 2) {
            return (
              <TouchableOpacity
                style={[styles.marketChip, { backgroundColor: "#eee" }]}
                onPress={() => setShowAllMarkets(true)}
              >
                <Text style={{ color: "#6c63ff", fontWeight: "700" }}>+{markets.length - 2}</Text>
              </TouchableOpacity>
            );
          }
          return null;
        }}
      />

      {activeMarket && (
        <>
          <Text style={[styles.sectionLabel, { color: "#6c63ff" }]}>{activeMarket.Name} Products</Text>

          <FlatList
            data={marketProducts} // each item: { Product: {...}, Price: number }
            keyExtractor={(item, index) =>
              item?.Product?.ProductID?.toString() || index.toString()
            }
            renderItem={({ item }) => <ProductCardBM productWrapper={item} />}
            contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No products found</Text>
            )}
          />
        </>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9fc" },
  headerTitle: { fontSize: 24, fontWeight: "700", marginBottom: 15, color: "#6c63ff" },
  helperText: { textAlign: "center", fontStyle: "italic", color: "#6c63ff", fontSize: 14, marginBottom: 10 },
  separator: { height: 1, backgroundColor: "#ddd", marginBottom: 10 },
  sectionLabel: { fontSize: 16, fontWeight: "600", marginVertical: 8, color: "#444" },
  emptyText: { textAlign: "center", marginTop: 40, color: "#6c63ff", fontSize: 16, fontWeight: "500", fontStyle: "italic" },
  marketChip: {
    width: 60,
    height: 60,
    borderRadius: 12,
    marginRight: 8,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#6c63ff20",
  },
});
