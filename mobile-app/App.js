import React from "react";
import { Platform, StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./screens/WelcomeScreen";
import MarketScreen from "./screens/MarketScreen";
import ProductScreen from "./screens/ProductScreen";
import ShoppingListScreen from "./screens/ShoppingListScreen";

const Stack = createNativeStackNavigator();

// Optional helper for top padding
export const topPadding = Platform.OS === "android" ? StatusBar.currentHeight : 44; 
// 44 is default iOS header height

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        initialRouteName="Welcome"
        screenOptions={{
          headerShown: false, // completely hide header
        }}
      >
        <Stack.Screen name="Welcome">
          {(props) => <WelcomeScreen {...props} topPadding={topPadding} />}
        </Stack.Screen>
        <Stack.Screen name="Market">
          {(props) => <MarketScreen {...props} topPadding={topPadding} />}
        </Stack.Screen>
        <Stack.Screen name="Product">
          {(props) => <ProductScreen {...props} topPadding={topPadding} />}
        </Stack.Screen>
        <Stack.Screen name="ShoppingList">
          {(props) => <ShoppingListScreen {...props} topPadding={topPadding} />}
        </Stack.Screen>
      </Stack.Navigator>
    </NavigationContainer>
  );
}
