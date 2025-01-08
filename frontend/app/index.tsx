import { useThemeColor } from "@/hooks/useThemeColor";
import { Text, View } from "react-native";
import LoginComponent from "./component/helper/login";
import OnboardingPage from "./management/onboarding/onboarding";
import AuthProvider from "./context/management/authentication";
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
          <OnboardingPage />
        </ProfileProvider>
      </AuthProvider>
    </View>
  );
}
