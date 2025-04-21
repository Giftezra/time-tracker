/**
 * Main entry point of the application.
 * This component serves as the root screen and implements:
 * - Theme support through useThemeColor hook
 * - Primary layout structure with full width and height
 * - Onboarding flow for new users
 */
import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View } from "react-native";
import OnboardingPageComponent from "./management/onboarding/onboard";

export default function Index() {
  // Get the primary color from the theme system
  const primary = useThemeColor({}, "primaryColor");

  return (
    <View
      style={[
        {
          flex: 1,
          width: "100%",
          height: "100%",
        },
        { backgroundColor: primary },
      ]}
    >
      {/* Render the onboarding component for new user flow */}
      <OnboardingPageComponent />
    </View>
  );
}
