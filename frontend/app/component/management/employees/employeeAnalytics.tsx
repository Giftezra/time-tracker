/**
 * The component is used to handle the employees panel which displays an overview of the employees in the company.
 * The component displays the overview in the left hand side of the screen and also displays the analytics of the
 * employees in the right hand side.
 * Details  to be displayed include the total number of hours done by the employee, the total number of unassigned
 * tasks completed by the employee, the employees most worked day and hour, the employee most recent job and if the
 * are currently working on a job.
 */
import React from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  WorklogInterface,
  TaskDetailsProps,
  EmployeeDetailsInterface,
} from "@/app/types/management/employee";
import EmployeeOverview from "./EmployeeOverview";
import WorkLog from "./WorkLog";
import TaskDetails from "./TaskDetails";

const EmployeeAnalyticsComponent = ({
  employeeData,
  workLog,
  taskDetails,
}: {
  employeeData?: EmployeeDetailsInterface;
  workLog?: WorklogInterface;
  taskDetails?: TaskDetailsProps;
}) => {
  const secondaryColor = useThemeColor({}, "secondaryColor");

  return (
    <ScrollView style={[styles.mainContainer]}>
      <View style={styles.mainOverviewContainer}>
        <EmployeeOverview overview={employeeData!} />
        <WorkLog workLog={workLog!} />
      </View>

      <TaskDetails {...taskDetails!} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    padding: 5,
  },
  mainOverviewContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },
});

export default EmployeeAnalyticsComponent;
