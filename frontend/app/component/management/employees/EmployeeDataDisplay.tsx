import {
  ActivityIndicator,
  Image,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

import { user_image } from "@/app/utils/images";
import { EmployeeDetailsInterface } from "@/app/types/management/employee";
import { useEmployeeContext } from "@/app/context/management/employee/employeeContext";
import EmployeeAnalyticsComponent from "./EmployeeAnalytics";

const EmployeeDisplayComponent: React.FC<EmployeeDetailsInterface> = (
  props
) => {
  // Import the context methods
  const { setEmployeeId, setIsModalVisible, removeEmployee } =
    useEmployeeContext();

  const highlight = useThemeColor({}, "highlight");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const text = "#000";
  const otherText = useThemeColor({}, "otherText");

  /* Handle the employee id when the employee is clicked and set the modal to visible, to open the modal.
  Which contains the user analytics, task details and work log.
   * Set the employee id to the employee id state.
   */
  const handleEmployeeClick = () => {
    setEmployeeId(props.id || "");
    setIsModalVisible(true);
  };

  return (
    /* Route the admin to the employees analytics page when clicked. 
       Send the user id and accross to the next page to fetch the user that was requested  */
    <View style={[styles.container, { backgroundColor: "white" }]}>
      <Image source={user_image} style={styles.image} />
      {/* Constains the staffs name and details */}
      <View style={styles.nameContainer}>
        <Text style={[styles.nameText, { color: text }]}>{props.name}</Text>
        <Text style={[styles.detailsText, { color: otherText }]}>
          {props.role}
        </Text>
      </View>

      <Pressable
        style={[
          styles.container,
          {
            borderRadius: 5,
            borderBlockColor: highlight,
            borderWidth: 0.5,
          },
        ]}
        onPress={handleEmployeeClick}
      >
        <View style={styles.employmentDetailsContainer}>
          <View style={{ gap: 10 }}>
            <Pressable
              style={{ backgroundColor: "red", padding: 5, borderRadius: 5 }}
              onPress={() => removeEmployee(props.id || "")}
            >
              <Text style={[styles.detailsText, { color: "white" }]}>
                Remove Employee
              </Text>
            </Pressable>

            <Text style={[styles.detailsText, { color: text }]}>
              {props.is_active ? "Active" : "Inactive"}
            </Text>
          </View>

          <View>
            <Text style={[styles.detailsText, { color: text }]}>
              date hired
            </Text>
            <Text style={[styles.detailsText, { color: text }]}>
              {props.date_hired}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <AntDesign name="mail" size={20} color={text} style={styles.icons} />
          <Text style={[styles.detailsText, { color: text }]}>
            {props.email}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <MaterialIcons
            name="phone"
            size={20}
            color={text}
            style={styles.icons}
          />
          <Text style={[styles.detailsText, { color: text }]}>
            {props.phone}
          </Text>
        </View>

        <View style={{ alignSelf: "flex-end", flexDirection: "row", gap: 5 }}>
          <Text
            style={[
              styles.detailsText,
              { color: "blue", fontSize: 12, fontWeight: "600" },
            ]}
        >
          see more
        </Text>
        <Text>🔽</Text>
        </View>
      </Pressable>
    </View>
  );
};

export default EmployeeDisplayComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 5,
    height: 300,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.3,
    borderRadius: 5,
    backgroundColor: "white",
  },

  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
    borderRadius: 40,
    padding: 10,
    marginTop: 10,
  },

  nameContainer: {
    width: "100%",
    padding: 5,
    alignItems: "center",
  },

  employmentDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },

  detailsContainer: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
  },

  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  subheaderText: {
    fontSize: 14,
    fontFamily: "OswaldVariable",
    textTransform: "capitalize",
    fontWeight: "400",
    marginVertical: 5,
  },

  detailsText: {
    fontSize: 13,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    fontWeight: "600",
  },

  icons: {
    marginHorizontal: 10,
  },
});
