import { ImageBackground, KeyboardAvoidingView, StyleSheet, Text, View } from "react-native";
import React from "react";
import StaffDashboardHeader from "@/app/component/staff/dashboard/header";
import {GestureHandlerRootView} from "react-native-gesture-handler";
import {SafeAreaProvider} from "react-native-safe-area-context";
import DashboardOngoingTask from "@/app/component/staff/dashboard/dashboardOngoingTasks";


const MainStaffDashboard = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <GestureHandlerRootView style={styles.maincontainer}>
          <View style={{ flex: 1 }}>
            <StaffDashboardHeader />
          </View>
          <View style={{ flex: 1 }}>
            <DashboardOngoingTask/>
          </View>

          <View>
            <Text>monthly review</Text>
          </View>

          

        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default MainStaffDashboard;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 5,
  }
});
