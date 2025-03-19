import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { userData } from "@/app/utils/loadData";
import { AntDesign } from "@expo/vector-icons";

const image = require("@/assets/images/user image.jpg");

const StaffDashboardHeader = () => {
  const user = userData();
  const [staffData, setStaffData] = useState({
    name: "",
    company_name: "",
    company_service: "",
  });

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
        <Pressable style={styles.settingsButton}>
          <AntDesign name="setting" size={24} color="#4A4A4A" />
        </Pressable>
      </View>

      <View style={styles.container}>
        <Text style={styles.welcomeText}>Welcome back</Text>
        <Text style={styles.nameText}>{staffData.name}</Text>

        <View style={styles.otherTextContainer}>
          <Text style={styles.othertext}>
            Ready to tackle today's tasks and make an impact?
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StaffDashboardHeader;

const styles = StyleSheet.create({
  maincontainer: {
    padding: 16,
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
    fontWeight: "400",
    color: "#4A4A4A",
    lineHeight: 22,
  },
});
