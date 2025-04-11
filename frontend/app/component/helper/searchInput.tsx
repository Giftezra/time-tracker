import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import TextInputComponent from "./textInput";

const SearchInputContainer = ({
  onPress,
  value,
  setValue,
  placeholder,
  text,
}: {
  onPress?: () => void;
  value?: string;
  setValue?: (value: string) => void;
  placeholder?: string;
  text?: string;
}) => {
  const inactivebtn = useThemeColor({}, "inactivebtn");

  return (
    <View style={styles.maincontainr}>
      <View style={styles.inputContainer}>
        <View style={styles.overlayTextContainer}>
          <Text style={styles.overlayText}>{text}</Text>
        </View>
        <TextInput
          style={styles.textinput}
          placeholder={placeholder}
          value={value}
          onChangeText={setValue}
        />
        <TouchableOpacity
          onPress={onPress}
          style={[styles.buttons, { backgroundColor: inactivebtn }]}
        >
          <Text style={styles.buttontext}>Search</Text>
        </TouchableOpacity>

      </View>
    </View>
  );
};

export default SearchInputContainer;

const styles = StyleSheet.create({
  maincontainr: {
    width: "100%",
    marginVertical: 10,
    borderRadius: 5,
  },

  inputContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
  },

  textinput: {
    flex: 1,
    padding: Platform.OS === "web" ? 8 : 10,
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  },

  buttons: {
    alignItems: "center",
    padding: Platform.OS === "web" ? 8 : 10,
    borderTopRightRadius: 5,
    borderBottomRightRadius: 5,
  },

  buttontext: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    textTransform: "capitalize",
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    color: "#fff",
  },
  overlayText:{
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    fontSize: 14,
    letterSpacing: 0.5,
  },
  overlayTextContainer: {
    position: "absolute",
    left: 30,
    top: -10,
  },
});
