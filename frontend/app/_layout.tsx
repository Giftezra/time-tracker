/**
 * Root layout component that sets up the basic structure and providers for the application.
 * This component wraps the entire application and provides:
 * - Safe area handling for different devices
 * - Keyboard avoiding behavior for form inputs
 * - Stack navigation setup
 * - Various context providers for app-wide functionality
 */
import { Stack } from "expo-router";
import LocationProvider from "./context/management/LocationProvider";
import NotificationProvider from "./context/management/notifications/notificationContext";
import AuthProvider from "./authentication";
import { SafeAreaView, KeyboardAvoidingView } from "react-native";
import { GestureHandlerRootView } from "react-native-gesture-handler";
export default function RootLayout() {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <KeyboardAvoidingView behavior="padding" style={{ flex: 1 }}>
          {/* Stack navigator with hidden headers for custom navigation handling */}
          <Stack screenOptions={{ headerShown: false }} />
        </KeyboardAvoidingView>
        </GestureHandlerRootView>
      </SafeAreaView>
    </AuthProvider>
  );
}
