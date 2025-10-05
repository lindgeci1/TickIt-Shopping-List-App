import React, { useRef, useEffect, useState } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, LayoutAnimation } from "react-native";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 20) * 0.45;

export default function ProductCardBP({ product, selectionMode=false, selected=false, onSelect, showPrice=true, preferredMarketLogo, preferredMarketPrice, marketMessage }) {
  const [expanded,setExpanded] = useState(false);
  const scale = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  const toggleExpand = () => { LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut); setExpanded(!expanded); };

  useEffect(()=>{
    Animated.spring(scale,{toValue:selected?0.95:1,friction:7,useNativeDriver:true}).start();
    Animated.timing(overlayOpacity,{toValue:selected?0.25:0,duration:200,useNativeDriver:true}).start();
    Animated.spring(checkScale,{toValue:selected?1:0,friction:5,useNativeDriver:true}).start();
  },[selected]);

  return (
    <TouchableOpacity activeOpacity={0.9} onPress={selectionMode?onSelect:toggleExpand} style={{margin:6}}>
      <Animated.View style={[styles.card,{width:CARD_WIDTH,transform:[{scale}]},selected&&styles.selectedCard]}>
        {selectionMode && <Animated.View style={[styles.overlay,{opacity:overlayOpacity}]}/>}
        {selectionMode && <Animated.View style={[styles.centerCheck,{transform:[{scale:checkScale}]}]}><Text style={styles.checkMark}>✓</Text></Animated.View>}
        <Image source={{uri:product.Photos?.[0]||"https://via.placeholder.com/100"}} style={styles.photo} resizeMode="cover"/>
        <View style={styles.infoBox}>
          <Text style={styles.name}>{product.Name||"Unnamed Product"}</Text>
          <View style={{width:"80%",height:1,backgroundColor:"#e0e0e0",marginVertical:6}}/>
          {showPrice && product.Price!=null && <Text style={styles.price}>${product.Price.toFixed(2)}</Text>}
          {!preferredMarketLogo && marketMessage && <Text style={styles.marketMessage}>{marketMessage}</Text>}
        </View>
        {expanded && preferredMarketLogo && <View style={styles.preferredBox}>
          <View style={styles.preferredRow}><Text style={styles.preferredLabel}>Category:</Text><Text style={styles.preferredPrice}>{product.Category||"No category"}</Text></View>
          <View style={styles.preferredRow}><Text style={styles.preferredLabel}>Preferred:</Text><Image source={{uri:preferredMarketLogo}} style={styles.preferredLogo}/></View>
          <View style={styles.preferredRow}><Text style={styles.preferredLabel}>Price:</Text>{preferredMarketPrice!=null && <Text style={styles.preferredPrice}>€{preferredMarketPrice.toFixed(2)}</Text>}</View>
        </View>}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:{backgroundColor:"#fff",borderRadius:12,padding:10,alignItems:"center",shadowColor:"#000",shadowOffset:{width:0,height:2},shadowOpacity:0.08,shadowRadius:4,elevation:3},
  selectedCard:{borderWidth:2,borderColor:"#6c63ff",shadowColor:"#6c63ff",shadowOffset:{width:0,height:4},shadowOpacity:0.2,shadowRadius:6},
  overlay:{...StyleSheet.absoluteFillObject,backgroundColor:"#6c63ff",borderRadius:12,zIndex:5},
  centerCheck:{position:"absolute",top:"50%",left:"50%",zIndex:10,backgroundColor:"#6c63ff",width:32,height:32,borderRadius:16,alignItems:"center",justifyContent:"center",shadowColor:"#000",shadowOffset:{width:0,height:1},shadowOpacity:0.3,shadowRadius:2,transform:[{translateX:-16},{translateY:-16}]},
  checkMark:{color:"#fff",fontWeight:"bold",fontSize:18},
  photo:{width:110,height:110,borderRadius:12,marginBottom:8,backgroundColor:"#f0f0ff"},
  infoBox:{alignItems:"center",marginBottom:8,width:"100%"},
  name:{fontSize:14,fontWeight:"700",color:"#2d3436",textAlign:"center"},
  price:{fontSize:14,fontWeight:"600",color:"#444",marginTop:2},
  marketMessage:{fontSize:11,color:"red",fontStyle:"italic",textAlign:"center",marginTop:4},
  preferredBox:{backgroundColor:"#f8f8ff",padding:6,borderRadius:10,width:"90%",marginTop:6,alignItems:"center"},
  preferredRow:{flexDirection:"row",alignItems:"center",justifyContent:"space-between",width:"100%",marginVertical:2},
  preferredLabel:{fontSize:10,color:"#6c63ff",fontWeight:"600",marginRight:4},
  preferredLogo:{width:40,height:25,borderRadius:4,borderWidth:1,borderColor:"#6c63ff"},
  preferredPrice:{fontSize:12,fontWeight:"700",color:"#444"}
});
