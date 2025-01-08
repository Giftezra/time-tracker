import { StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";

import EmployeeAnalyticsComponent from "@/app/component/management/employees/employeeAnalytics";

import { useThemeColor } from "@/hooks/useThemeColor";

const employeeAnalytics = {
  id: "1",
  role: "developer",
  name: "john doe",
  email: "enigma@gmail.com",
  phone: "08012345678",
  dob: "19-05-1998",
  image: require("../../../../assets/images/user image.jpg"),
  date_hired: "12-12-2021",
  department: "engineering",
  number_of_hours: 20,
  number_of_unassigned_tasks: 2,
  number_of_assigned_tasks: 3,
  total_cancellations: 1,
  total_number_of_project_completed: 10,
};

const AnalyticsComponent = () => {
  const [isModalClose, setIsModalClose] = useState(false);

  const secondaryColor = useThemeColor({}, "secondaryColor");

  const onCloseModal = () => {
    setIsModalClose(true);
  };
  /* Get the params sent from the employee display component using the useLocalSearchParams hook .
  The param is the user id which will be used by the page to fetch details of the staff requested from the server */
  const { id } = useLocalSearchParams();
  return (
    <SafeAreaView style={[{ flex: 1 }, {backgroundColor:secondaryColor}]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <EmployeeAnalyticsComponent
          props={employeeAnalytics}
          onModalClose={onCloseModal}
        />
      </GestureHandlerRootView>
    </SafeAreaView>
  );
};

export default AnalyticsComponent;

const styles = StyleSheet.create({});
