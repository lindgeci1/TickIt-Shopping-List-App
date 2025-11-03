import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, LayoutAnimation } from "react-native";
import ShoppingListScreens from "../ShoppingList/ShoppingListScreens";
import ProductCardBP from "../Product/ProductCardBP";
import ProductFilterPanel from "../Product/ProductFilterPanel";
import { fetchProducts } from "../Product/fetchProducts";
import { fetchShoppingLists } from "../ShoppingList/fetchShoppingLists";
import { addProductsToShoppingList } from "../Product/addProductsToShoppingList";
import { filterProducts } from "../Product/filterProducts";

export default function ProductScreen({ navigation, topPadding }) {
  const [allProducts,setAllProducts] = useState([]),
        [products,setProducts] = useState([]),
        [search,setSearch] = useState(""),
        [activeCategory,setActiveCategory] = useState(null),
        [shoppingLists,setShoppingLists] = useState([]),
        [modalVisible,setModalVisible] = useState(false),
        [selectionMode,setSelectionMode] = useState(false),
        [selectedProducts,setSelectedProducts] = useState([]),
        [markets,setMarkets] = useState([]),
        [activeMarket,setActiveMarket] = useState(null),
        [marketProducts,setMarketProducts] = useState([]),
        [favoriteProducts,setFavoriteProducts] = useState([]),
        [favoritesMode,setFavoritesMode] = useState(false),
        [errorMessage,setErrorMessage] = useState("");
  const [filterExpanded,setFilterExpanded] = useState(false);
  const [hasSelectedFilter, setHasSelectedFilter] = useState(false);

  // useEffect(()=>{ fetchProducts(setAllProducts,setProducts); },[]);

  const handleSearchChange = text => { setSearch(text); filterProducts(allProducts,setProducts,text,activeCategory); };
  const handleCategoryPress = category => { const newCat = category===activeCategory?null:category; setActiveCategory(newCat); filterProducts(allProducts,setProducts,search,newCat); };
  const toggleSelection = product => setSelectedProducts(prev=>prev.includes(product)?prev.filter(p=>p!==product):[...prev,product]);
  const toggleFilterExpand = ()=>{ LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setFilterExpanded(!filterExpanded); };
  const handleAddToBuyingList = async ()=>{
    if(!selectionMode){ setSelectionMode(true); setSelectedProducts([]); }
    else if(selectedProducts.length){ await fetchShoppingLists(setShoppingLists,setErrorMessage); setModalVisible(true); }
  };

  const renderProduct = ({item})=>(
  <ProductCardBP
    product={item}
    selectionMode={selectionMode}
    selected={selectedProducts.includes(item)}
    onSelect={() => toggleSelection(item)}
    showPrice={false}
  />
  );

  return (
    <View style={[styles.container,{paddingTop:topPadding+15}]}>
      <Text style={[styles.headerTitle,{marginBottom:15}]}>Browse Products</Text>
      <ProductFilterPanel
        search={search} onSearchChange={handleSearchChange}
        activeCategory={activeCategory} onCategoryPress={handleCategoryPress}
        markets={markets} activeMarket={activeMarket} setActiveMarket={setActiveMarket} setMarketProducts={setMarketProducts}
        setProducts={setProducts} allProducts={allProducts} setFavoriteProducts={setFavoriteProducts}
        favoritesMode={favoritesMode} setFavoritesMode={setFavoritesMode} setSearch={setSearch}
      />
          {!activeCategory && !activeMarket && !favoritesMode ? (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text style={{ fontSize: 22, fontWeight: "700", color: "#6c63ff", marginBottom: 8 }}>
          Hello there 
        </Text>
        <Text style={{ fontSize: 15, color: "#555", textAlign: "center", paddingHorizontal: 20 }}>
          Please select a market or category from Filters to start browsing products.
        </Text>
      </View>
    ) : (
      <>
     <View style={{ flexDirection: "row", justifyContent: "space-between", marginBottom: 12 }}>
  <TouchableOpacity
    style={[styles.globalActionButton, { flex: 1, marginRight: selectionMode ? 6 : 0 }]}
    onPress={handleAddToBuyingList}
  >
    <Text style={styles.globalActionButtonText}>
      {selectionMode ? `Add ${selectedProducts.length} selected` : "+ Add to Shopping List"}
    </Text>
  </TouchableOpacity>

  {selectionMode && (
    <TouchableOpacity
      style={[styles.globalActionButton, { flex: 1, marginLeft: 6, backgroundColor: "#ff6b6b" }]}
      onPress={() => { setSelectionMode(false); setSelectedProducts([]); }}
    >
      <Text style={styles.globalActionButtonText}>Cancel</Text>
    </TouchableOpacity>
  )}
</View>

      <FlatList
        data={favoritesMode ? favoriteProducts.filter(p => p.Name.toLowerCase().includes(search.toLowerCase())) 
                            : activeMarket ? marketProducts : products}
        keyExtractor={item => item.ProductID.toString()}
        renderItem={renderProduct}
        numColumns={2}
        columnWrapperStyle={{ justifyContent: "space-between" }}
        contentContainerStyle={{ paddingBottom: 120 }}
        showsVerticalScrollIndicator={false}
        ListEmptyComponent={() => <Text style={styles.emptyText}>No products found</Text>}
        extraData={[selectedProducts, selectionMode]} // ← ADD THIS
      />
      </>
       )}
      <ShoppingListScreens
        visible={modalVisible} onClose={()=>setModalVisible(false)}
        shoppingLists={shoppingLists}
        onSelect={async list=>{
          const productIds = selectedProducts.map(p=>p.ProductID);
          const shoppingListIds = [list.Shopping_List_ItemID];
          await addProductsToShoppingList(productIds,shoppingListIds);
          await fetchShoppingLists(setShoppingLists,setErrorMessage);
          setSelectedProducts([]); setSelectionMode(false); setModalVisible(false);
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container:{flex:1,padding:15,backgroundColor:"#f9f9fc"},
  headerTitle:{fontSize:24,fontWeight:"700",color:"#6c63ff"},
  globalAddButton:{backgroundColor:"#6c63ff",paddingVertical:10,borderRadius:12,alignItems:"center",marginBottom:12},
  globalAddButtonText:{color:"#fff",fontWeight:"700"},
  emptyText:{textAlign:"center",marginTop:40,color:"#6c63ff",fontSize:16,fontWeight:"500",fontStyle:"italic"},
  globalActionButton: {
  paddingVertical: 8,           // smaller, compact
  borderRadius: 10,             // rounded edges
  alignItems: "center",
  justifyContent: "center",
  shadowColor: "#000",
  shadowOffset: { width: 0, height: 1 },
  shadowOpacity: 0.1,
  shadowRadius: 2,
  elevation: 2,
  backgroundColor: "#6c63ff",
},
globalActionButtonText: {
  color: "#fff",
  fontWeight: "700",
  fontSize: 13,                // slightly smaller
},

});
