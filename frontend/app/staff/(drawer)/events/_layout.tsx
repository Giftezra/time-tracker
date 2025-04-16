import { StyleSheet, Text, View } from "react-native";
import React from "react";
import EventProvider from "@/app/context/staff/staffEventProvider";
import { Stack } from "expo-router";

const StaffEventLayout = () => {
  return (
    <EventProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StaffEvent" />
      </Stack>
    </EventProvider>
  );
};

export default StaffEventLayout;

const styles = StyleSheet.create({});
