import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import AuthProvider from "@/app/authentication";
const MainOnboardingLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: true }}>
        <Stack.Screen
          name="login"
          options={{
            headerShown: true,
            headerTitle: "Login",
            headerTitleStyle: styles.headerTitle,
            headerStyle: styles.headerStyle,
          }}
        />
        <Stack.Screen
          name="registration"
          options={{
            headerShown: true,
            headerTitle: "Registration",
            headerTitleStyle: styles.headerTitle,
            headerStyle: styles.headerStyle,
          }}
        />
        <Stack.Screen
          name="registrationAddressPage"
          options={{
            headerShown: true,
            headerTitle: "Address",
            headerTitleStyle: styles.headerTitle,
            headerStyle: styles.headerStyle,
          }}
        />
        <Stack.Screen
          name="onboard"
          options={{ headerShown: true, headerTitle: "Onboarding" }}
        />
        <Stack.Screen
          name="registerCompany"
          options={{ headerShown: true, headerTitle: "Register Company" }}
        />
      </Stack>
    </AuthProvider>
  );
};

export default MainOnboardingLayout;

const styles = StyleSheet.create({
  headerTitle: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "BarlowMedium",
    letterSpacing: 1,
    color: "black",
  },
  headerStyle: {
    backgroundColor: "white",
  },
});
