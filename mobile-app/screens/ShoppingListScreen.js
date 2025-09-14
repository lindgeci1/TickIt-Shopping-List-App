import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import ShoppingLists from "../ShoppingList/ShoppingLists";
import Footer from "../components/Footer";
import { fetchShoppingLists } from "../ShoppingList/fetchShoppingLists";
import { filterLists } from "../ShoppingList/filterLists"; // <- import the filter function

export default function ShoppingListScreen({ navigation }) {
  const [lists, setLists] = useState([]);
  const [allLists, setAllLists] = useState([]); // keep original lists for filtering
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [search, setSearch] = useState("");

const loadLists = async () => {
  setLoading(true);
  setErrorMessage("");

  let fetchedLists = [];
  await fetchShoppingLists((data) => {
    fetchedLists = data;      // ✅ capture the data
    setLists(data);           // update UI list
  }, setErrorMessage);

  setAllLists(fetchedLists);  // ✅ always up-to-date copy for filtering
  setLoading(false);
};

  const showToast = (message) => {
    setToastMessage(message);
    setTimeout(() => setToastMessage(""), 4000);
  };

  useEffect(() => {
    loadLists();
  }, []);

const handleSearchChange = (text) => {
  setSearch(text);
  filterLists(allLists, setLists, text);
};

  if (loading)
    return <ActivityIndicator size="large" color="#6c63ff" style={{ flex: 1 }} />;

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Shopping Lists</Text>

<TextInput
  style={styles.searchBar}
  placeholder="🔍 Search lists by name..."
  value={search}
  onChangeText={handleSearchChange}
/>



      {errorMessage.length > 0 && (
        <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
      )}

      {toastMessage !== "" && (
        <View style={styles.toast}>
          <Text style={styles.toastMain}>{toastMessage}</Text>
          <Text style={styles.toastHelp}>This will disappear in 4 seconds</Text>
        </View>
      )}

      <FlatList
        data={lists}
        keyExtractor={(item) => item.Shopping_List_ItemID.toString()}
        renderItem={({ item, index }) => (
          <ShoppingLists
            item={item}
            index={index}
            navigation={navigation}
            onDelete={(deletedId) => {
              setLists((prev) =>
                prev.filter((list) => list.Shopping_List_ItemID !== deletedId)
              );
              showToast(`Deleted list "${item.Name}"`);
            }}
          />
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
  searchBar: {
    backgroundColor: "#fff",
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 12,
    marginBottom: 15,
    fontSize: 16,
    fontWeight: "500",
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  toast: {
    alignSelf: "center",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#6c63ff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.2,
    shadowOffset: { width: 0, height: 3 },
    shadowRadius: 6,
    elevation: 5,
  },
  toastMain: { color: "#fff", fontWeight: "700", fontSize: 16, textAlign: "center" },
  toastHelp: { color: "#e0e0ff", fontStyle: "italic", fontSize: 12, textAlign: "center", marginTop: 2 },
});
