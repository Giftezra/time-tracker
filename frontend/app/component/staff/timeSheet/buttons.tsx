import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { AntDesign } from "@expo/vector-icons";

const ButtonsComponent = ({
  title,
  color,
  icon,
  onPress,
}: {
  title?: string;
  color?: string;
  icon?: React.ReactNode;
  onPress?: () => void;
}) => {
  return (
    <Pressable
      style={[styles.button, { backgroundColor: color }]}
      onPress={onPress}
    >
      {icon}
      <Text>{title}</Text>
      <Text>{title}</Text>
    </Pressable>
  );
};

export default ButtonsComponent;

const styles = StyleSheet.create({
  button: {
    flex: 1,
    flexDirection: "row",
    padding: 2,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 2,
    borderWidth: 0.2,
    columnGap: 5,
  },
});
