import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@/app/context/management/authentication";
import { userData } from "@/app/utils/loadData";
import UserDetailsComponent from "../management/profile/user details";

const SideIconComponent = () => {
  const [isHideNav, setIsHideNav] = useState<boolean>(false);
  const [profilePopup, setProfilePopup] = useState<boolean>(false);

  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const highlight = useThemeColor({}, "highlight");

  const toggleIshideNav = () => setIsHideNav(!isHideNav);

  const { signOut } = useAuth();
  const user = userData();

  /** Handles the user profile display route given the user role */
  const handleProfileRoute = () => {
    if (user?.is_owner) {
      router.push("/management/(drawer)/profile/main");
    } else {
      setProfilePopup(true);
    }
  };
  return (
    <View style={styles.mainContainer}>
      {/* Logo container */}
      <View style={styles.logoContainer}>
        <Text>LOGO</Text>
      </View>

      {/* Scrollable content */}
      <ScrollView contentContainerStyle={styles.scrollContainer}>
        {/* Contains the views for the buttons in the side component  */}
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/dashboard/main")}
          >
            <MaterialIcons name="dashboard" size={20} color={icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/task/main")}
          >
            <MaterialIcons name="track-changes" size={20} color={icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/messages/main")}
          >
            <MaterialIcons name="all-inbox" size={20} color={icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/calendar/main")}
          >
            <MaterialIcons name="calendar-month" size={20} color={icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/client/main")}
          >
            <MaterialIcons name="cases" size={20} color={icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/employee/main")}
          >
            <AntDesign name="user" size={20} color={icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttons} onPress={handleProfileRoute}>
            <AntDesign name="profile" size={20} color={icon} />
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/settings/main")}
          >
            <MaterialIcons name="settings" size={20} color={icon} />
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttons} onPress={signOut}>
            <MaterialIcons name="logout" size={20} color={icon} />
          </TouchableOpacity>
        </View>
      </ScrollView>
      {profilePopup && (
        <UserDetailsComponent onModalVisible={() => setProfilePopup(false)} />
      )}
    </View>
  );
};

export default SideIconComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    marginTop: 40,
  },

  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "ios" ? 5 : 10,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  buttonContainer: {
    flex: 1,
    justifyContent: "space-between",
    flexDirection: "column",
    marginVertical: 10,
  },

  buttons: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "ios" ? 10 : 5,
    marginTop: 5,
  },

  buttonText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 12 : 15,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    padding: 5,
    marginVertical: 10,
    alignSelf: "center",
  },
});
