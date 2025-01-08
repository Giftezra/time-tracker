import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Progress from "react-native-progress";
import { userData } from "@/app/utils/loadData";
import { useStaffDashboard } from "@/app/context/staff/dashboardProvider";
import { useThemeColor } from "@/hooks/useThemeColor";

/**
 * This component is used to display the users ongoing tasks on the dashboard.
 * It displays a calculation that uses the current time and the task end time to show a progress bar.
 * IT displays the company deta that employed the client and the task details.
 */
const DashboardOngoingTask = () => {
  const user = userData();
  const { ongoing } = useStaffDashboard();

  const [progress, setProgress] = useState(0);
  const taskEndTime = new Date(ongoing.taskEndTime).getTime();
  const taskStartTime = new Date(ongoing.taskStartTime).getTime();

  useEffect(() => {
    const totalDuration = taskEndTime - taskStartTime;
    const elapsedTime = new Date().getTime() - taskStartTime;
    const newProgress = Math.min(elapsedTime / totalDuration, 1);
    setProgress(newProgress);
  }, [taskStartTime, taskEndTime]);

  /**
   * This method is used to calculate the color of the progress bar based on the progress of the task.
   * @param progress of the task
   * @returns 
   */
  const getProgressBarColor = (progress: number) => {
    if (progress < 0.33) return "white";
    if (progress < 0.66) return "yellow";
    return "yellowgreen";
  };


  const innerbackground = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");

  return (
    <View style={[styles.mainContainer, { backgroundColor: innerbackground }]}>
      <Text
        style={[styles.companyNameText, { color: text }]}
      >{`your ongoing shift with ${user?.company_name}`}</Text>
      <View style={styles.container}>
        <Text
          style={[styles.shiftText, { color: text }]}
        >{`your shift with ${ongoing.contractName} is currently ongoing`}</Text>
        <Progress.Bar
          progress={progress}
          style={[
            styles.progressBar,
            { backgroundColor: getProgressBarColor(progress) },
          ]}
        />
      </View>
    </View>
  );
};

export default DashboardOngoingTask;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 10,
    rowGap: 10,
    borderRadius: 3,
    borderWidth: 0.5,
    marginHorizontal: 5,
  },

  container: {
    padding: 10,
    rowGap: 10,
  },

  companyNameText: {
    fontSize: 20,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  shiftText: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    fontWeight: "400",
    textTransform: "capitalize",
  },

  progressBar: {
    padding: 5,
    width: "100%",
    color: "#FF6347",
  },
});
