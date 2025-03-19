import { StyleSheet, Text, View, TextInput } from "react-native";
import React, { useState } from "react";
import { useCheckout } from "@/app/context/management/checkout/checkoutContext";

const BillingAddressComponent = () => {
  const { billingAddress, handleBillingAddress } =
    useCheckout();

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Billing Address</Text>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Full Name</Text>
        <TextInput
          style={styles.input}
          value={billingAddress.fullName}
          onChangeText={(value) => handleBillingAddress("fullName", value)}
          placeholder="Enter your full name"
        />
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Address</Text>
        <TextInput
          style={styles.input}
          value={billingAddress.address}
          onChangeText={(value) => handleBillingAddress("address", value)}
          placeholder="Apartment, suite, unit, etc."
        />
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>City</Text>
          <TextInput
            style={styles.input}
            value={billingAddress.city}
            onChangeText={(value) => handleBillingAddress("city", value)}
            placeholder="City"
          />
        </View>

        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Postcode</Text>
          <TextInput
            style={styles.input}
            value={billingAddress.postcode}
            onChangeText={(value) => handleBillingAddress("postcode", value)}
            placeholder="Postcode"
          />
        </View>
      </View>

      <View style={styles.row}>
        <View style={[styles.formGroup, styles.halfWidth]}>
          <Text style={styles.label}>Country</Text>
          <TextInput
            style={styles.input}
            value={billingAddress.country}
            onChangeText={(value) => handleBillingAddress("country", value)}
            placeholder="Country"
          />
        </View>
      </View>

      <View style={styles.formGroup}>
        <Text style={styles.label}>Phone Number</Text>
        <TextInput
          style={styles.input}
          value={billingAddress.phone}
          onChangeText={(value) => handleBillingAddress("phone", value)}
          placeholder="Enter your phone number"
          keyboardType="phone-pad"
        />
      </View>
    </View>
  );
};

export default BillingAddressComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
    backgroundColor: "#fff",
  },
  title: {
    fontSize: 14,
    fontWeight: "700",
    marginBottom: 20,
    fontFamily: "BarlowRegular",
  },
  formGroup: {
    marginBottom: 10,
  },
  label: {
    fontSize: 15,
    marginBottom: 8,
    color: "#666",
    fontFamily: "BarlowLight",
    fontWeight: "600",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 5,
    padding: 12,
    fontSize: 14,
    backgroundColor: "#f9f9f9",
    fontFamily: "BarlowRegular",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
  },
  halfWidth: {
    flex: 1,
  },
});
