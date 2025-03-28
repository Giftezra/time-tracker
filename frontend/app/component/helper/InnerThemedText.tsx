import { StyleSheet, Text, View } from "react-native";
import React from "react";

const InnerThemedText = ({ text }: { text?: string }) => {
  return <Text style={styles.text}>{text}</Text>;
};

export default InnerThemedText;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  text: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    lineHeight: 18,
    letterSpacing: 0.5,
  },
});
