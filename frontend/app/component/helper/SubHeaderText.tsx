import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

const SubHeaderText = ({ text }: { text: string }) => {
  return <Text style={styles.text}>{text}</Text>;
};

export default SubHeaderText

const styles = StyleSheet.create({
  text: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    color: "#000",
  },
});
