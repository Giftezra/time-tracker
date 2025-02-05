import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import CheckoutProvider from "@/app/context/management/checkout/checkoutContext";
import { StripeProvider } from "@stripe/stripe-react-native";
import { useAuth } from "@/app/context/management/authentication";

const PaymentLayout = () => {
  return (
    <CheckoutProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </CheckoutProvider>
  );
};

export default PaymentLayout;

const styles = StyleSheet.create({});
