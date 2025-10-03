import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Footer from "../components/Footer";
import ProductCardBM from "../Product/ProductCardBM";
import { fetchMarkets } from "../Market/fetchMarkets";
import { handleMarketPress } from "../Market/handleMarketPress";
import { renderMarketChip } from "../Market/renderMarketChip";

export default function MarketScreen({ navigation, topPadding }) {
  const [markets, setMarkets] = useState([]);
  const [activeMarket, setActiveMarket] = useState(null);
  const [marketProducts, setMarketProducts] = useState([]);

  useEffect(() => {
    fetchMarkets((data) => {
      // console.log("Fetched markets:", data);
      setMarkets(data);
    });
  }, []);

const handleMarketSelection = (market) => {
  handleMarketPress(
    market,
    activeMarket,
    setActiveMarket,
    (products) => {
      // products currently is market.Products.map(p => p.Product) ?
      // We need to wrap each product with its price
      const productsWithMarket = market.Products.map(p => ({
  Product: p.Product,
  Price: p.Price,
  Market: market,
}));

setMarketProducts(productsWithMarket);
    }
  );
};


  const renderProduct = (item) => <ProductCardBM productWrapper={item} />;

  return (
    <View style={[styles.container, { paddingTop: topPadding + 15 }]}>
      <Text style={[styles.headerTitle, { marginBottom: 20 }]}>
        Browse Markets
      </Text>

      {!activeMarket && markets.length > 0 && (
        <Text style={styles.helperText}>
          Tap a market to view products with their prices
        </Text>
      )}

      <View style={styles.separator} />

      <FlatList
        horizontal
        data={markets}
        keyExtractor={(item, index) => item?.MarketID?.toString() || index.toString()}
        renderItem={({ item }) =>
          renderMarketChip(item, activeMarket, handleMarketSelection)
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
      />

      {activeMarket && (
        <>
          <Text style={[styles.sectionLabel, { color: "#6c63ff" }]}>
            {activeMarket.Name} Products
          </Text>

          <FlatList
            data={marketProducts} // each item: { Product: {...}, Price: number }
            keyExtractor={(item, index) =>
              item?.Product?.ProductID?.toString() || index.toString()
            }
            renderItem={({ item }) => renderProduct(item)}
            contentContainerStyle={{ paddingVertical: 10, paddingBottom: 120 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text style={styles.emptyText}>No products found</Text>
            )}
          />
        </>
      )}

      {/* <Footer navigation={navigation} currentRoute="Market" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9fc" },
  headerTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginBottom: 15,
    color: "#6c63ff",
  },
  helperText: {
    textAlign: "center",
    fontStyle: "italic",
    color: "#6c63ff",
    fontSize: 14,
    marginBottom: 10,
  },
  separator: {
    height: 1,
    backgroundColor: "#ddd",
    marginBottom: 10,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#444",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 40,
    color: "#6c63ff",
    fontSize: 16,
    fontWeight: "500",
    fontStyle: "italic",
  },
});
