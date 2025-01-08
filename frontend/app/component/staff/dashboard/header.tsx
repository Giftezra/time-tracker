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
        <Image source={image} style={styles.imageContainer} />
        <Pressable style={{ padding: 5 }}>
          <AntDesign name="setting" size={20} color="black" />
        </Pressable>
      </View>

      <View style={styles.container}>
        <Text style={styles.welcomeText}>welcome back</Text>
        <Text style={[styles.nameText]}>{staffData.name}</Text>

        <View style={styles.otherTextContainer}>
          <Text style={styles.othertext}>
            You feeling good enough to complete your task for today?
          </Text>
        </View>
      </View>
    </View>
  );
};

export default StaffDashboardHeader;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 5,
    flexDirection: "column",
    columnGap: 10,
  },

  topContainer: {
    flexDirection: "row",
    padding: 2,
    alignItems: "center",
    justifyContent: "space-between",
  },

  imageContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },

  container: {
    padding: 2,
    columnGap: 10,
  },

  nameText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    marginStart: 5,
    marginBottom: 5,
  },

  welcomeText: {
    fontSize: 20,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    marginBottom: 5,
  },

  otherTextContainer: {
    padding: 5,
    marginVertical: 5,
    borderRadius: 5,
    shadowOpacity: 0.5,
  },

  othertext: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    fontWeight: "400",
    textTransform: "capitalize",
  },
});
