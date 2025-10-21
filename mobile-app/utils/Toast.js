import React, { useState, useEffect } from "react";
import { Animated, Text, StyleSheet, Dimensions } from "react-native";

export default function Toast({ message, duration = 3000, onHide }) {
  const [fadeAnim] = useState(new Animated.Value(0));

  useEffect(() => {
    // Fade in
    Animated.timing(fadeAnim, {
      toValue: 1,
      duration: 300,
      useNativeDriver: true,
    }).start();

    // Fade out after duration
    const timeout = setTimeout(() => {
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 500,
        useNativeDriver: true,
      }).start(() => onHide && onHide());
    }, duration);

    return () => clearTimeout(timeout);
  }, []);

  return (
    <Animated.View
      style={[
        styles.toast,
        {
          opacity: fadeAnim,
          bottom: -200, // adjust vertical position
          left: 20,   // adjust horizontal position
        },
      ]}
    >
      <Text style={styles.text}>{message}</Text>
    </Animated.View>
  );
}

const styles = StyleSheet.create({
  toast: {
    position: "absolute",
    backgroundColor: "rgba(100,100,255,0.9)", // light blue
    paddingVertical: 10,
    paddingHorizontal: 15,
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
    elevation: 3,
    maxWidth: Dimensions.get("window").width * 0.8,
  },
  text: { color: "#fff", fontWeight: "600" },
});
