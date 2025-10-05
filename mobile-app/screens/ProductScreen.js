import React, { useState, useEffect } from "react";
import { View, Text, FlatList, StyleSheet, TouchableOpacity, LayoutAnimation } from "react-native";
import ShoppingListScreen from "../ShoppingList/ShoppingListScreen";
import ProductCardBP from "../Product/ProductCardBP";
import ProductFilterPanel from "../Product/ProductFilterPanel";
import { fetchProducts } from "../Product/fetchProducts";
import { fetchShoppingLists } from "../ShoppingList/fetchShoppingLists";
import { addProductsToShoppingList } from "../Product/addProductsToShoppingList";
import { filterProducts } from "../Product/filterProducts";
import { fetchMarkets } from "../Market/fetchMarkets";
import usePreferredMarkets from "../Product/usePreferredMarkets";

const categoriesList = [{name:"Food"},{name:"Hygiene"},{name:"Drinks"},{name:"Electronics"},{name:"Clothing"},{name:"Cleaning"}];

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
  const { preferredMarkets, marketMessages, preferredMarketPrices } = usePreferredMarkets(products);
  const [filterExpanded,setFilterExpanded] = useState(false);

  useEffect(()=>{ fetchProducts(setAllProducts,setProducts); },[]);

  const handleSearchChange = text => { setSearch(text); filterProducts(allProducts,setProducts,text,activeCategory); };
  const handleCategoryPress = category => { const newCat = category===activeCategory?null:category; setActiveCategory(newCat); filterProducts(allProducts,setProducts,search,newCat); };
  const fetchMarketsLazy = async ()=>{ if(!markets.length) await fetchMarkets(setMarkets); };
  const handleMarketClick = async ()=>{ await fetchMarketsLazy(); };
  const toggleSelection = product => setSelectedProducts(prev=>prev.includes(product)?prev.filter(p=>p!==product):[...prev,product]);
  const toggleFilterExpand = ()=>{ LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setFilterExpanded(!filterExpanded); };
  const handleAddToBuyingList = async ()=>{
    if(!selectionMode){ setSelectionMode(true); setSelectedProducts([]); }
    else if(selectedProducts.length){ await fetchShoppingLists(setShoppingLists,setErrorMessage); setModalVisible(true); }
  };

  const renderProduct = ({item})=>(
    <ProductCardBP
      product={item} selectionMode={selectionMode} selected={selectedProducts.includes(item)} onSelect={()=>toggleSelection(item)} showPrice={false}
      preferredMarketLogo={preferredMarkets[item.ProductID]} preferredMarketPrice={preferredMarketPrices[item.ProductID]} marketMessage={marketMessages[item.ProductID]}
    />
  );

  return (
    <View style={[styles.container,{paddingTop:topPadding+15}]}>
      <Text style={[styles.headerTitle,{marginBottom:15}]}>Browse Products</Text>
      <ProductFilterPanel
        categoriesList={categoriesList} search={search} onSearchChange={handleSearchChange}
        activeCategory={activeCategory} onCategoryPress={handleCategoryPress}
        markets={markets} activeMarket={activeMarket} setActiveMarket={setActiveMarket} setMarketProducts={setMarketProducts}
        setProducts={setProducts} allProducts={allProducts} setFavoriteProducts={setFavoriteProducts}
        favoritesMode={favoritesMode} setFavoritesMode={setFavoritesMode} setSearch={setSearch} onMarketClick={handleMarketClick}
      />
      <TouchableOpacity style={styles.globalAddButton} onPress={handleAddToBuyingList}>
        <Text style={styles.globalAddButtonText}>{selectionMode?`Add ${selectedProducts.length} selected`:"+ Add to Buying List"}</Text>
      </TouchableOpacity>
      {selectionMode && <TouchableOpacity style={[styles.globalAddButton,{backgroundColor:"#ff6b6b",marginBottom:12}]} onPress={()=>{setSelectionMode(false); setSelectedProducts([]);}}>
        <Text style={styles.globalAddButtonText}>Cancel</Text>
      </TouchableOpacity>}
      <FlatList
        data={favoritesMode?favoriteProducts.filter(p=>p.Name.toLowerCase().includes(search.toLowerCase())):activeMarket?marketProducts:products}
        keyExtractor={item=>item.ProductID.toString()}
        renderItem={renderProduct} numColumns={2} columnWrapperStyle={{justifyContent:"space-between"}}
        contentContainerStyle={{paddingBottom:120}} showsVerticalScrollIndicator={false}
        ListEmptyComponent={()=> <Text style={styles.emptyText}>No products found</Text>}
      />
      <ShoppingListScreen
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
  emptyText:{textAlign:"center",marginTop:40,color:"#6c63ff",fontSize:16,fontWeight:"500",fontStyle:"italic"}
});
