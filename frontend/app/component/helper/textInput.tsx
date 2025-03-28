import { Platform, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

const TextInputComponent = ({
  text,
  placeholder,
  value,
  setValue,
  isMultiline,
  lines,
  secureTextEntry,
  autoComplete,
  editable,
  keyboardType,
}: {
  text: string;
  placeholder: string | undefined;
  value?: string;
  setValue?: (value: string) => void;
  isMultiline?: boolean;
  lines?: number;
  secureTextEntry?: boolean;
  autoComplete?:
    | "additional-name"
    | "address-line1"
    | "address-line2"
    | "birthdate-day"
    | "birthdate-full"
    | "birthdate-month"
    | "birthdate-year"
    | "cc-csc"
    | "cc-exp"
    | "cc-exp-day"
    | "cc-exp-month"
    | "cc-exp-year"
    | "cc-number"
    | "email"
    | "family-name"
    | "given-name"
    | "honorific-prefix"
    | "honorific-suffix"
    | "name"
    | "nickname"
    | "off"
    | "one-time-code"
    | "organization"
    | "password"
    | "postal-code"
    | "street-address"
    | "tel"
    | "tel-country-code"
    | "tel-national"
    | "tel-device"
    | "username"
    | undefined;
  keyboardType?:
    | "url"
    | "twitter"
    | "email-address"
    | "number-pad"
    | "decimal-pad"
    | "numeric"
    | "phone-pad"
    | "visible-password"
    | "ascii-capable"
    | "numbers-and-punctuation"
    | "url"
    | "name-phone-pad"
    | "decimal-pad"
    | "email-address"
    | "twitter"
    | "web-search"
    | undefined;
  editable?: boolean;
}) => {
  const textinput = useThemeColor({}, "textinput");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const [isFocused, setIsFocused] = useState(false);

  return (
    <View style={styles.mainContainer}>
      <View
        style={[
          styles.textheader,
          { backgroundColor: isFocused || value ? textinput : "transparent" },
        ]}
      >
        <Text style={[styles.text, { color: secondaryColor }]}>
          {isFocused || value ? text : ""}
        </Text>
      </View>
      <View style={[styles.textInputContainer, { backgroundColor: textinput }]}>
        <TextInput
          value={value}
          onChangeText={setValue}
          placeholder={placeholder}
          style={[styles.textInput]}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          multiline={isMultiline}
          numberOfLines={lines}
          secureTextEntry={secureTextEntry}
          autoComplete={autoComplete}
          importantForAutofill={autoComplete ? "yes" : "no"}
          editable={editable}
          keyboardType={keyboardType}
        />
      </View>
    </View>
  );
};

export default TextInputComponent;

const styles = StyleSheet.create({
  mainContainer: {
    paddingTop: 10,
    marginHorizontal: 1,
    position: "relative",
  },

  text: {
    fontSize: Platform.OS === "web" ? 10 : 12,
    textTransform: "capitalize",
    fontFamily: "BarlowRegular",
    fontWeight: "700",
  },

  textheader: {
    position: "absolute",
    top: 14,
    left: 20,
    zIndex: 100,
    paddingHorizontal: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  textInputContainer: {
    borderWidth: 1,
    flexDirection: "row",
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },

  textInput: {
    width: "100%",
    padding: 10,
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
  },
});
