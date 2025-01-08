import {
  ActivityIndicator,
  Image,
  Modal,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";

import LiveEventComponent from "./liveEvent";
import { MaterialIcons } from "@expo/vector-icons";
import { Pressable, TouchableOpacity } from "react-native-gesture-handler";
import { user_image } from "@/app/utils/images";

import { act } from "react-test-renderer";
import { useSideComponentContext } from "@/app/context/staff/sideComponentProvider";
import { userData } from "@/app/utils/loadData";
import { useAuth } from "@/app/context/management/authentication";
import ProfileDisplayComponent from "./profileDisplay";
import { useState } from "react";

const StaffSideComponent = () => {
  const { signOut } = useAuth();
  const user = userData();

  const [isModalVisible, setModalVisible] = useState(false);

  const toggleModal = () => {
    setModalVisible(!isModalVisible);
  };

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

  return (
    <View style={[styles.maincontainer, { backgroundColor: secondaryColor }]}>
      {/* Contains the items in the side component itself */}
      <View style={[styles.rowContainer, { position: "sticky" }]}>
        {/* TODO: Replace with the logo image and the app name */}
        <MaterialIcons name="calendar-today" size={20} color={icon} />
        <Text>Logo</Text>
        {/* Animate the view so the border color rotates and changes constantly */}
        <Pressable style={styles.imagecontainer} onPress={toggleModal}>
          <Image source={user_image} style={[styles.image]} />
        </Pressable>
      </View>

      <ScrollView
        style={styles.scrollview}
        showsHorizontalScrollIndicator={false}
      >
        <View>
          <TouchableOpacity
            style={[
              styles.rowContainer,
              { backgroundColor: primaryColor },
              styles.buttons,
              active === "events" && { backgroundColor: activebtn },
            ]}
            onPress={() => handleActivity("events")}
          >
            <MaterialIcons name="event" size={20} color={icon} />
            <Text style={[styles.buttonText, { color: text }]}>events</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowContainer,
              { backgroundColor: primaryColor },
              styles.buttons,
              active === "task" && { backgroundColor: activebtn },
            ]}
            onPress={() => handleActivity("task")}
          >
            <MaterialIcons name="task" size={20} color={icon} />
            <Text style={[styles.buttonText, { color: text }]}>
              Manage task
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowContainer,
              { backgroundColor: primaryColor },
              styles.buttons,
              active === "notification" && { backgroundColor: activebtn },
            ]}
            onPress={() => handleActivity("notification")}
          >
            <MaterialIcons name="notifications" size={20} color={icon} />
            <Text style={[styles.buttonText, { color: text }]}>
              notification
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowContainer,
              { backgroundColor: primaryColor },
              styles.buttons,
              active === "messages" && { backgroundColor: activebtn },
              ,
            ]}
            onPress={() => handleActivity("messages")}
          >
            <MaterialIcons name="message" size={20} color={icon} />
            <Text style={[styles.buttonText, { color: text }]}>messages</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[
              styles.rowContainer,
              { backgroundColor: primaryColor, shadowColor: secondaryColor },
              styles.buttons,
              active === "availability" && { backgroundColor: activebtn },
            ]}
            onPress={() => handleActivity("availability")}
          >
            <MaterialIcons name="event-available" size={20} color={icon} />
            <Text style={[styles.buttonText, { color: text }]}>
              availability
            </Text>
          </TouchableOpacity>
        </View>
        {/* Contains the inner components for timesheet, dashboard */}
        <View style={styles.seemoreContainer}>
          <Text style={[styles.seemoreText, { marginVertical: 10 }]}>
            see more
          </Text>
          <View style={styles.seemorerowContainer}>
            <TouchableOpacity
              style={[
                styles.seemoreButtons,
                active !== "dashboard" && { backgroundColor: activebtn },
              ]}
              onPress={() => handleActivity("dashboard")}
            >
              <MaterialIcons name="dashboard" size={24} color={icon} />
              <Text style={styles.seemoreText}>Dashboard</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={[
                styles.seemoreButtons,
                active !== "timesheet" && { backgroundColor: activebtn },
              ]}
              onPress={() => handleActivity("timesheet")}
            >
              <MaterialIcons name="timelapse" size={24} color={icon} />
              <Text style={styles.seemoreText}>Timesheet</Text>
            </TouchableOpacity>
          </View>
        </View>
        {/* Contains components required in the side component */}
        <View style={[styles.rowContainer, styles.liveEventContainer]}>
          <View style={styles.liveEventInnerContainer}>
            <LiveEventComponent />
          </View>
        </View>

        {/* Contains the logout button to sign the user out */}
        <Pressable style={styles.logoutButton} onPress={signOut}>
          <Text>Logout</Text>
          <MaterialIcons name="logout" size={20} color={icon} />
        </Pressable>
      </ScrollView>

      {/* This modal displays the user profile */}
      <Modal animationType="slide" transparent={false} visible={isModalVisible}>
        <View style={{ flex: 1 }}>
          <ProfileDisplayComponent user={user} onPress={toggleModal} />
        </View>
      </Modal>
    </View>
  );
};

export default StaffSideComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    justifyContent: "space-between",
    paddingTop: 30,
  },

  scrollview: {
    flex: 1,
    width: "100%",
  },

  rowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    columnGap: 10,
  },

  image: {
    width: 40,
    height: 40,
    padding: 10,
    borderRadius: 20,
  },

  imagecontainer: {
    borderWidth: 1,
    borderRadius: 20,
    shadowRadius: 5,
    elevation: 5,
    shadowOpacity: 0.5,
  },

  buttons: {
    padding: 5,
    alignItems: "center",
    justifyContent: "space-around",
    shadowRadius: 10,
    elevation: 10,
  },

  buttonText: {
    flex: 1,
    fontSize: Platform.OS === "web" ? 14 : 16,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 5,
    textShadowRadius: 5,
  },

  seemoreContainer: {
    width: "100%",
    flexDirection: "column",
    padding: 5,
  },

  seemorerowContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    padding: 5,
  },

  seemoreButtons: {
    padding: 10,
    borderRadius: 20,
    alignItems: "center",
    elevation: 10,
    shadowRadius: 10,
  },

  seemoreText: {
    fontSize: 15,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 5,
  },

  liveEventContainer: {
    flexGrow: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  liveEventInnerContainer: {
    width: "80%",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 30,
  },

  logoutButton: {
    padding: 10,
    borderRadius: 10,
    alignItems: "center",
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    borderWidth: 1,
    shadowOffset: { width: 0, height: 1 },
    marginHorizontal: 10,
    marginVertical: 10,
  },
});
