import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

const MainOnboardingLayout = () => {
  return (
    <Stack>
      <Stack.Screen name="login" options={{ headerShown: false }} />
      <Stack.Screen name="registration" options={{ headerShown: false }} />
      <Stack.Screen
        name="registrationAddressPage"
        options={{ headerShown: false }}
      />
      <Stack.Screen name="onboard" options={{ headerShown: false }} />
      <Stack.Screen name="registerCompany" options={{ headerShown: false }} />
    </Stack>
  );
};

export default MainOnboardingLayout;

const styles = StyleSheet.create({});
