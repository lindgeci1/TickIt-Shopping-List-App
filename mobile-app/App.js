import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";

import WelcomeScreen from "./screens/WelcomeScreen";
import MarketScreen from "./screens/MarketScreen";
import ProductScreen from "./screens/ProductScreen";
import ShoppingListScreen from "./screens/ShoppingListScreen"; // ← new import

const Stack = createNativeStackNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName="Welcome">
        <Stack.Screen name="Welcome" component={WelcomeScreen} />
        <Stack.Screen
          name="Market"
          component={MarketScreen}
          options={{ title: "Markets", headerBackVisible: false }}
        />
        <Stack.Screen
          name="Product"
          component={ProductScreen}
          options={{ title: "Products", headerBackVisible: false }}
        />
        <Stack.Screen
          name="ShoppingList"
          component={ShoppingListScreen}
          options={{ title: "Shopping Lists", headerBackVisible: false }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
