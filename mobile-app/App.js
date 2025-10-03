import React, { useRef, useState, useEffect } from "react";
import { Platform, StatusBar, Easing, View } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
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
  config: { duration: 300, easing: Easing.out(Easing.poly(4)) },
};

export default function App() {
  const navigationRef = useRef();
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

  return (
    <NavigationContainer
      ref={navigationRef}
      onStateChange={() => {
        const state = navigationRef.current.getRootState();
        const routes = state.routes;
        const current = routes[state.index]?.name;
        const previous = routes[state.index - 1]?.name;

        if (current && previous) {
          const currentIndex = tabOrder.indexOf(current);
          const prevIndex = tabOrder.indexOf(previous);
          setCurrentRoute(currentIndex > prevIndex ? "right" : "left");
        }

        setCurrentRoute(current || "Welcome");
      }}
    >
      <View style={{ flex: 1 }}>
        <Stack.Navigator initialRouteName="Welcome" screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Welcome">
            {(props) => <WelcomeScreen {...props} topPadding={topPadding} />}
          </Stack.Screen>

          <Stack.Screen
            name="Product"
            options={({ route }) => ({
              animation:
                route?.params?.direction === "left" ? "slide_from_left" : "slide_from_right",
              transitionSpec: { open: customTransition, close: customTransition },
            })}
          >
            {(props) => <ProductScreen {...props} topPadding={topPadding} />}
          </Stack.Screen>

          <Stack.Screen
            name="Market"
            options={({ route }) => ({
              animation:
                route?.params?.direction === "left" ? "slide_from_left" : "slide_from_right",
              transitionSpec: { open: customTransition, close: customTransition },
            })}
          >
            {(props) => <MarketScreen {...props} topPadding={topPadding} />}
          </Stack.Screen>

          <Stack.Screen
            name="ShoppingList"
            options={({ route }) => ({
              animation:
                route?.params?.direction === "left" ? "slide_from_left" : "slide_from_right",
              transitionSpec: { open: customTransition, close: customTransition },
            })}
          >
            {(props) => <ShoppingListScreen {...props} topPadding={topPadding} />}
          </Stack.Screen>
        </Stack.Navigator>

        {/* Show footer only on tab screens */}
        {tabOrder.includes(currentRoute) && (
          <Footer navigation={navigationRef.current} currentRoute={currentRoute} />
        )}
      </View>
    </NavigationContainer>
  );
}
