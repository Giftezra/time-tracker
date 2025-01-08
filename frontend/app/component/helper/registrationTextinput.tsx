import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { TextInput } from "react-native-gesture-handler";

const RegistrationTextInputComponent = ({
  placeholder,
  value,
  setValue,
  inputMode,
  keyboardType,
  secureTextEntry,
  autoComplete,
}: {
  placeholder?: string;
  value?: string;
  setValue?: (value: string) => void;
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
  inputMode?:
    | "decimal"
    | "email"
    | "none"
    | "numeric"
    | "text"
    | "search"
    | "url"
    | "tel"
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
}) => {
  return (
    <View style={styles.maincontainer}>
      <TextInput
        placeholder={placeholder}
        value={value}
        onChangeText={setValue}
        style={[styles.input, secureTextEntry && { textTransform: 'capitalize' } ]}
        inputMode={inputMode}
        keyboardType={keyboardType}
        secureTextEntry={secureTextEntry}
        autoComplete={autoComplete}
        importantForAutofill={autoComplete ? "yes" : "no"}
      />
    </View>
  );
};

export default RegistrationTextInputComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },

  input: {
    flex: 1,
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 5,
    fontWeight: "500",
    fontSize: 15,
    fontFamily: "BarlowLight",
    textTransform: "lowercase",
  },

  placeholderStyle: {
    fontSize: 15,
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    fontWeight: "500",
    color: "#000",
  },
});
