import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

import AuthProvider from "../context/authentication";

const MainManagementLayout = () => {
  return (
    <AuthProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </AuthProvider>
  );
};

export default MainManagementLayout;

const styles = StyleSheet.create({});
