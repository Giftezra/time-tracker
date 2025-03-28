import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

import AuthProvider from "@/app/authentication";
import ProfileProvider from "@/app/context/management/profile/profileContext";
import NotificationProvider from "@/app/context/management/notifications/notificationContext";
const MainManagementLayout = () => {
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

export default MainManagementLayout;

const styles = StyleSheet.create({});
