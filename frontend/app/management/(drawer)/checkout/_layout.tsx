import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/app/context/authentication";
import CheckoutContextProvider from "@/app/context/management/checkout/checkoutContext";

const PaymentLayout = () => {
  const publishableKey = "dhgfgfkjgf";
  return (
    <CheckoutContextProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CheckoutContextProvider>
  )
};

export default PaymentLayout;

const styles = StyleSheet.create({});
