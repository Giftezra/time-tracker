import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import { useCheckout } from "@/app/context/management/checkout/checkoutContext";
import { AntDesign } from "@expo/vector-icons";
import { userData } from "@/app/utils/loadData";

const OwnerAddressComponent = () => {
  const { handleCheckboxPress, isChecked } = useCheckout();
  const  user  = userData();

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <Text style={styles.addressTextBold}>personal</Text>
      <View style={styles.container}>
        {user && (
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>
              {user.address || "No address found"}
            </Text>
            <Text style={styles.addressText}>
              {user.postcode || "No postcode found"}
            </Text>
            <Text style={styles.addressText}>
              {user.city || "No city found"}
            </Text>
            <Text style={styles.addressText}>
              {user.country || "No country found"}
            </Text>
          </View>
        )}
        {/* This view contains the address details and a checkbox to select the address */}

        {/* Checkbox to select the address */}
        <View style={styles.checkboxContainer}>
          <Pressable style={styles.checkbox} onPress={handleCheckboxPress}>
            <View
              style={[
                styles.innerCheckbox,
                isChecked ? { display: "flex" } : { display: "none" },
              ]}
            >
              <AntDesign name="check" size={24} color="white" />
            </View>
          </Pressable>
        </View>
      </View>
    </GestureHandlerRootView>
  );
};

export default OwnerAddressComponent;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    flex: 1,
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    borderWidth: 1,
    borderColor: "gray",
  },

  addressContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 1,
  },

  checkboxContainer: {
    flexDirection: "column",
    alignItems: "flex-start",
    padding: 10,
  },

  checkbox: {
    width: 40,
    height: 40,
    borderWidth: 2,
    borderColor: "#000",
    borderRadius: 4,
    justifyContent: "center",
    alignItems: "center",
  },

  innerCheckbox: {
    width: 40,
    height: 40,
    backgroundColor: "#000",
    borderRadius: 2,
    justifyContent: "center",
    alignItems: "center",
    display: "none",
  },

  addressText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "lowercase",
  },

  addressTextBold: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    marginVertical: 5,
  },
});
