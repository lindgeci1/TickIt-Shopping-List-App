import React, { useRef } from "react";
import { StatusBar } from "react-native"; // ✅ add this
import { NavigationContainer } from "@react-navigation/native";
import AppNavigator from "./AppNavigator";

export default function App() {
  const navigationRef = useRef();

  return (
    <>
      {/* Make status bar icons dark so they contrast on light backgrounds */}
      <StatusBar
        barStyle="dark-content"  // dark icons
        backgroundColor="white"   // Android only
      />

      <NavigationContainer
        ref={navigationRef}
        onStateChange={() => {
          // optional: handle navigation state changes
        }}
      >
        <AppNavigator navigationRef={navigationRef} />
      </NavigationContainer>
    </>
  );
}


