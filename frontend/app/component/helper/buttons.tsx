import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

const ButtonComponent = ({
  onPress,
  title,
}: {
  title: string;
  onPress?: () => void;
}) => {
  const button = useThemeColor({}, "inactivebtn");
  const highlight = useThemeColor({}, "highlight");
  const text = useThemeColor({}, "text");

  return (
    <TouchableOpacity
      style={[
        styles.mainContainer,
        { backgroundColor: button, borderBlockColor: highlight },
      ]}
      onPress={onPress}
    >
      <Text style={[styles.buttonText, { color: text }]}>{title}</Text>
    </TouchableOpacity>
  );
};

export default ButtonComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    marginTop: 10,
    borderRadius: 5,
    borderWidth: 1,
    marginHorizontal: 1,
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.4,
    padding: Platform.OS === "web" ? 5 : 10,
  },

  buttonText: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
