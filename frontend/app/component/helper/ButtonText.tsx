import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ButtonText = ({ text }: { text: string }) => {
  return (
      <Text style={styles.text}>{text}</Text>
  );
};

export default ButtonText;

const styles = StyleSheet.create({
  text: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },
});
