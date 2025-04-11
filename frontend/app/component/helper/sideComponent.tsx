import {
  ActivityIndicator,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@/app/authentication";
import { userData } from "@/app/utils/loadData";
import UserDetailsComponent from "../management/profile/user details";

const SideComponent = () => {
  const user = userData();
  const { screenWidth, windowWidth, signOut, role, setPreferredRole } =
    useAuth();

  const [profilePopup, setProfilePopup] = useState<boolean>(false);
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const otherText = useThemeColor({}, "otherText");
  const background = useThemeColor({}, "innerBackground");

  const [isAdmin, setIsAdmin] = useState(() => {
    return role === "admin";
  });

  /** Handles the user profile display route given the user role */
  const handleProfileRoute = () => {
    router.push("/management/(drawer)/profile/main");
  };

  const handleRoleSwitch = (newValue: boolean) => {
    setIsAdmin(newValue);
    setPreferredRole(newValue ? "admin" : "staff");
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: background }]}>
      {/* Logo container */}
      <View style={styles.logoContainer}>
        {windowWidth >= screenWidth / 2 && (
          <Text style={[styles.buttonText, { color: text }]}>logo</Text>
        )}
      </View>

      {/* Contains the views for the buttons in the side component  */}
      <View style={styles.containers}>
        <Text style={[styles.headerTexts, { color: otherText }]}>tools</Text>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/dashboard/main")}
          >
            <MaterialIcons name="dashboard" size={20} color={icon} />
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>
                dashboard
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/task/main")}
          >
            <MaterialIcons name="track-changes" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>
                task management
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/calendar/main")}
          >
            <MaterialIcons name="calendar-month" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>calendar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/client/main")}
          >
            <MaterialIcons name="cases" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>client</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/employee/main")}
          >
            <AntDesign name="user" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>
                employees
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.containers}>
        <Text style={[styles.headerTexts, { color: otherText }]}>Account</Text>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() =>
              router.push("/management/(drawer)/notification/main")
            }
          >
            <MaterialIcons name="notifications" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>
                notification
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity style={styles.buttons} onPress={handleProfileRoute}>
            <AntDesign name="profile" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>profile</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => router.push("/management/(drawer)/messages/main")}
          >
            <MaterialIcons name="all-inbox" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>messages</Text>
            )}
          </TouchableOpacity>
        </View>
      </View>

      {/* Add the role switch component */}
      {user?.is_admin && user?.is_employee && (
        <View style={styles.switchContainer}>
          <Text style={[styles.switchLabel, { color: text }]}>
            {isAdmin ? "Admin Mode" : "Staff Mode"}
          </Text>
          <Switch
            value={isAdmin}
            onValueChange={handleRoleSwitch}
            trackColor={{ false: "#767577", true: "#81b0ff" }}
            thumbColor={isAdmin ? "#f5dd4b" : "#f4f3f4"}
          />
        </View>
      )}

      <TouchableOpacity style={styles.signoutContainer} onPress={signOut}>
        <Text style={styles.signoutText}>
          {user?.first_name
            ? `${user.first_name} click to`
            : "Click to sign out"}
        </Text>

        <View style={styles.buttons}>
          <MaterialIcons name="logout" size={20} color={icon} />
          {/* Conditionally render the texts when the window width is over 50% */}
          {windowWidth >= screenWidth / 2 && (
            <Text style={[styles.buttonText, { color: text }]}>signout</Text>
          )}
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default SideComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 2,
  },

  logoContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "ios" ? 5 : 10,
  },

  containers: {
    flexGrow: 1,
    padding: 5,
    marginTop: 5,
  },

  innerContainer: {
    shadowOffset: { width: 0, height: 1.5 },
  },

  buttons: {
    flexDirection: "row",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
    marginTop: 5,
    columnGap: 10,
  },

  buttonText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  signoutContainer: {
    padding: 5,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1.5 },
  },

  signoutText: {
    fontSize: Platform.OS === "web" ? 10 : 14,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  headerTexts: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontWeight: "600",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    fontVariant: ["stylistic-eight"],
  },

  switchContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  switchLabel: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },
});
