import { StyleSheet, Text, View } from "react-native";
import React from "react";

const ButtonText = ({ text }: { text: string }) => {
  return (
    <View>
      <Text style={styles.text}>{text}</Text>
    </View>
  );
};

export default ButtonText;

const styles = StyleSheet.create({
  mainContainer: {
    flex:1
  },
  text: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    lineHeight: 24,
    letterSpacing: 0.6,
  },
});
