import {
  Platform,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

const SearchInputContainer = ({
  onPress,
  value,
  setValue,
  placeholder,
}: {
  onPress?: () => void;
  value?: string;
  setValue?: (value: string) => void;
  placeholder?: string;
}) => {
  const text = useThemeColor({}, "text");
  const textinput = useThemeColor({}, "textinput");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const highlight = useThemeColor({}, "highlight");
  const secondaryColor = useThemeColor({}, "secondaryColor");

  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={[styles.maincontainr]}>
      <View style={[styles.iconheader]}>
        <Text style = {[styles.headerText, {color:'black'}]}>{isFocused && 'search'}</Text>
      </View>
      <View style={styles.inputContainer}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          style={[styles.textinput, {backgroundColor:textinput}]}
          onFocus={() => setIsFocused(true)}
        />

        <TouchableOpacity
          onPress={onPress}
          style={[styles.buttons, { backgroundColor: inactivebtn }]}
        >
          <Text style={[styles.buttontext,{ color: 'text' }]}>Search</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default SearchInputContainer;

const styles = StyleSheet.create({
  maincontainr: {
    width: "100%",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 2,
    borderRadius: 5,
    paddingTop: 10,
  },

  iconheader: {
    position: "absolute",
    top: 2,
    left: 10,
    zIndex: 100,
    marginTop: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 2
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 10 : 12,
    fontWeight: "700",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },

  inputContainer: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderWidth: 1,
  },

  textinput: {
    flexGrow: 1,
    padding: Platform.OS === "web" ? 5 : 10,
    fontSize: Platform.OS === "web" ? 10 : 14,
    textTransform: "lowercase",
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  },

  buttons: {
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
  },

  buttontext:{
    fontSize: Platform.OS === "web" ? 10 : 14,
    textTransform: "capitalize",
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  }
});
