import { StyleSheet, Text, View } from "react-native";
import React from "react";

const SubtitleThemedText = ({ text }: { text: string }) => {
  return <Text style={styles.text}>{text}</Text>;
};

export default SubtitleThemedText;

const styles = StyleSheet.create({
  text: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "RobotoMedium",
    textTransform: "capitalize",
    letterSpacing: 0.4,
    color: "#000",
  },
});
