import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Animated,
} from "react-native";
import React, { useEffect, useState } from "react";
import { userData } from "@/app/utils/loadData";
import { AntDesign } from "@expo/vector-icons";
import { useTextBounceAnimation } from "@/app/utils/animations/dashboard";

const image = require("@/assets/images/user image.jpg");

const StaffDashboardHeader = () => {
  const user = userData();
  const [staffData, setStaffData] = useState({
    name: "",
    company_name: "",
    company_service: "",
  });
  const { bounceValue, startBounceAnimation } = useTextBounceAnimation();

  /**
   * Use the hook to load the user data and set the state of the staffData
   */
  useEffect(() => {
    setStaffData({
      name: user?.first_name + " " + user?.last_name,
      company_name: user?.company_name || "",
      company_service: user?.company_services || "",
    });
  }, [user]);

  return (
    <View style={styles.maincontainer}>
      <View style={styles.topContainer}>
        <View style={styles.profileSection}>
          <Image source={image} style={styles.imageContainer} />
          <View style={styles.onlineIndicator} />
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome back</Text>
        <Animated.Text
          style={[
            styles.nameText,
            { transform: [{ translateY: bounceValue }] },
          ]}
        >
          {staffData.name}
        </Animated.Text>

        <Text style={styles.othertext}>
          Ready to tackle today's tasks and make an impact?
        </Text>
      </View>
    </View>
  );
};

export default StaffDashboardHeader;

const styles = StyleSheet.create({
  maincontainer: {
    padding: 10,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#F0F0F0",
  },

  topContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 24,
  },

  profileSection: {
    position: "relative",
  },

  imageContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    borderWidth: 2,
    borderColor: "#F0F0F0",
  },

  onlineIndicator: {
    position: "absolute",
    bottom: 2,
    right: 2,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: "#4CAF50",
    borderWidth: 2,
    borderColor: "#FFFFFF",
  },

  settingsButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#F8F8F8",
  },

  container: {
    paddingHorizontal: 4,
  },

  nameText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    color: "#1A1A1A",
    marginBottom: 16,
  },

  welcomeText: {
    fontSize: 16,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    color: "#666666",
    marginBottom: 4,
  },

  otherTextContainer: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "#F8F8F8",
    marginTop: 8,
  },

  othertext: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
    color: "blue",
    padding: 5,
    letterSpacing: 0.5,
    fontVariant: ["small-caps"],
    fontStyle: "italic",
  },
});
