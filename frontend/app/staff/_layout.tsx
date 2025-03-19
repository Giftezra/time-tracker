import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import AuthProvider from "../context/authentication";
import { Stack } from "expo-router";
import ProfileProvider from "../context/management/profile/profileContext";
import NotificationProvider from "../context/management/notificationProvider";
const MainStaffMainLayout = () => {
  return (
    <AuthProvider>
      <NotificationProvider>
        <ProfileProvider>
          <Stack screenOptions={{ headerShown: false }} />
        </ProfileProvider>
      </NotificationProvider>
    </AuthProvider>
  );
};

export default MainStaffMainLayout;

const styles = StyleSheet.create({});
