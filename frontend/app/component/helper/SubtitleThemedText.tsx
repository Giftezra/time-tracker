import { StyleSheet, Text, View } from "react-native";
import React from "react";

const SubtitleThemedText = ({ text }: { text: string }) => {
  return <Text style={styles.text}>{text}</Text>;
};

export default SubtitleThemedText;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    lineHeight: 18,
    letterSpacing: 0.8,
    color: "#000",
  },
});
