import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import EmployeeProvider from "@/app/context/management/employee/employeeContext";

const EmployeeLayout = () => {
  return (
    <EmployeeProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </EmployeeProvider>
  );
};

export default EmployeeLayout;

const styles = StyleSheet.create({});
