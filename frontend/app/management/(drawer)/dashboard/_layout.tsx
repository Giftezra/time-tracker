import { StyleSheet, Text, View } from "react-native";
import React from "react";
import DashboardProvider from "@/app/context/management/dashboard/dashboardContext";
import { Stack } from "expo-router";
import EmployeeProvider from "@/app/context/management/employee/employeeContext";

const DashboardLayout = () => {
  return (
    <EmployeeProvider>
      <DashboardProvider>
        <Stack screenOptions={{ headerShown: false }} />
      </DashboardProvider>
    </EmployeeProvider>
  );
};

export default DashboardLayout;

const styles = StyleSheet.create({});
