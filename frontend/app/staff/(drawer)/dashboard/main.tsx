import { StyleSheet, Text, View } from "react-native";
import React from "react";
import StaffDashboardHeader from "@/app/component/staff/dashboard/header";
import { GestureHandlerRootView, ScrollView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DashboardOngoingTask from "@/app/component/staff/dashboard/dashboardOngoingTasks";
import { useStaffDashboard } from "@/app/context/staff/dashboardProvider";
import SubtitleThemedText from "@/app/component/helper/SubtitleThemedText";
import InnerThemedText from "@/app/component/helper/InnerThemedText";
import ThemedHeaderText from "@/app/component/helper/ThemedHeaderText";
interface TaskCardProps {
  title?: string;
  value?: number;
  unit?: string;
}

const TaskCard: React.FC<TaskCardProps> = ({ title, value, unit }) => {
  return (
    <View style={styles.cardContainer}>
      <SubtitleThemedText text={title ?? ""} />
      <View style={styles.cardValueContainer}>
        <InnerThemedText text={value?.toString() ?? ""} />
        {unit && <Text style={styles.cardUnit}>{unit}</Text>}
      </View>
    </View>
  );
};

const MainStaffDashboard: React.FC = () => {
  const { completedShifts } = useStaffDashboard();
  return (
    <SafeAreaProvider style={styles.safeArea}>
      <GestureHandlerRootView style={styles.mainContainer}>
        <View style={styles.headerSection}>
          <StaffDashboardHeader />
        </View>

        <View style={styles.tasksSection}>
          <DashboardOngoingTask />
        </View>

        <ScrollView style={styles.reviewSection}>
          <ThemedHeaderText text="Monthly Performance Review" />

          <View style={styles.statsContainer}>
            <TaskCard title="Total Hours" value={completedShifts?.total_hours ?? 0} unit="hrs" />
            <TaskCard title="Completed Shifts" value={completedShifts?.total_shifts ?? 0} />
          </View>

          <View style={styles.statsContainer}>
            <TaskCard title="Amount Earned" value={completedShifts?.total_earnings ?? 0} unit="£" />
            <TaskCard title="Assigned Shifts" value={completedShifts?.pending_tasks ?? 0} />
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default MainStaffDashboard;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  mainContainer: {
    flex: 1,
    padding: 5,
  },
  headerSection: {
    marginBottom: 10,
  },
  tasksSection: {
    marginBottom: 10,
    padding: 5,
    
  },
  reviewSection: {
    flex: 1,
    marginTop: 16,
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
    marginBottom: 16,
    gap: 12,
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
});
