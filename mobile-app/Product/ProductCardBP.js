import React, { useState, useRef, useEffect } from "react";
import { View, Text, Image, StyleSheet, TouchableOpacity, Dimensions, Animated, LayoutAnimation, Easing, ActivityIndicator } from "react-native";
import { usePreferredMarkets } from "../Product/usePreferredMarkets";

const { width } = Dimensions.get("window");
const CARD_WIDTH = (width - 20) * 0.45;

export default function ProductCardBP({ product, selectionMode=false, selected=false, onSelect, showPrice=true }) {
  const [expanded, setExpanded] = useState(false);
  const [loadingPref, setLoadingPref] = useState(false);
  const [preferredMarketLogo, setPreferredMarketLogo] = useState(null);
  const [preferredMarketPrice, setPreferredMarketPrice] = useState(null);
  const [marketMessage, setMarketMessage] = useState(null);

  const scale = useRef(new Animated.Value(1)).current;
  const overlayOpacity = useRef(new Animated.Value(0)).current;
  const checkScale = useRef(new Animated.Value(0)).current;

  const toggleExpand = async () => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpanded(prev => !prev);

    if (!expanded && !preferredMarketLogo && !loadingPref) {
      setLoadingPref(true);
      try {
        const data = await usePreferredMarkets([product]);
        const productId = product.ProductID;
        setPreferredMarketLogo(data.logos[productId]);
        setPreferredMarketPrice(data.prices[productId]);
        setMarketMessage(data.messages[productId]);
      } catch (err) {
        console.error("Failed to fetch preferred market info:", err);
      } finally {
        setLoadingPref(false);
      }
    }
  };

  // Animate selection/deselection
  useEffect(() => {
    Animated.parallel([
      Animated.spring(scale, { toValue: selected ? 0.95 : 1, friction: 7, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: selected ? 0.25 : 0, duration: 200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.spring(checkScale, { toValue: selected ? 1 : 0, friction: 5, useNativeDriver: true })
    ]).start();
  }, [selected]);

useEffect(() => {
  if (!selected || !selectionMode) {
    overlayOpacity.setValue(0);
    checkScale.setValue(0);
    scale.setValue(1);
  } else {
    Animated.parallel([
      Animated.spring(scale, { toValue: 0.95, friction: 7, useNativeDriver: true }),
      Animated.timing(overlayOpacity, { toValue: 0.25, duration: 200, easing: Easing.inOut(Easing.ease), useNativeDriver: true }),
      Animated.spring(checkScale, { toValue: 1, friction: 5, useNativeDriver: true })
    ]).start();
  }
}, [selected, selectionMode]);


  return (
    <TouchableOpacity activeOpacity={0.9} onPress={selectionMode ? onSelect : toggleExpand} style={{ margin: 4 }}>
      <Animated.View style={[styles.card, { width: CARD_WIDTH, transform: [{ scale }] }, selected && styles.selectedCard]}>
        
        {selectionMode && (
          <>
            {/* Dim background when selected */}
            <Animated.View style={[styles.overlay, { opacity: overlayOpacity }]} />

            {/* Empty or filled marker */}
            <View style={styles.markerContainer}>
              {selected ? (
                <Animated.View style={[styles.markerFilled, { transform: [{ scale: checkScale }] }]}>
                  <Text style={styles.checkMark}>✓</Text>
                </Animated.View>
              ) : (
                <View style={styles.markerEmpty} />
              )}
            </View>
          </>
        )}

        <Image source={{ uri: product.Photos?.[0] || "https://via.placeholder.com/100" }} style={styles.photo} resizeMode="cover" />

        <View style={styles.infoBox}>
          <Text style={styles.name} numberOfLines={2}>{product.Name || "Unnamed Product"}</Text>
          <View style={{ width: "80%", height: 1, backgroundColor: "#e0e0e0", marginVertical: 4 }} />
          {showPrice && product.Price != null && <Text style={styles.price}>${product.Price.toFixed(2)}</Text>}
          {!preferredMarketLogo && marketMessage && <Text style={styles.marketMessage}>{marketMessage}</Text>}
        </View>

        {expanded && (
          <View style={styles.preferredBox}>
            {loadingPref ? (
              <ActivityIndicator size="small" color="#6c63ff" />
            ) : (
              preferredMarketLogo && (
                <View style={styles.preferredRow}>
                  <View style={{ flexDirection: "row", alignItems: "center" }}>
                    <Image source={{ uri: preferredMarketLogo }} style={styles.preferredLogo} />
                    <Text style={styles.preferredTag}>Preferred</Text>
                  </View>
                  <Text style={styles.preferredPrice}>€{preferredMarketPrice?.toFixed(2)}</Text>
                </View>
              )
            )}
          </View>
        )}
      </Animated.View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  card:{backgroundColor:"#fff",borderRadius:10,padding:6,alignItems:"center",shadowColor:"#000",shadowOffset:{width:0,height:1},shadowOpacity:0.06,shadowRadius:3,elevation:2},
  selectedCard:{borderWidth:1.5,borderColor:"#6c63ff",shadowColor:"#6c63ff",shadowOffset:{width:0,height:2},shadowOpacity:0.15,shadowRadius:4},
  overlay:{...StyleSheet.absoluteFillObject,backgroundColor:"#6c63ff",borderRadius:10,zIndex:5},
  checkMark:{color:"#fff",fontWeight:"bold",fontSize:16},
  photo:{width:100,height:100,borderRadius:10,marginBottom:6,backgroundColor:"#f0f0ff"},
  infoBox:{alignItems:"center",marginBottom:6,width:"100%"},
  name:{fontSize:12,fontWeight:"700",color:"#2d3436",textAlign:"center"},
  price:{fontSize:12,fontWeight:"600",color:"#444",marginTop:2},
  marketMessage:{fontSize:10,color:"red",fontStyle:"italic",textAlign:"center",marginTop:2},
  preferredBox:{backgroundColor:"#f8f8ff",padding:6,borderRadius:8,width:"90%",marginTop:4},
  preferredRow:{flexDirection:"row",justifyContent:"space-between",alignItems:"center",width:"100%"},
  preferredLogo:{width:30,height:20,borderRadius:3,borderWidth:1,borderColor:"#6c63ff",marginRight:6},
  preferredTag:{fontSize:10,color:"#6c63ff",fontWeight:"600"},
  preferredPrice:{fontSize:12,fontWeight:"700",color:"#2d3436"},
  markerContainer:{position:"absolute",top:8,right:8,zIndex:15},
  markerEmpty:{width:24,height:24,borderRadius:12,borderWidth:2,borderColor:"#6c63ff",backgroundColor:"transparent"},
  markerFilled:{width:24,height:24,borderRadius:12,backgroundColor:"#6c63ff",alignItems:"center",justifyContent:"center"},
});
