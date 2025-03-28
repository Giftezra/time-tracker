import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ThemedHeaderText = ({ text }: { text: string }) => {
  return <Text style={styles.text}>{text}</Text>;
};

export default ThemedHeaderText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  text: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "BarlowLight",
    textTransform: "uppercase",
    lineHeight: 24,
    letterSpacing: 2,
  },
});
