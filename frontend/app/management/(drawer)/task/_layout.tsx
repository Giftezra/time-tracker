import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { Stack } from "expo-router";
import ManagementTaskProvider from "@/app/context/management/task manager/managementTaskProvider";

const TaskManagementLayout = () => {
  return (
    <ManagementTaskProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ManagementTask" />
      </Stack>
    </ManagementTaskProvider>
  );
};

export default TaskManagementLayout;

const styles = StyleSheet.create({});
