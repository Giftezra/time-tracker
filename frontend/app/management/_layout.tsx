import { KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";

import AuthProvider from "@/app/authentication";
import ProfileProvider from "@/app/context/management/profile/profileContext";
import NotificationProvider from "@/app/context/management/notifications/notificationContext";
import LocationProvider from "@/app/context/management/LocationProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
const MainManagementLayout = () => {
  return (
    <AuthProvider>
      <LocationProvider>
        <NotificationProvider>
          <ProfileProvider>
            <SafeAreaProvider>
              <GestureHandlerRootView>
            <KeyboardAvoidingView style={{ flex: 1 }}>
              <Stack>
                <Stack.Screen
                  name="(drawer)"
                  options={{ headerShown: false }}
                />
                <Stack.Screen
                  name="onboarding"
                  options={{ headerShown: false }}
                />
              </Stack>
            </KeyboardAvoidingView>
          </GestureHandlerRootView>
              </SafeAreaProvider>
            </ProfileProvider>
          </NotificationProvider>
        </LocationProvider>
      </AuthProvider>
  );
};

export default MainManagementLayout;

const styles = StyleSheet.create({});
