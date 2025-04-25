import { StyleSheet, Text, View, useWindowDimensions } from "react-native";
import React, { useState } from "react";
import StaffDashboardHeader from "@/app/component/staff/dashboard/header";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import DashboardOngoingTask from "@/app/component/staff/dashboard/dashboardOngoingTasks";
import { useStaffDashboard } from "@/app/context/staff/dashboardProvider";
import ThemedHeaderText from "@/app/component/helper/ThemedHeaderText";
import StaffDashboardChart from "@/app/component/staff/dashboard/StaffDashboardChart";
import { useAuth } from "@/app/authentication";

interface TaskCardProps {
  title?: string;
  value?: number;
  unit?: string;
}

const TaskCard = ({ task }: { task: TaskCardProps }) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardTitle}>{task.title}</Text>
      <View style={styles.cardValueContainer}>
        <Text style={styles.cardValue}>{task.value?.toString() ?? ""}</Text>
        {task.unit && <Text style={styles.cardUnit}>{task.unit}</Text>}
      </View>
    </View>
  );
};

const StaffDashboard: React.FC = () => {
  const { dashboardData } = useStaffDashboard();
  const { screenWidth } = useAuth();
  const [layout, setLayout] = useState(0);

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <View style={styles.headerSection}>
        <StaffDashboardHeader />
      </View>

      <View style={styles.tasksSection}>
        <DashboardOngoingTask />
      </View>

      <ScrollView style={styles.reviewSection}>
        {/* Staff Dashboard Chart */}
        <View
          style={styles.chartSection}
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setLayout(width);
          }}
        >
          <StaffDashboardChart width={layout || screenWidth - 20} />
        </View>
        <ThemedHeaderText text="Monthly Performance Review" />
        <View style={styles.statsContainer}>
          <TaskCard
            task={{
              title: "Total Hours",
              value: dashboardData?.total_hours ?? 0,
              unit: "hrs",
            }}
          />
          <TaskCard
            task={{
              title: "Completed Shifts",
              value: dashboardData?.total_shifts ?? 0,
            }}
          />
        </View>

        <View style={styles.statsContainer}>
          <TaskCard
            task={{
              title: "Amount Earned",
              value: dashboardData?.total_earnings ?? 0,
              unit: "£",
            }}
          />
          <TaskCard
            task={{
              title: "Assigned Shifts",
              value: dashboardData?.total_shifts ?? 0,
            }}
          />
        </View>
        <View style={styles.statsContainer}>
          <TaskCard
            task={{
              title: "Cancelled Shifts",
              value: dashboardData?.total_shifts ?? 0,
            }}
          />
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default StaffDashboard;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 5,
  },
  headerSection: {
    marginBottom: 2,
  },
  tasksSection: {
    gap: 5,
    padding: 2,
  },
  reviewSection: {
    flex: 1,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "#2c3e50",
    marginBottom: 16,
    textTransform: "capitalize",
  },
  statsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    gap: 12,
    padding: 5,
  },
  cardContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    minWidth: 150,
    maxWidth: 200,
  },
  cardTitle: {
    fontSize: 14,
    color: "#666",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    marginBottom: 8,
  },
  cardValueContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  cardValue: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2c3e50",
    fontFamily: "BarlowRegular",
  },
  cardUnit: {
    fontSize: 14,
    color: "#666",
    marginLeft: 4,
    fontFamily: "BarlowRegular",
  },
  chartSection: {
    height: 350,
    width: "100%",
    padding: 10,
  },
});
