import { StyleSheet } from "react-native";
import React, { useEffect, useState } from "react";
import { Stack } from "expo-router";
import { useAuth } from "@/app/context/authentication";
import PaymentContext from "@/app/context/management/payments/paymentContext";

const PaymentLayout = () => {
  const publishableKey = "dhgfgfkjgf";
  return (
    <PaymentContext>
      <Stack screenOptions={{ headerShown: false }} />
    </PaymentContext>
  );
};

export default PaymentLayout;

const styles = StyleSheet.create({});
