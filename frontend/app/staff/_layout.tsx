import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import AuthProvider from "../context/authentication";
import { Stack } from "expo-router";

const MainStaffMainLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
};

export default MainStaffMainLayout;

const styles = StyleSheet.create({});
