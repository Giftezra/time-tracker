import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState, useCallback } from "react";
import LeaderBoardCardComponent from "./leaderBoardCardComponent";
import OtherEmployeeOnLeaderboard from "./otherEmployeeLeaderboard";
import { id } from "react-native-paper-dates";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useDashboardContext } from "@/app/context/management/dashboard/ManagementDashboardContext";
import { LeaderBoardData } from "@/app/types/management/dashboard";
import ThemedHeaderText from "../../helper/ThemedHeaderText";
import SubtitleThemedText from "../../helper/SubtitleThemedText";
import ButtonText from "../../helper/ButtonText";
import InnerThemedText from "../../helper/InnerThemedText";
import { useAuth } from "@/app/authentication";
const LeaderBoardComponent = () => {
  const { topPerformers, setIsModalVisible, handleEmployeeAnalytics } =
    useDashboardContext();
  const { setAlertConfig, setIsAlertVisible } = useAuth();

  const [topEmployeeData, setTopEmployeeData] = useState<LeaderBoardData[]>([]);
  const [otherEmployeeData, setOtherEmployeeData] = useState<LeaderBoardData[]>(
    []
  );

  const handleAnalytics = useCallback(
    async (employeeId: string) => {
      if (handleEmployeeAnalytics) {
        await handleEmployeeAnalytics(employeeId);
      }
    },
    [handleEmployeeAnalytics]
  );

  /* The hook check the top performers data, and it sets the top employees with the most rank to the topEmployeeData state, and the rest to the otherEmployeeData state */
  useEffect(() => {
    if (topPerformers && topPerformers.length > 0) {
      const sortedPerformers = [...topPerformers].sort(
        (a, b) => (a.rank || 0) - (b.rank || 0)
      );
      const topFive = sortedPerformers.slice(0, 5);
      setTopEmployeeData(topFive);
      const remainingPerformers = sortedPerformers.slice(5);
      setOtherEmployeeData(remainingPerformers);
    }
  }, [topPerformers]);

  return (
    <GestureHandlerRootView style={styles.container}>
      <Text style={styles.headerText}>Top Employees</Text>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.topEmployeesScroll}
      >
        {topEmployeeData.map((item, index) => (
          <LeaderBoardCardComponent
            key={item.id || index}
            id={item.id || ""}
            name={item.name || ""}
            role={item.role || ""}
            totalTasks={item.taskCompleted || 0}
            rank={item.rank || 0}
            setIsModalVisible={setIsModalVisible}
            phone={item.phone || ""}
            onProfilePress={handleAnalytics}
          />
        ))}
      </ScrollView>

      {topEmployeeData.length > 0 && (
        <View style={styles.otherEmployeesContainer}>
          <View style={styles.otherEmployeeHeader}>
            <SubtitleThemedText text="other employees" />
            <View style={styles.otherEmployeeButtonContainer}>
              <TouchableOpacity style={[styles.otherEmployeeBtn]}>
                <ButtonText text="weekly" />
              </TouchableOpacity>
              <TouchableOpacity style={[styles.otherEmployeeBtn]}>
                <ButtonText text="monthly" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {topEmployeeData.map((item, index) => (
              <OtherEmployeeOnLeaderboard
                key={item.id || index}
                id={item.id || ""}
                name={item.name || ""}
                email={item.email || ""}
                phone={item.phone || ""}
                role={item.role || ""}
                taskCompleted={item.taskCompleted || 0}
                setIsModalVisible={setIsModalVisible}
                onProfilePress={handleAnalytics}
              />
            ))}
          </ScrollView>
        </View>
      )}
    </GestureHandlerRootView>
  );
};

export default LeaderBoardComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    backgroundColor: "#fff",
  },
  topEmployeesScroll: {
    paddingVertical: 10,
  },
  otherEmployeesContainer: {
    flex: 1,
    marginTop: 10,
  },
  otherEmployeeHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  otherEmployeeButtonContainer: {
    flexDirection: "row",
    gap: 10,
  },
  otherEmployeeBtn: {
    padding: 8,
    borderRadius: 5,
    borderWidth: 0.3,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    backgroundColor: "#fff",
  },
  headerText: {
    fontSize: 15,
    fontFamily: "BarlowMedium",
    fontWeight: "600",
    color: "#1A1A1A",
    letterSpacing: 0.5,
  },
});
