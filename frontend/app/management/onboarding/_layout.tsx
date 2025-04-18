import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const MainOnboardingLayout = () => {
  return (
    <Stack screenOptions={{ headerShown: true }}>
      <Stack.Screen name="login" options={{ headerShown: true }} />
      <Stack.Screen name="registration" options={{ headerShown: true }} />
      <Stack.Screen
        name="registrationAddressPage"
        options={{ headerShown: true }}
      />
      <Stack.Screen name="onboard" options={{ headerShown: true }} />
      <Stack.Screen name="registerCompany" options={{ headerShown: true }} />
    </Stack>
  );
};

export default MainOnboardingLayout;

const styles = StyleSheet.create({});
