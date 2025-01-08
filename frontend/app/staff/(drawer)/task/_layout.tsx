import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import StaffTaskProvider from "@/app/context/staff/staffTaskProvider";

const StaffTaskManagerLayout = () => {
  return (
    <StaffTaskProvider>
      <Stack screenOptions={{headerShown:false}}/>
    </StaffTaskProvider>
  );
};

export default StaffTaskManagerLayout;

const styles = StyleSheet.create({});
