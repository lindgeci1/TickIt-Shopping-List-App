import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator } from "react-native";
import ShoppingListItemCard from "../ShoppingList/ShoppingListItemCard";
import Footer from "../components/Footer";
import { fetchLists } from "../ShoppingList/fetchLists"; // <-- renamed import

export default function ShoppingListScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [loading, setLoading] = useState(true);

  const loadLists = async () => {
    setLoading(true);
    const data = await fetchLists();
    setLists(data);
    setLoading(false);
  };

  useEffect(() => {
    loadLists();
  }, []);

  if (loading)
    return <ActivityIndicator size="large" color="#6c63ff" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Lists</Text>
      <FlatList
        data={lists}
        keyExtractor={(item) => item.Shopping_List_ItemID.toString()}
        renderItem={({ item }) => (
          <ShoppingListItemCard item={item} navigation={navigation} />
        )}
        contentContainerStyle={{ paddingBottom: 70 }}
      />
      <Footer navigation={navigation} currentRoute="ShoppingList" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9fc" },
  header: { fontSize: 22, fontWeight: "700", marginBottom: 15, color: "#2d3436" },
});
