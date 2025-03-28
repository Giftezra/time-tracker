import { Stack } from "expo-router";
import AuthProvider from "./authentication";
import NotificationProvider from "./context/management/notifications/notificationContext";

export default function RootLayout() {
  return (
    <NotificationProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </NotificationProvider>
  );
}
