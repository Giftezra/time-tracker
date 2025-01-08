import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import TimeSheetProvider from "@/app/context/staff/timeSheetProvider";
import StaffTaskProvider from "@/app/context/staff/staffTaskProvider";

const MainTimesheetLayout = () => {
  return (
    <StaffTaskProvider>
      <TimeSheetProvider>
        <Stack screenOptions={{ headerShown: false }} />;
      </TimeSheetProvider>
    </StaffTaskProvider>
  );
};

export default MainTimesheetLayout;

const styles = StyleSheet.create({});
