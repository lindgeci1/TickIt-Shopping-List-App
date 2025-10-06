import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, LayoutAnimation, Modal, FlatList, Image, Alert } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { VITE_BASE_API_URL } from "@env";
import { fetchFavoriteProducts } from "../Product/fetchFavoriteProducts";

export default function ProductFilterPanel({
  categoriesList, search, onSearchChange, activeCategory, onCategoryPress,
  markets, activeMarket, setActiveMarket, setMarketProducts,
  setFavoriteProducts: setParentFavoriteProducts, favoritesMode, setProducts,
  setFavoritesMode, setSearch: setParentSearch, allProducts, onMarketClick
}) {
  const [filterExpanded,setFilterExpanded] = useState(false),
        [showCategoryModal,setShowCategoryModal] = useState(false),
        [showMarketModal,setShowMarketModal] = useState(false),
        [allMarketProducts,setAllMarketProducts] = useState([]),
        [favoriteProducts,setFavoriteProducts] = useState([]);

  const toggleFilterExpand = ()=>{ LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setFilterExpanded(!filterExpanded); };
  const applyFilters = (products,category,searchTerm)=>products.filter(p=>(!category||p.Category===category)&&(!searchTerm||p.Name.toLowerCase().includes(searchTerm.toLowerCase())));
  
  const handleMarketSelect = async market=>{
    setActiveMarket(market);
    if(!market){ setAllMarketProducts([]); setMarketProducts([]); return; }
    try{
      const res = await fetch(`${VITE_BASE_API_URL}/api/market/${market.MarketID}`);
      const json = await res.json();
      const productsFromMarket = (json.Products||[]).map(p=>({ ProductID:p.ProductID, Name:p.Name, Category:p.Category, Photos:p.Photos||[] }));
      setAllMarketProducts(productsFromMarket);
      setMarketProducts(applyFilters(productsFromMarket,activeCategory,search));
    }catch(err){ console.error(err); setAllMarketProducts([]); setMarketProducts([]); }
  };

  const handleCategorySelect = category=>{ onCategoryPress(category); setMarketProducts(applyFilters(allMarketProducts,category,search)); };
  const handleSearch = text=>{
    setParentSearch(text);
    if(favoritesMode){ const filtered=favoriteProducts.filter(p=>p.Name.toLowerCase().includes(text.toLowerCase())); setParentFavoriteProducts?.(filtered); return; }
    activeMarket ? setMarketProducts(applyFilters(allMarketProducts,activeCategory,text)) : setProducts(applyFilters(allProducts,activeCategory,text));
  };
  const handleShowFavorites = async ()=>{
    try{
      const data = await fetchFavoriteProducts();
      setFavoriteProducts(data); setParentFavoriteProducts?.(data);
      onCategoryPress(null); setActiveMarket(null); setAllMarketProducts([]); setParentSearch?.(""); setFavoritesMode(true);
    }catch(err){ console.error(err); Alert.alert("❌ Error","Failed to fetch favorites"); }
  };

  return (
    <View style={{marginBottom:10,padding:12,backgroundColor:"#f5f5ff",borderRadius:12}}>
      <View style={{flexDirection:"row",alignItems:"center",borderWidth:1.5,borderColor:"#d1d1f0",borderRadius:12,backgroundColor:"#fff",paddingHorizontal:10,marginBottom:12,shadowColor:"#000",shadowOpacity:0.05,shadowRadius:4,shadowOffset:{width:0,height:2}}}>
        <Ionicons name="search-outline" size={20} color="#6c63ff" style={{marginRight:6}}/>
        <TextInput style={{flex:1,height:40,fontSize:15,backgroundColor:"#fff",color:"#000"}} placeholder="Search for a product..." placeholderTextColor="#777" value={search} onChangeText={handleSearch}/>
      </View>

      <TouchableOpacity onPress={toggleFilterExpand} style={{alignSelf:"flex-start",flexDirection:"row",alignItems:"center",backgroundColor:"#6c63ff",paddingHorizontal:14,paddingVertical:6,borderRadius:20}}>
        <Ionicons name="options-outline" size={18} color="#fff" style={{marginRight:6}}/>
        <Text style={{color:"#fff",fontWeight:"600",fontSize:14}}>Filters</Text>
      </TouchableOpacity>

      {filterExpanded && (
        <View style={{marginTop:12,padding:12,backgroundColor:"#fff",borderRadius:8,gap:12,shadowColor:"#000",shadowOpacity:0.05,shadowRadius:4,shadowOffset:{width:0,height:2}}}>
          <View style={{flexDirection:"row",alignItems:"center",justifyContent:"space-between"}}>
            <TouchableOpacity onPress={handleShowFavorites} disabled={!!activeCategory||!!activeMarket} style={{flex:1,borderWidth:1,borderColor:"#d1d1f0",borderRadius:6,backgroundColor:(!!activeCategory||!!activeMarket)?"#f0f0f0":"#f9f9ff",paddingVertical:8,alignItems:"center",marginRight:6}}>
              <Text style={{color:(!!activeCategory||!!activeMarket)?"#aaa":"#6c63ff",fontWeight:"600",fontSize:13}}>Favorites</Text>
            </TouchableOpacity>
            {(favoriteProducts.length>0||favoritesMode)&&<TouchableOpacity onPress={()=>{setFavoriteProducts([]); setParentFavoriteProducts?.([]); setFavoritesMode(false); activeMarket?setMarketProducts(applyFilters(allMarketProducts,activeCategory,search)):setProducts(applyFilters(allProducts,activeCategory,search));}} style={{padding:4}}><Ionicons name="close-circle" size={20} color="red"/></TouchableOpacity>}
          </View>

          <View style={{flexDirection:"row",gap:8}}>
            <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
              <TouchableOpacity onPress={()=>!favoritesMode&&setShowCategoryModal(true)} disabled={favoritesMode} style={{flex:1,borderWidth:1,borderColor:"#d1d1f0",borderRadius:6,backgroundColor:favoritesMode?"#f0f0f0":"#f9f9ff",paddingVertical:8,paddingHorizontal:10}}>
                <Text style={{color:favoritesMode?"#aaa":"#6c63ff",fontWeight:"600",fontSize:13}}>{activeCategory||"Category"}</Text>
              </TouchableOpacity>
              {activeCategory&&!favoritesMode&&<TouchableOpacity onPress={()=>handleCategorySelect(null)} style={{marginLeft:6}}><Ionicons name="close-circle" size={20} color="red"/></TouchableOpacity>}
            </View>

            <View style={{flex:1,flexDirection:"row",alignItems:"center"}}>
              <TouchableOpacity onPress={async()=>{if(!favoritesMode){await onMarketClick?.(); setShowMarketModal(true);}}} disabled={favoritesMode} style={{flex:1,borderWidth:1,borderColor:"#d1d1f0",borderRadius:6,backgroundColor:favoritesMode?"#f0f0f0":"#f9f9ff",paddingVertical:8,paddingHorizontal:10}}>
                <Text style={{color:favoritesMode?"#aaa":"#6c63ff",fontWeight:"600",fontSize:13}}>{activeMarket?.Name||"Market"}</Text>
              </TouchableOpacity>
              {activeMarket&&!favoritesMode&&<TouchableOpacity onPress={()=>{setActiveMarket(null); setAllMarketProducts([]); setMarketProducts([]);}} style={{marginLeft:6}}><Ionicons name="close-circle" size={20} color="red"/></TouchableOpacity>}
            </View>
          </View>
        </View>
      )}

      <Modal visible={showCategoryModal} transparent animationType="slide">
        <View style={{flex:1,justifyContent:"center",backgroundColor:"rgba(0,0,0,0.4)"}}>
          <View style={{margin:20,backgroundColor:"#fff",borderRadius:12,padding:16}}>
            <Text style={{fontWeight:"700",fontSize:16,marginBottom:12}}>Select Category</Text>
            <FlatList data={categoriesList} keyExtractor={item=>item.name} renderItem={({item})=>(
              <TouchableOpacity onPress={()=>{handleCategorySelect(item.name); setShowCategoryModal(false);}} style={{paddingVertical:10}}>
                <Text style={{fontSize:15,color:"#333"}}>{item.name}</Text>
              </TouchableOpacity>
            )}/>
            <TouchableOpacity onPress={()=>setShowCategoryModal(false)}><Text style={{color:"red",marginTop:12,textAlign:"center"}}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>

      <Modal visible={showMarketModal} transparent animationType="slide">
        <View style={{flex:1,justifyContent:"center",backgroundColor:"rgba(0,0,0,0.4)"}}>
          <View style={{margin:20,backgroundColor:"#fff",borderRadius:12,padding:16}}>
            <Text style={{fontWeight:"700",fontSize:16,marginBottom:12}}>Select Market</Text>
            <FlatList data={markets} keyExtractor={item=>String(item.MarketID)} renderItem={({item})=>(
              <TouchableOpacity onPress={()=>{handleMarketSelect(item); setShowMarketModal(false);}} style={{paddingVertical:10,flexDirection:"row",alignItems:"center"}}>
                {item.Photos?.[0]&&<View style={{width:28,height:28,borderRadius:14,overflow:"hidden",marginRight:8}}><Image source={{uri:item.Photos[0]}} style={{width:"100%",height:"100%"}}/></View>}
                <Text style={{fontSize:15,color:"#333"}}>{item.Name}</Text>
              </TouchableOpacity>
            )}/>
            <TouchableOpacity onPress={()=>setShowMarketModal(false)}><Text style={{color:"red",marginTop:12,textAlign:"center"}}>Cancel</Text></TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}
