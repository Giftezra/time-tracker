import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

const PopupButton = ({
  text,
  onPress,
}: {
  text: string;
  onPress: () => void;
}) => {
  const backgroundColor = useThemeColor({}, "background");
  const textColor = useThemeColor({}, "text");

  return (
    <View style={styles.overlay}>
      <TouchableOpacity
        onPress={onPress}
        style={[styles.button, { backgroundColor }]}
      >
        <Text style={[styles.text, { color: textColor }]}>{text}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default PopupButton;

const styles = StyleSheet.create({
  overlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 200,
    justifyContent: "center",
    alignItems: "center",
  },

  button: {
    padding: 8,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.5,
    alignItems: "center",
    borderRadius: 20,
  },

  text: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },
});
