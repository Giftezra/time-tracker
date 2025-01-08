import { StyleSheet, Text, TextInput, Touchable, View } from "react-native";
import React, { useState } from "react";
import { TouchableOpacity } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";

import { ClientDetail } from "../../../types/management/client";

const AddClientComponent = () => {
  const [clientDetails, setClientDetails] = useState<ClientDetail>();

  /**
   * Returns a {View} component that displays a form used to registe a new client.
   * The form contains the required fields to register a new client.
   */
  return (
    <View style={styles.mainContainer}>
      {/* Contains the button to exit the view */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>register new client</Text>
      </View>
      {/* Contains the text inpputs and button */}
      <View style={styles.container}>
        <View style={styles.containers}>
          <Text style={styles.headers}>company name</Text>
          <TextInput
            placeholder="company name"
            style={styles.inputs}
            importantForAutofill="yes"
          />
        </View>
        <View style={styles.containers}>
          <Text style={styles.headers}>company email</Text>
          <TextInput
            placeholder="company email"
            style={styles.inputs}
            importantForAutofill="yes"
            autoComplete="email"
            inputMode="email"
          />
        </View>
        <View style={styles.containers}>
          <Text style={styles.headers}>company phone</Text>
          <TextInput
            placeholder="company phone"
            style={styles.inputs}
            inputMode="tel"
            importantForAutofill="yes"
            autoComplete="tel"
          />
        </View>
        <View style={styles.containers}>
          <Text style={styles.headers}>company address</Text>
          <TextInput
            placeholder="company address"
            style={styles.inputs}
            importantForAutofill="yes"
            autoComplete="street-address"
          />
        </View>
        {/* Postcode is displayed to handle address search up */}
        <View style={styles.containers}>
          <Text style={styles.headers}>company postcode</Text>
          <View style={styles.postcodeContainer}>
            <TextInput
              placeholder="company postcode"
              style={styles.inputs}
              importantForAutofill="yes"
              autoComplete="postal-code"
            />
            <TouchableOpacity style={styles.findaddressButton}>
              <Text>find postcode</Text>
            </TouchableOpacity>
          </View>
        </View>
        <View style={styles.containers}>
          <Text style={styles.headers}>company city</Text>
          <TextInput placeholder="company city" style={styles.inputs} />
        </View>
        <View style={styles.containers}>
          <Text style={styles.headers}>company country</Text>
          <TextInput placeholder="company country" style={styles.inputs} />
        </View>
        <TouchableOpacity style={styles.registerbutton}>
          <Text style={styles.registerButtonText}>register</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AddClientComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 15,
    marginHorizontal: 5,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  container: {
    width: "100%",
    flexDirection: "column",
    padding: 5,
    marginVertical: 5,
  },

  containers: {
    width: "100%",
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 5,
  },

  headers: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    marginBottom: 2,
    marginStart: 2,
  },

  inputs: {
    padding: 8,
    borderWidth: 0.5,
    borderRadius: 5,
    marginVertical: 5,
  },

  postcodeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  findaddressButton: {
    padding: 9,
    backgroundColor: "#2b94b8",
    alignItems: "center",
    borderRadius: 5,
  },

  registerbutton: {
    padding: 10,
    backgroundColor: "#2b94b8",
    alignItems: "center",
    alignSelf: "center",
    width: "50%",
    marginTop: 10,
    borderRadius: 2,
  },

  registerButtonText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "bold",
    textTransform: "uppercase",
  },

  closeIcon: {
    padding: 5,
    margin: 5,
    borderRadius: 30,
    borderWidth: 1,
  },
});
