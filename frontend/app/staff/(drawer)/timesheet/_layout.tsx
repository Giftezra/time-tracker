import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import TimeSheetProvider from "@/app/context/staff/timeSheetProvider";

const MainTimesheetLayout = () => {
  return (
    <TimeSheetProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </TimeSheetProvider>
  );
};

export default MainTimesheetLayout;

const styles = StyleSheet.create({});
