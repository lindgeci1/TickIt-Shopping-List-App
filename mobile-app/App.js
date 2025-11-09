import React, { useRef } from "react";
import { StatusBar } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { SafeAreaProvider } from "react-native-safe-area-context"; // ✅ import provider
import AppNavigator from "./AppNavigator";

export default function App() {
  const navigationRef = useRef();

  return (
    <SafeAreaProvider>
      <StatusBar
        barStyle="dark-content"
        backgroundColor="white"
      />

      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          // optional: handle navigation state changes
        }}
      >
        <AppNavigator navigationRef={navigationRef} />
      </NavigationContainer>
    </SafeAreaProvider>
  );
}
