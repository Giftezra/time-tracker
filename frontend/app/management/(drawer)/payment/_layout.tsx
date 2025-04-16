import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/app/authentication";
import PaymentContext from "@/app/context/management/payments/paymentContext";
import ExpoStripeProvider from "@/app/management/(drawer)/payment/ExpoStripeProvider";

export default function PaymentLayout() {
  return (
    <ExpoStripeProvider>
      <PaymentContext>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="ManagementPayment" />
          <Stack.Screen name="ExpoStripeProvider" />
        </Stack>
      </PaymentContext>
    </ExpoStripeProvider>
  );
}

const styles = StyleSheet.create({});
