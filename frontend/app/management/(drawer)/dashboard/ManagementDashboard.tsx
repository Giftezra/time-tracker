import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import ContractChartComponent from "@/app/component/management/dashboard/contractChart";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useDashboardContext } from "@/app/context/management/dashboard/ManagementDashboardContext";
import EmployeeAnalyticsComponent from "@/app/component/management/employees/employeeAnalytics";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import WebDashboard from "./WebDashboard";
import MobileDashboard from "./MobileDashboard";
import RegisterCompanyComponent from "../../onboarding/registerCompany";
import { useAuth } from "@/app/authentication";
const MainManagementDashboard = () => {
  const { isRegisterCompany, setIsRegisterCompany } = useAuth();
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
      {/* Display the register company component when the user clicks on the create company button */}
      {isRegisterCompany && (
        <View style={styles.registerCompanyOverlay}>
          <View style={styles.registerCompanyContent}>
            <TouchableOpacity
              style={styles.registerCompanyCloseButton}
              onPress={() => setIsRegisterCompany(false)}
            >
              <AntDesign name="close" size={24} color={"white"} />
            </TouchableOpacity>
            <RegisterCompanyComponent
              onClose={() => setIsRegisterCompany(false)}
            />
          </View>
        </View>
      )}
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

  registerCompanyOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0,0,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  registerCompanyContent: {
    width: "100%",
    maxWidth: 600,
    padding: 15,
    position: "relative",
    overflow: "scroll",
    minHeight: 600,
  },

  registerCompanyCloseButton: {
    position: "absolute",
    right: 10,
    top: 10,
    zIndex: 1001,
    padding: 8,
    backgroundColor: "#333",
    borderRadius: 20,
    width: 40,
    height: 40,
    justifyContent: "center",
    alignItems: "center",
  },
});
