import { Stack } from "expo-router";
import AuthProvider from "./context/authentication";
import ProfileProvider from "./context/management/profile/profileContext";

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }} />
  );
}
