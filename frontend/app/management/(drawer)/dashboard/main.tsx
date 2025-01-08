import { Platform, StyleSheet, Text, View } from "react-native";
import React from "react";
import BillingComponent from "@/app/component/management/dashboard/billlingComponent";
import ContractChartComponent from "@/app/component/management/dashboard/contractChart";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { useAuth } from "@/app/context/management/authentication";
import WebDashboard from "./webDashboard";
import MobileDashboard from "./mobileDashboard";
import { DashboardProvider } from "@/app/context/management/dashboard/dashboardContext";
import { SafeAreaProvider } from "react-native-safe-area-context";

const MainManagementDashboard = () => {
  return (
    <SafeAreaProvider>
      <DashboardProvider>
        <GestureHandlerRootView
          style={styles.mainContainer}
        >
          {Platform.OS === "web" ? (
            <View style={styles.mainwebContainer}>
              <WebDashboard />
            </View>
          ) : (
            <View style={{ flex: 1 }}>
              <MobileDashboard />
            </View>
          )}
        </GestureHandlerRootView>
      </DashboardProvider>
    </SafeAreaProvider>
  );
};

export default MainManagementDashboard;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  mainwebContainer: {
    flex: 1,
    flexDirection: "row",
  },


  scrollView: {
    flexGrow: 1,
  },
});
