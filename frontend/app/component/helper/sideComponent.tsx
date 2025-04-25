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
import React, { useState, useEffect } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@/app/authentication";
import RegisterCompanyComponent from "@/app/management/onboarding/registerCompany";
import { userData } from "@/app/utils/loadData";

const SideComponent = ({ closeDrawer }: { closeDrawer?: () => void }) => {
  const {
    screenWidth,
    windowWidth,
    signOut,
    role,
    setPreferredRole,
    setIsRegisterCompany,
  } = useAuth();
  const user = userData();

  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const otherText = useThemeColor({}, "otherText");
  const accent = useThemeColor({}, "highlight");
  const [isAdmin, setIsAdmin] = useState(() => {
    return role === "admin";
  });

  // Mock state for notifications/messages - replace with real data later
  const [hasNotifications, setHasNotifications] = useState(true);
  const [hasMessages, setHasMessages] = useState(true);

  /** Handles the user profile display route given the user role */
  const handleProfileRoute = () => {
    router.push("/management/(drawer)/profile/ManagementProfile");
  };

  const handleRoleSwitch = (newValue: boolean) => {
    setIsAdmin(newValue);
    setPreferredRole(newValue ? "admin" : "staff");
  };

  return (
    <View style={[styles.mainContainer,]}>
      {/* Logo container */}
      <View
        style={[
          styles.logoContainer,
          { borderBottomWidth: 1, borderBottomColor: "rgba(0,0,0,0.1)" },
        ]}
      >
        {windowWidth >= screenWidth / 2 && (
          <Text style={[styles.logoText, { color: text }]}>LOGO</Text>
        )}
      </View>

      {/* Create company button - moved inside logo container */}
      {user?.is_owner && (
        <TouchableOpacity
          style={[styles.createCompanyButton, { backgroundColor: accent }]}
          onPress={() => {
            setIsRegisterCompany(true);
            closeDrawer?.();
          }}
        >
          <Text style={[styles.createCompanyButtonText, { color: "white" }]}>
            Create Company
          </Text>
        </TouchableOpacity>
      )}

      <ScrollView style={styles.scrollContainer}>
        {/* Contains the views for the buttons in the side component  */}
        <View style={styles.containers}>
          <Text style={[styles.headerTexts, { color: otherText }]}>tools</Text>
          <View style={styles.innerContainer}>
            <TouchableOpacity
              style={styles.buttons}
              onPress={() => {
                router.push(
                  "/management/(drawer)/dashboard/ManagementDashboard"
                );
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
                <Text style={[styles.buttonText, { color: text }]}>
                  calendar
                </Text>
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
          <Text style={[styles.headerTexts, { color: otherText }]}>
            Account
          </Text>
          <View style={styles.innerContainer}>
            {/* Notification button with indicator */}
            <TouchableOpacity
              style={styles.buttons}
              onPress={() => {
                router.push(
                  "/management/(drawer)/notification/ManagementNotification"
                );
                closeDrawer?.();
              }}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons name="notifications" size={20} color={icon} />
                {hasNotifications && (
                  <View style={[styles.dot, { backgroundColor: accent }]} />
                )}
              </View>
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
                <Text style={[styles.buttonText, { color: text }]}>
                  profile
                </Text>
              )}
            </TouchableOpacity>

            {/* Messages button with indicator */}
            <TouchableOpacity
              style={styles.buttons}
              onPress={() => {
                router.push("/management/(drawer)/messages/ManagementMessages");
                closeDrawer?.();
              }}
            >
              <View style={styles.iconContainer}>
                <MaterialIcons name="all-inbox" size={20} color={icon} />
                {hasMessages && (
                  <View style={[styles.dot, { backgroundColor: accent }]} />
                )}
              </View>
              {windowWidth >= screenWidth / 2 && (
                <Text style={[styles.buttonText, { color: text }]}>
                  messages
                </Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>

      {/* Add the role switch component */}
      {user?.is_admin && user?.is_employee && (
        <View style={[styles.switchContainer, ]}>
          <Text style={[styles.switchLabel, { color: text }]}>
            {isAdmin ? "Admin Mode" : "Staff Mode"}
          </Text>
          <Switch
            value={isAdmin}
            onValueChange={handleRoleSwitch}
            trackColor={{ false: "#767577", true: accent }}
            thumbColor={isAdmin ? "#ffffff" : "#f4f3f4"}
          />
        </View>
      )}

      <TouchableOpacity
        style={[styles.signoutContainer]}
        onPress={() => {
          signOut();
          closeDrawer?.();
        }}
      >
        <Text style={[styles.signoutText, { color: text }]}>
          {user?.first_name ? `${user.first_name}` : "Click to sign out"}
        </Text>
        <View style={styles.buttons}>
          <MaterialIcons name="logout" size={20} color={icon} />
          {/* Conditionally render the texts when the window width is over 50% */}
          {windowWidth >= screenWidth / 2 && (
            <Text style={[styles.buttonText, { color: text }]}>Sign out</Text>
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
    borderRightWidth: 1,
    borderRightColor: "rgba(0,0,0,0.1)",
  },

  scrollContainer: {
    flex: 1,
  },

  logoContainer: {
    padding: 20,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 10,
  },

  logoText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
  },

  iconContainer: {
    position: "relative",
  },

  dot: {
    position: "absolute",
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    borderRadius: 4,
    borderWidth: 1,
    borderColor: "white",
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
    padding: 12,
    marginTop: 5,
    columnGap: 12,
    borderRadius: 8,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  signoutContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 15,
    alignItems: "center",
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },

  signoutText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
    color: "white",
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
    paddingVertical: 12,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },
  switchLabel: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },
  createCompanyButton: {
    margin: 10,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  createCompanyButtonText: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    letterSpacing: 0.4,
  },
});
