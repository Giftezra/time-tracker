import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import StaffTaskProvider from "@/app/context/staff/staffTaskProvider";
import StaffDashboardProvider from "@/app/context/staff/dashboardProvider";

const MainStaffDashboardLayout = () => {
    return (
      <StaffDashboardProvider>
        <Stack screenOptions={{ headerShown: false }}>
          <Stack.Screen name="StaffDashboard" />
        </Stack>
      </StaffDashboardProvider>
    );
};

export default MainStaffDashboardLayout;

const styles = StyleSheet.create({});
