import { Stack } from "expo-router";
import LocationProvider from "./context/management/LocationProvider";
import NotificationProvider from "./context/management/notifications/notificationContext";
import AuthProvider from "./authentication";
export default function RootLayout() {
  return <Stack screenOptions={{ headerShown: false }} />;
}
