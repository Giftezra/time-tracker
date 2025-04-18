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
import RegisterCompanyComponent from "@/app/management/onboarding/registerCompany";

const SideComponent = ({ closeDrawer }: { closeDrawer?: () => void }) => {
  const {
    screenWidth,
    windowWidth,
    signOut,
    role,
    setPreferredRole,
    user,
    setIsRegisterCompany,
  } = useAuth();

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
    router.push("/management/(drawer)/profile/ManagementProfile");
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
      {/* Only display this when the user is an owner and the user is not an employee */}
      {user?.is_owner && (
        <TouchableOpacity
          style={styles.createCompanyButton}
          onPress={() => {
            setIsRegisterCompany(true);
            closeDrawer?.();
          }}
        >
          <Text style={[styles.createCompanyButtonText, { color: text }]}>
            create company
          </Text>
        </TouchableOpacity>
      )}

      {/* Contains the views for the buttons in the side component  */}
      <View style={styles.containers}>
        <Text style={[styles.headerTexts, { color: otherText }]}>tools</Text>
        <View style={styles.innerContainer}>
          <TouchableOpacity
            style={styles.buttons}
            onPress={() => {
              router.push("/management/(drawer)/dashboard/ManagementDashboard");
              closeDrawer?.();
            }}
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
            onPress={() => {
              router.push("/management/(drawer)/task/ManagementTask");
              closeDrawer?.();
            }}
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
            onPress={() => {
              router.push("/management/(drawer)/calendar/ManagementCalendar");
              closeDrawer?.();
            }}
          >
            <MaterialIcons name="calendar-month" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>calendar</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => {
              router.push("/management/(drawer)/client/ManagementClient");
              closeDrawer?.();
            }}
          >
            <MaterialIcons name="cases" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>client</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => {
              router.push("/management/(drawer)/employee/ManagementEmployee");
              closeDrawer?.();
            }}
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
            onPress={() => {
              router.push(
                "/management/(drawer)/notification/ManagementNotification"
              );
              closeDrawer?.();
            }}
          >
            <MaterialIcons name="notifications" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>
                notification
              </Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => {
              handleProfileRoute();
              closeDrawer?.();
            }}
          >
            <AntDesign name="profile" size={20} color={icon} />
            {/* Conditionally render the texts when the window width is over 50% */}
            {windowWidth >= screenWidth / 2 && (
              <Text style={[styles.buttonText, { color: text }]}>profile</Text>
            )}
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.buttons}
            onPress={() => {
              router.push("/management/(drawer)/messages/ManagementMessages");
              closeDrawer?.();
            }}
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

      <TouchableOpacity
        style={styles.signoutContainer}
        onPress={() => {
          signOut();
          closeDrawer?.();
        }}
      >
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
  createCompanyButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    borderRadius: 10,
    backgroundColor: "rgba(0,0,0,0.1)",
  },
  createCompanyButtonText: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    letterSpacing: 0.4,
  },
});
