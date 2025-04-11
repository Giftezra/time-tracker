import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Switch,
  Text,
  View,
  Pressable,
  TouchableOpacity,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

import LiveEventComponent from "./liveEvent";
import { MaterialIcons } from "@expo/vector-icons";
import { user_image } from "@/app/utils/images";

import { act } from "react-test-renderer";
import { useSideComponentContext } from "@/app/context/staff/sideComponentProvider";
import { userData } from "@/app/utils/loadData";
import { useAuth } from "@/app/authentication";
import ProfileDisplayComponent from "./profileDisplay";
import { useState } from "react";

const StaffSideComponent = () => {
  const { signOut } = useAuth();
  const user = userData();

  const [isModalVisible, setModalVisible] = useState(false);

  /**
   * Set the colors for the component based on the user mobile theme.
   * Use the `useThemeColor` hook with no parameters to get the theme colors.
   * This sets the color based on the users theme
   */
  const primaryColor = useThemeColor({}, "primaryColor");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const icon = useThemeColor({}, "icon");
  const text = useThemeColor({}, "text");
  const activebtn = useThemeColor({}, "activebtn");

  const { active, handleActivity } = useSideComponentContext();
  const { role, setPreferredRole } = useAuth();
  const [isStaff, setIsStaff] = useState(() => {
    return role === "staff";
  });

  const handleRoleSwitch = (newValue: boolean) => {
    setIsStaff(newValue);
    setPreferredRole(newValue ? "staff" : "admin");
  };

  // Add navigation handling for sign out
  const handleSignOut = async () => {
    try {
      // Perform any cleanup needed before signing out
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <View style={[styles.maincontainer, { backgroundColor: secondaryColor }]}>
      <View style={[styles.headerContainer]}>
        <MaterialIcons name="calendar-today" size={24} color={icon} />
        <Text style={[styles.logoText, { color: text }]}>Logo</Text>
        <Pressable
          style={styles.profileButton}
          onPress={() => setModalVisible(true)}
        >
          <Image source={user_image} style={styles.profileImage} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollview}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.menuContainer}>
          <TouchableOpacity
            style={[
              styles.menuButton,
              active === "events" && styles.activeButton,
              {
                backgroundColor: active === "events" ? activebtn : primaryColor,
              },
            ]}
            onPress={() => handleActivity("events")}
          >
            <MaterialIcons name="event" size={22} color={icon} />
            <Text style={[styles.menuText, { color: text }]}>events</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuButton,
              active === "task" && styles.activeButton,
              { backgroundColor: active === "task" ? activebtn : primaryColor },
            ]}
            onPress={() => handleActivity("task")}
          >
            <MaterialIcons name="task" size={22} color={icon} />
            <Text style={[styles.menuText, { color: text }]}>Manage task</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuButton,
              active === "notification" && styles.activeButton,
              {
                backgroundColor:
                  active === "notification" ? activebtn : primaryColor,
              },
            ]}
            onPress={() => handleActivity("notification")}
          >
            <MaterialIcons name="notifications" size={22} color={icon} />
            <Text style={[styles.menuText, { color: text }]}>notification</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuButton,
              active === "messages" && styles.activeButton,
              {
                backgroundColor:
                  active === "messages" ? activebtn : primaryColor,
              },
            ]}
            onPress={() => handleActivity("messages")}
          >
            <MaterialIcons name="message" size={22} color={icon} />
            <Text style={[styles.menuText, { color: text }]}>messages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.menuButton,
              active === "availability" && styles.activeButton,
              {
                backgroundColor:
                  active === "availability" ? activebtn : primaryColor,
              },
            ]}
            onPress={() => handleActivity("availability")}
          >
            <MaterialIcons name="event-available" size={22} color={icon} />
            <Text style={[styles.menuText, { color: text }]}>availability</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.seeMoreSection}>
          <Text style={[styles.seeMoreTitle, { color: text }]}>see more</Text>
          <View style={styles.seeMoreGrid}>
            <TouchableOpacity
              style={[
                styles.seeMoreButton,
                active === "dashboard" && styles.activeButton,
                {
                  backgroundColor:
                    active === "dashboard" ? activebtn : primaryColor,
                },
              ]}
              onPress={() => handleActivity("dashboard")}
            >
              <MaterialIcons name="dashboard" size={24} color={icon} />
              <Text style={[styles.seeMoreButtonText, { color: text }]}>
                Dashboard
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.seeMoreButton,
                active === "timesheet" && styles.activeButton,
                {
                  backgroundColor:
                    active === "timesheet" ? activebtn : primaryColor,
                },
              ]}
              onPress={() => handleActivity("timesheet")}
            >
              <MaterialIcons name="timelapse" size={24} color={icon} />
              <Text style={[styles.seeMoreButtonText, { color: text }]}>
                Timesheet
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Display the event component */}
        <View style={styles.liveEventWrapper}>
          <LiveEventComponent />
        </View>

        {/* Add the role switch component */}
        {user?.is_employee && user?.is_admin && (
          <View style={styles.switchContainer}>
            <Text style={[styles.switchLabel, { color: text }]}>
              {isStaff ? "Staff Mode" : "Admin Mode"}
            </Text>
            <Switch
              value={isStaff}
              onValueChange={handleRoleSwitch}
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={isStaff ? "#f5dd4b" : "#f4f3f4"}
            />
          </View>
        )}

        <TouchableOpacity style={styles.logoutButton} onPress={handleSignOut}>
          <Text style={[styles.logoutText, { color: text }]}>Logout</Text>
          <MaterialIcons name="logout" size={22} color={icon} />
        </TouchableOpacity>
      </ScrollView>

      {/* This modal displays the user profile */}
      <Modal animationType="slide" transparent={false} visible={isModalVisible}>
        <View style={{ flex: 1 }}>
          <ProfileDisplayComponent
            user={user}
            onPress={() => {
              setModalVisible(false);
            }}
          />
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    paddingTop: Platform.OS === "ios" ? 50 : 30,
    paddingHorizontal: 15,
  },
  headerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },
  logoText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
  },
  profileButton: {
    padding: 2,
    borderRadius: 25,
    borderWidth: 2,
    borderColor: "rgba(0,0,0,0.1)",
  },
  profileImage: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  scrollview: {
    flex: 1,
    marginTop: 10,
  },
  menuContainer: {
    gap: 5,
  },
  menuButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
    shadowOffset: {
      width: 0,
      height: 2,
    },
  },
  activeButton: {
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  menuText: {
    marginLeft: 15,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
  seeMoreSection: {
    marginTop: 25,
    marginBottom: 15,
  },
  seeMoreTitle: {
    fontSize: 14,
    fontWeight: "600",
    marginBottom: 15,
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  seeMoreGrid: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 10,
  },
  seeMoreButton: {
    flex: 1,
    alignItems: "center",
    padding: 15,
    borderRadius: 12,
  },
  seeMoreButtonText: {
    marginTop: 8,
    fontSize: 14,
    fontWeight: "600",
  },
  liveEventWrapper: {
    marginVertical: 20,
    padding: 1,
    borderRadius: 5,
  },
  logoutButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 15,
    marginTop: 10,
    marginBottom: 20,
    borderRadius: 12,
    backgroundColor: "rgba(255,0,0,0.1)",
    borderWidth: 1,
    borderColor: "rgba(255,0,0,0.2)",
  },
  logoutText: {
    fontSize: 16,
    fontWeight: "600",
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

export default StaffSideComponent;
