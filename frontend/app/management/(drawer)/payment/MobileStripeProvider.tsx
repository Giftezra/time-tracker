import { StyleSheet, Text, View } from "react-native";
import { StripeProvider } from "@stripe/stripe-react-native";
import React from "react";
import Constants from "expo-constants";
import * as Linking from "expo-linking";

// Get the publishable key from the Expo config
const publishableKey =
  Constants.expoConfig?.extra?.stripe?.publishableKey ||
  Constants.expoConfig?.plugins?.find(
    (plugin: any) => plugin[0] === "@stripe/stripe-react-native"
  )?.[1]?.publishableKey ||
  "";

// Add error handling for missing publishable key
if (!publishableKey) {
  console.warn("Missing Stripe publishable key");
}

export default function MobileStripeProvider(
  props: Omit<
    React.ComponentProps<typeof StripeProvider>,
    "publishableKey" | "merchantIdentifier"
  >
) {
  return (
    <StripeProvider
      publishableKey={publishableKey}
      merchantIdentifier="merchant.com.time-tracker"
      urlScheme={Linking.createURL("/")?.split("://")?.[0]}
      {...props}
    />
  );
}
