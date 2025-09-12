import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet } from "react-native";
import Footer from "../components/Footer";
import ProductCard from "../Product/ProductCard";
import { fetchMarkets } from "../Market/fetchMarkets";
import { handleMarketPress } from "../Market/handleMarketPress";
import { renderMarketChip } from "../Market/renderMarketChip";

export default function MarketScreen({ navigation }) {
  const [markets, setMarkets] = useState([]);
  const [activeMarket, setActiveMarket] = useState(null);
  const [marketProducts, setMarketProducts] = useState([]);

  useEffect(() => {
    fetchMarkets(setMarkets);
  }, []);

  const renderProduct = (item) => (
    <ProductCard
      product={item}
      showPrice={true} // <--- show price in MarketScreen
    />
  );

  return (
    <View style={styles.container}>
      <Text style={styles.headerTitle}>Browse Markets</Text>

      <FlatList
        horizontal
        data={markets}
        keyExtractor={(item) => item.MarketID.toString()}
        renderItem={({ item }) =>
          renderMarketChip(item, activeMarket, (market) =>
            handleMarketPress(
              market,
              activeMarket,
              setActiveMarket,
              setMarketProducts
            )
          )
        }
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{ paddingHorizontal: 10, paddingVertical: 10 }}
      />

      {activeMarket && (
        <>
          <Text style={styles.sectionLabel}>{activeMarket.Name} Products</Text>
          <FlatList
            data={marketProducts}
            keyExtractor={(item) => item.ProductID.toString()}
            renderItem={({ item }) => renderProduct(item)}
            contentContainerStyle={{ paddingVertical: 10 }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => (
              <Text
                style={{ textAlign: "center", marginTop: 20, color: "#666" }}
              >
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
  headerTitle: {
    fontSize: 22,
    fontWeight: "700",
    marginBottom: 12,
    color: "#2d3436",
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginVertical: 8,
    color: "#444",
  },
});
