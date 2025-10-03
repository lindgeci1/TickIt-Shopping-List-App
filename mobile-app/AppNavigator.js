// AppNavigator.js
import React, { useRef, useState, useEffect } from "react";
import { Platform, StatusBar, Easing, View } from "react-native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./screens/WelcomeScreen";
import MarketScreen from "./screens/MarketScreen";
import ProductScreen from "./screens/ProductScreen";
import ShoppingListScreen from "./screens/ShoppingListScreen";
import Footer from "./components/Footer";

const Stack = createNativeStackNavigator();
export const topPadding = Platform.OS === "android" ? StatusBar.currentHeight : 44;

const customTransition = {
  animation: "timing",
  config: { duration: 300, easing: Easing.inOut(Easing.poly(4)) }, // smoother in-out
};

export default function AppNavigator({ navigationRef }) {
  const [currentRoute, setCurrentRoute] = useState("Welcome");
  const tabOrder = ["Product", "Market", "ShoppingList"];

  // Keep currentRoute updated
  useEffect(() => {
    const unsubscribe = navigationRef.current?.addListener("state", () => {
      const route = navigationRef.current.getCurrentRoute();
      if (route) setCurrentRoute(route.name);
    });

    return () => {
      if (unsubscribe) unsubscribe();
    };
  }, [navigationRef.current]);

  const getSlideOptions = (route) => {
    const isLeft = route?.params?.direction === "left";

    // console.log(
    //   `[Transition] Screen: ${route?.name || "unknown"}, direction: ${isLeft ? "left" : "right"}, duration: ${customTransition.config.duration}`
    // );

    return {
      animation: isLeft ? "slide_from_left" : "slide_from_right",
      transitionSpec: { open: customTransition, close: customTransition },
    };
  };

  return (
    <View style={{ flex: 1 }}>
      <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Welcome">
          {(props) => <WelcomeScreen {...props} topPadding={topPadding} />}
        </Stack.Screen>

        <Stack.Screen name="Product" options={({ route }) => getSlideOptions(route)}>
          {(props) => <ProductScreen {...props} topPadding={topPadding} />}
        </Stack.Screen>

        <Stack.Screen name="Market" options={({ route }) => getSlideOptions(route)}>
          {(props) => <MarketScreen {...props} topPadding={topPadding} />}
        </Stack.Screen>

        <Stack.Screen name="ShoppingList" options={({ route }) => getSlideOptions(route)}>
          {(props) => <ShoppingListScreen {...props} topPadding={topPadding} />}
        </Stack.Screen>
      </Stack.Navigator>

      {/* Show footer only on tab screens */}
      {tabOrder.includes(currentRoute) && (
        <Footer navigation={navigationRef.current} currentRoute={currentRoute} />
      )}
    </View>
  );
}
