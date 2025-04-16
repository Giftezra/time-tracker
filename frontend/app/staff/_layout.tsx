import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import AuthProvider from "@/app/authentication";
import { Stack } from "expo-router";
import ProfileProvider from "@/app/context/management/profile/profileContext";
import NotificationProvider from "@/app/context/management/notifications/notificationContext";
import LocationProvider from "../context/management/LocationProvider";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const MainStaffMainLayout = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <NotificationProvider>
          <ProfileProvider>
            <GestureHandlerRootView style={{ flex: 1 }}>
              <Stack screenOptions={{ headerShown: false }}>
                <Stack.Screen name="(drawer)" />
              </Stack>
            </GestureHandlerRootView>
          </ProfileProvider>
        </NotificationProvider>
      </LocationProvider>
    </AuthProvider>
  );
};

export default MainStaffMainLayout;

const styles = StyleSheet.create({});
