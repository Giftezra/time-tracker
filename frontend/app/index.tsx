import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View } from "react-native";
import LoginComponent from "./component/helper/login";
import OnboardingPageComponent from "./management/onboarding/onboard";

import * as Location from "expo-location";

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
