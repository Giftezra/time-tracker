import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View } from "react-native";
import LoginComponent from "./component/helper/login";
import OnboardingPageComponent from "./management/onboarding/onboarding";
import AuthProvider from "./context/authentication";
import ProfileProvider from "./context/management/profile/profileContext";

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
      <AuthProvider>
        <ProfileProvider>
          <OnboardingPageComponent />
        </ProfileProvider>
      </AuthProvider>
    </View>
  );
}
