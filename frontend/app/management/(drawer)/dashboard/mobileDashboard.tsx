import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import DashboardWelcomeHeader from "@/app/component/management/dashboard/welcomeHeader";
import TodayEventsComponent from "@/app/component/management/dashboard/todayEvents";
import { Pressable, ScrollView } from "react-native-gesture-handler";
import EmployeeAnalyticsComponent from "@/app/component/management/employees/employeeAnalytics";
import EmployeeOnLeaveComponent from "@/app/component/management/dashboard/employeeOnleave";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LeaderBoardComponent from "@/app/component/management/dashboard/leaderBoard";
import ContractChartComponent from "@/app/component/management/dashboard/contractChart";
import TaskChartComponent from "@/app/component/management/dashboard/taskChart";
import { EmployeeOnLeaveInterface } from "@/app/types/management/dashboard";
import { useDashboardContext } from "@/app/context/management/dashboard/dashboardContext";
import ThemedHeaderText from "@/app/component/helper/ThemedHeaderText";
const MobileDashboard = () => {
  const { unavailableEmployees, todayEvents, taskStats } = useDashboardContext();
    const total = taskStats.total || 1; // Prevent division by zero

    const pieData = [
      {
        value: (taskStats.completed / total) * 100,
        color: "#4CAF50",
        gradientCenterColor: "#81C784",
        focused: true,
      },
      {
        value: (taskStats.ongoing / total) * 100,
        color: "#2196F3",
        gradientCenterColor: "#64B5F6",
      },
      {
        value: (taskStats.assigned / total) * 100,
        color: "#FFC107",
        gradientCenterColor: "#FFD54F",
      },
      {
        value: (taskStats.pending / total) * 100,
        color: "#FF5722",
        gradientCenterColor: "#FF8A65",
      },
    ];

    const overageData = [
      {
        value: (taskStats.completed / total) * 100,
        color: "#4CAF50",
        gradientCenterColor: "#81C784",
      },
      {
        value: (taskStats.ongoing / total) * 100,
        color: "#2196F3",
        gradientCenterColor: "#64B5F6",
      },
    ];

  const white = useThemeColor({}, "white");
  const [width, setWidth] = useState(0);
  const [isLeaveVisible, setIsLeaveVisible] = useState(false);

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.maincontainer}>
        <DashboardWelcomeHeader />
        <View style={styles.sectionContainer}>
          <TodayEventsComponent event={todayEvents} />
        </View>

        <View style={styles.section}>
          <Pressable
            onPress={() => setIsLeaveVisible(!isLeaveVisible)}
            style={styles.pressableDropdown}
          >
            <Text style={styles.subheaderText}>Employees on Leave</Text>
            <Text
              style={[styles.subheaderText, { color: "red", fontSize: 11 }]}
            >
              {isLeaveVisible ? "Hide" : "Show"}
            </Text>
          </Pressable>

          {isLeaveVisible && (
            <ScrollView style={styles.leaveScrollView}>
              {unavailableEmployees.map((item, index) => (
                <EmployeeOnLeaveComponent key={index} {...item} />
              ))}
            </ScrollView>
          )}
        </View>

        <View
          style={styles.section}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setWidth(width);
          }}
        >
          <ContractChartComponent width={width} />
        </View>

        <View style={styles.section}>
          <TaskChartComponent
            width={width}
            title="Total Tasks"
            pieData={pieData}
            taskStats={taskStats}
          />
        </View>

        <View style={styles.section}>
          <ThemedHeaderText text="Leader Board" />
          <LeaderBoardComponent />
        </View>

        <View style={styles.section}>
          {overageData.length > 0 ? (
            <View>
              <ThemedHeaderText text="Employee Overage" />
              <TaskChartComponent width={width} pieData={pieData} />
            </View>
          ) : (
            <View>
              <ThemedHeaderText text="Employee Overage" />
              <Text>No data available</Text>
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default MobileDashboard;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#F5F7FA",
  },
  sectionContainer: {
    padding: 5,
  },

  section: {
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 5,
    margin: 5,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3.84,
    elevation: 5,
    overflow: "hidden",
  },

  leaveScrollView: {
    maxHeight: 150,
  },

  pressableDropdown: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  subheaderText: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
    marginBottom: 10,
    marginLeft: 5,
    padding: 2,
  },

  headerText: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    color: "#1A1A1A",
    textTransform: "capitalize",
    marginBottom: 16,
    marginLeft: 5,
    padding: 5,
  },
});
