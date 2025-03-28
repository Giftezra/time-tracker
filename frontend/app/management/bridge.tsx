import React from "react";
import { View, StyleSheet, TouchableOpacity, Text } from "react-native";
import { router } from "expo-router";
import ButtonText from "../component/helper/ButtonText";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";

export default function BridgeScreen() {
  return (
    <GestureHandlerRootView style={styles.container}>
      <View style={styles.content}>
        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/management/(drawer)/dashboard/main")}
        >
          <Text style={styles.buttonText}>Enter as Admin</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.button}
          onPress={() => router.replace("/staff/(drawer)/dashboard/main")}
        >
          <Text style={styles.buttonText}>Enter as Staff</Text>
        </TouchableOpacity>
      </View>
    </GestureHandlerRootView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 20,
  },
  button: {
    padding: 15,
    borderRadius: 8,
    width: "100%",
    maxWidth: 300,
    alignItems: "center",
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "BarlowLight",
    lineHeight: 20,
  },
});
