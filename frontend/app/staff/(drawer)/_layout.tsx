import { Pressable, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { Drawer } from "expo-router/drawer";
import { Stack } from "expo-router";

import StaffSideComponent from "@/app/component/staff/helper/sideComponent";
import { useThemeColor } from "@/hooks/useThemeColor";

import SideComponentProvider from "@/app/context/staff/sideComponentProvider";
import StaffTaskProvider from "@/app/context/staff/staffTaskProvider";

const MainStaffMainLayout = () => {
  const backgroundColor = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");

  return (
    <SideComponentProvider>
      <StaffTaskProvider>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <Drawer
            drawerContent={() => <StaffSideComponent />}
            screenOptions={{
              headerShown: true,
              title: "",
              headerStyle: {
                backgroundColor: backgroundColor,
              },
              headerTintColor: tint,
              drawerStyle: {
                width: "80%",
                borderTopEndRadius: 5,
                borderBottomEndRadius: 5,
              },
            }}
          />
          <Stack screenOptions={{ headerShown: false }}>
            <Stack.Screen name="avaliability" />
            <Stack.Screen name="dashboard" />
            <Stack.Screen name="events" />
            <Stack.Screen name="messages" />
            <Stack.Screen name="notifications" />
            <Stack.Screen name="task" />
            <Stack.Screen name="timesheet" />
          </Stack>
        </GestureHandlerRootView>
      </StaffTaskProvider>
    </SideComponentProvider>
  );
};

export default MainStaffMainLayout;

const styles = StyleSheet.create({});
