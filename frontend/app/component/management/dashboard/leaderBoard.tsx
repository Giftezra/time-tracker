import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
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
const LeaderBoardComponent = () => {
  const { topPerformers, setIsModalVisible } = useDashboardContext();
  const innerBackground = useThemeColor({}, "innerBackground");

  const [topEmployeeData, setTopEmployeeData] = useState<LeaderBoardData[]>([]);
  const [otherEmployeeData, setOtherEmployeeData] = useState<LeaderBoardData[]>(
    []
  );

  /* The hook check the top performers data, and it sets the top employees with the most rank to the topEmployeeData state, and the rest to the otherEmployeeData state */
  useEffect(() => {
    if (topPerformers && topPerformers.length > 0) {
      // Sort performers by rank (assuming lower rank number is better)
      const sortedPerformers = [...topPerformers].sort(
        (a, b) => (a.rank || 0) - (b.rank || 0)
      );

      // Get top 5 performers
      const topFive = sortedPerformers.slice(0, 5);
      setTopEmployeeData(topFive);

      // Get the remaining performers
      const remainingPerformers = sortedPerformers.slice(5);
      setOtherEmployeeData(remainingPerformers);
    }
  }, [topPerformers]);

  return (
    <GestureHandlerRootView style={[styles.container]}>
      <View>
        <ThemedHeaderText text="Top Employees" />
        <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
          {topEmployeeData.map((item, index) => (
            <LeaderBoardCardComponent
              key={item.id || index}
              id={item.id || ""}
              name={item.name || ""}
              role={item.role || ""}
              totalTasks={item.taskCompleted || 0}
              rank={item.rank || 0}
              setIsModalVisible={setIsModalVisible}
            />
          ))}
        </ScrollView>
      </View>

      {otherEmployeeData.length > 0 && (
        <View style={{ height: 200 }}>
          <View style={styles.otherEmployeeTextContainer}>
            <View>
              <SubtitleThemedText text="other employees" />
            </View>

            <View style={styles.otherEmployeeButtonContainer}>
              <TouchableOpacity
                style={[
                  styles.otherEmployeebtn,
                  { backgroundColor: innerBackground },
                ]}
              >
                <ButtonText text="weekly" />
              </TouchableOpacity>
              <TouchableOpacity
                style={[
                  styles.otherEmployeebtn,
                  { backgroundColor: innerBackground },
                ]}
              >
                <ButtonText text="monthly" />
              </TouchableOpacity>
            </View>
          </View>

          <ScrollView showsVerticalScrollIndicator={false}>
            {otherEmployeeData.map((item) => (
              <OtherEmployeeOnLeaderboard
                key={item.id || ""}
                id={item.id || ""}
                name={item.name || ""}
                email={item.email || ""}
                phone={item.phone || ""}
                role={item.role || ""}
                taskCompleted={item.taskCompleted || 0}
                setIsModalVisible={setIsModalVisible}
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
    padding: 5,
    marginStart: 5,
    backgroundColor: "#fff",
  },

  scrollViewContent: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  otherEmployeeTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    marginVertical: 5,
    width: "100%",
  },

  otherEmployeeText: {
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  otherEmployeeButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
  },

  otherEmployeebtn: {
    padding: 5,
    borderRadius: 5,
    shadowRadius: 5,
    elevation: 5,
    shadowOpacity: 0.5,
    borderWidth: 0.3,
  },

  otherEmployeebtnText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "400",
    textTransform: "lowercase",
  },
});
