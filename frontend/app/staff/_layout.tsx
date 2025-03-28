import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import AuthProvider from "@/app/authentication";
import { Stack } from "expo-router";
import ProfileProvider from "@/app/context/management/profile/profileContext";
import NotificationProvider from "@/app/context/management/notifications/notificationContext";
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
