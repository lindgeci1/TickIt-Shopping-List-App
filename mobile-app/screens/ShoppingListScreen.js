import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, TextInput } from "react-native";
import ShoppingLists from "../ShoppingList/ShoppingLists";
import Footer from "../components/Footer";
import { fetchShoppingLists } from "../ShoppingList/fetchShoppingLists";
import ShoppingListFilterPanel from "../ShoppingList/ShoppingListFilterPanel";
export default function ShoppingListScreen({ navigation, topPadding }) {
  const [lists, setLists] = useState([]);
  const [allLists, setAllLists] = useState([]); // keep original lists for filtering
  const [loading, setLoading] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const [toastMessage, setToastMessage] = useState("");
  const [search, setSearch] = useState("");
  const [activeQuickDate, setActiveQuickDate] = useState(null);
  const [customDate, setCustomDate] = useState(null);
  const loadLists = async () => {
    setLoading(true);
    setErrorMessage("");

    let fetchedLists = [];
    await fetchShoppingLists((data) => {
      fetchedLists = data;      // ✅ capture the data
      setLists(data);           // update UI list
    }, setErrorMessage);
    // console.log("Fetched lists:", fetchedLists);  // <-- log the raw data
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


  if (loading)
    return <ActivityIndicator size="large" color="#6c63ff" style={{ flex: 1 }} />;

  return (
    <View style={[styles.container, { paddingTop: topPadding + 15 }]}>
      {/* Header */}
      <Text style={[styles.header, { color: "#6c63ff", marginBottom: 20 }]}>
        Shopping Lists
      </Text>

      {/* Search bar */}
{/* Search bar */}
<ShoppingListFilterPanel
  allLists={allLists}
  setFilteredLists={setLists}
  search={search}
  setSearch={setSearch}
  activeQuickDate={activeQuickDate}
  setActiveQuickDate={setActiveQuickDate}
  customDate={customDate}
  setCustomDate={setCustomDate}
/>


      {/* Error message */}
      {errorMessage.length > 0 && (
        <Text style={{ color: "red", marginBottom: 10 }}>{errorMessage}</Text>
      )}

      {/* Toast message */}
      {toastMessage !== "" && (
        <View style={styles.toast}>
          <Text style={styles.toastMain}>{toastMessage}</Text>
          <Text style={styles.toastHelp}>This will disappear in 4 seconds</Text>
        </View>
      )}

      {/* Shopping lists */}
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
  contentContainerStyle={{ paddingBottom: 120 }}
  showsVerticalScrollIndicator={false}
  ListEmptyComponent={() => (
    <Text style={styles.emptyText}>
      No lists found
    </Text>
  )}
/>


      {/* Footer */}
      {/* <Footer navigation={navigation} currentRoute="ShoppingList" /> */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 15, backgroundColor: "#f9f9fc" },
  header: { fontSize: 22, fontWeight: "700" },
searchBar: {
  height: 48,
  borderWidth: 1.5,            // same as category chips
  borderColor: "#d1d1f0",      // same as inactive category border
  borderRadius: 12,
  paddingHorizontal: 16,
  fontSize: 16,
  marginBottom: 20,
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.05,
  shadowRadius: 4,
  elevation: 2,                 // subtle shadow for Android
},

  toast: {
    alignSelf: "center",
    marginBottom: 10,
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: "#6c63ff",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOpacity: 0.05,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 2,
  },
  toastMain: { color: "#fff", fontWeight: "700", fontSize: 16, textAlign: "center" },
  toastHelp: { color: "#e0e0ff", fontStyle: "italic", fontSize: 12, textAlign: "center", marginTop: 2 },
  emptyText: {
  textAlign: "center",
  marginTop: 40,       // gives some space from search bar
  color: "#6c63ff",    // matches your purple theme
  fontSize: 16,
  fontWeight: "500",
  fontStyle: "italic",
}

});
