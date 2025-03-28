import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View } from "react-native";
import OnboardingPageComponent from "./management/onboarding/onboard";

export default function Index() {
  const primary = useThemeColor({}, "primaryColor");

  return (
    <View
      style={[
        {
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
        },
        { backgroundColor: primary },
      ]}
    >
      <OnboardingPageComponent />
    </View>
  );
}
