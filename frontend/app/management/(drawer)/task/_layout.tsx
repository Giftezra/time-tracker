import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ManagementTaskProvider from "@/app/context/management/task manager/createTaskContext";
import { Stack } from "expo-router";

const TaskManagementLayout = () => {
  return (
    <ManagementTaskProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ManagementTaskProvider>
  );
};

export default TaskManagementLayout;

const styles = StyleSheet.create({});
