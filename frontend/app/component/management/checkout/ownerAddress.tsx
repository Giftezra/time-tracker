import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
// import { useCheckout } from "@/app/context/management/checkout/checkoutContext";
import { AntDesign } from "@expo/vector-icons";
import { useCheckout } from "@/app/context/management/checkout/checkoutContext";

const OwnerAddressComponent = () => {
  const { ownerAddress, useOwnerAddress, setUseOwnerAddress } = useCheckout();

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <Text style={styles.addressTextBold}>Personal Address</Text>
      <View style={styles.container}>
        {ownerAddress?.address ? (
          <View style={styles.addressContainer}>
            <Text style={styles.addressText}>{ownerAddress.address}</Text>
            <Text style={[styles.addressText]}>{ownerAddress.postcode}</Text>
            <Text style={styles.addressText}>{ownerAddress.city}</Text>
            <Text style={styles.addressText}>{ownerAddress.country}</Text>
            <Text style={styles.addressText}>{ownerAddress.phone}</Text>
          </View>
        ) : (
          <Text style={styles.addressText}>No address found</Text>
        )}

        {ownerAddress?.address && (
          <View style={styles.checkboxContainer}>
            <Pressable
              style={styles.checkbox}
              onPress={() => setUseOwnerAddress(!useOwnerAddress)}
            >
              <View
                style={[
                  styles.innerCheckbox,
                  useOwnerAddress && { display: "flex" },
                ]}
              >
                <AntDesign name="check" size={24} color="black" />
              </View>
            </Pressable>
          </View>
        )}
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
    width:  30,
    height: 30,
    borderWidth: 2,
    borderRadius: 30,
    justifyContent: "center",
    alignItems: "center",
  },

  innerCheckbox: {
    width: 30,
    height: 30,
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

  checkboxLabel: {
    marginLeft: 8,
    fontSize: 14,
    fontFamily: "BarlowRegular",
  },
});
