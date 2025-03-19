import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

import AuthProvider from "../context/authentication";
import ProfileProvider from "../context/management/profile/profileContext";
import NotificationProvider from "../context/management/notifications/notificationContext";
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
