import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/app/authentication";
import PaymentContext from "@/app/context/management/payments/paymentContext";
import MobileStripeProvider from "@/app/management/(drawer)/payment/MobileStripeProvider";

export default function PaymentLayout() {
  return (
    <MobileStripeProvider >
      <PaymentContext>
        <Stack screenOptions={{ headerShown: false }} />
      </PaymentContext>
    </MobileStripeProvider>
  );
};


const styles = StyleSheet.create({});
