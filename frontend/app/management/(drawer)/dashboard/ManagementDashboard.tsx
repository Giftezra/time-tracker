import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import ContractChartComponent from "@/app/component/management/dashboard/contractChart";
import {
  GestureHandlerRootView,
} from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDashboardContext } from "@/app/context/management/dashboard/dashboardContext";
import EmployeeAnalyticsComponent from "@/app/component/management/employees/employeeAnalytics";
import { MaterialIcons } from "@expo/vector-icons";
import WebDashboard from "./WebDashboard";
import MobileDashboard from "./MobileDashboard";

const MainManagementDashboard = () => {
  const {
    selectedEmployeeData,
    employeeTaskDetails,
    employeeWorkLog,
    isLoading,
    isModalVisible,
    setIsModalVisible,
  } = useDashboardContext();

  return (
    <SafeAreaProvider>
      <GestureHandlerRootView style={styles.mainContainer}>
        {Platform.OS === "web" ? (
          <View style={styles.mainwebContainer}>
            <WebDashboard />
          </View>
        ) : (
          <View style={{ flex: 1 }}>
            <MobileDashboard />
          </View>
        )}

        {/* Display the employee analytics component */}
        {!isLoading && (
          <Modal
            visible={isModalVisible}
              animationType="slide"
          transparent={false}
          onRequestClose={() => setIsModalVisible(false)}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <Pressable
                onPress={() => setIsModalVisible(false)}
                style={styles.closeButton}
              >
                <MaterialIcons name="close" size={24} color="black" />
              </Pressable>
            </View>

            {selectedEmployeeData && !isLoading && (
              <EmployeeAnalyticsComponent
                employeeData={selectedEmployeeData}
                taskDetails={employeeTaskDetails}
                workLog={employeeWorkLog}
              />
            )}
          </View>
          </Modal>
        )}
      </GestureHandlerRootView>
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
  modalContainer: {
    flex: 1,
    backgroundColor: "white",
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  closeButton: {
    padding: 5,
  },
});
