import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import NotificationProvider from "@/app/context/management/notifications/notificationContext";

const MainStaffNotificationLayout = () => {
  return (
    <NotificationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StaffNotification" />
      </Stack>
    </NotificationProvider>
  );
};

export default MainStaffNotificationLayout;

const styles = StyleSheet.create({});
