import {
  ImageBackground,
  KeyboardAvoidingView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import StaffDashboardHeader from "@/app/component/staff/dashboard/header";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import DashboardOngoingTask from "@/app/component/staff/dashboard/dashboardOngoingTasks";

/**
 * This inner container is used to display card pertaining the users tasks.
 * @param param0
 * @returns
 */
const TaskCardContainer = ({
  title,
  value,
}: {
  title: string;
  value: number;
}) => {
  return (
    <View style={styles.cardContainer}>
      <Text style={styles.cardContainerText}>{title}</Text>
      <Text style={styles.cardContainerText}>{value}</Text>
    </View>
  );
};

const MainStaffDashboard = () => {
  return (
    <SafeAreaProvider style={{ flex: 1 }}>
        <GestureHandlerRootView style={styles.maincontainer}>
          <View style={{ flex: 1 }}>
            <StaffDashboardHeader />
          </View>
          <View style={{ flex: 1 }}>
            <DashboardOngoingTask />
          </View>

          <View style={styles.taskReviewContainer}>
            <Text>monthly shift review</Text>
            <View style={styles.innerReviewContainer}>
              <TaskCardContainer title="total hours" value={20} />
              <TaskCardContainer title="total shifts" value={20} />
            </View>


            <View style={styles.innerReviewContainer}>
              <TaskCardContainer title="total hours" value={20} />
              <TaskCardContainer title="total shifts" value={20} />
            </View>
          </View>
        </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default MainStaffDashboard;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 5,
  },

  taskReviewContainer: {
    flex: 1,
    padding: 5,
    flexDirection: "column",
  },

  innerReviewContainer: {
    flex: 1,
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    rowGap: 10,
    columnGap: 10,
  },

  cardContainer: {
    flex: 1,
    padding: 10,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    elevation: 5,
    shadowOpacity: 0.5,
    shadowRadius: 5,
  },

  cardContainerText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    marginStart: 5,
    marginBottom: 5,
  },
});
