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
  const { ongoingTask, progress } = useStaffDashboard();
  const innerbackground = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");

  if (!ongoingTask) {
    return (
      <View
        style={[
          styles.mainContainer,
          { backgroundColor: innerbackground, alignItems: "center" },
        ]}
      >
        <Text style={[styles.companyNameText, { color: text }]}>
          No Ongoing Shift
        </Text>
        <Text style={[styles.shiftText, { color: text }]}>
          You currently have no active shifts
        </Text>
      </View>
    );
  }

  /**
   * This method is used to calculate the color of the progress bar based on the progress of the task.
   * @param progress of the task
   * @returns
   */
  const getProgressBarColor = (progress: number) => {
    switch (true) {
      case progress < 0.33:
        return "#4CAF50";
      case progress < 0.66:
        return "#FFC107";
      default:
        return "#FF5722";
    }
  };

  // Format times for display
  const startTime = new Date(
    ongoingTask?.shift_start_time || ""
  ).toLocaleTimeString([], {
    hour: "2-digit",
    minute: "2-digit",
  });
  const endTime = new Date(ongoingTask?.task_end_time || "").toLocaleTimeString(
    [],
    {
      hour: "2-digit",
      minute: "2-digit",
    }
  );

  return (
    <View style={[styles.mainContainer, { backgroundColor: innerbackground }]}>
      <View style={styles.container}>
        <Text style={[styles.shiftText, { color: text }]}>
          {`Current shift: ${ongoingTask?.contract_name || ""}`}
        </Text>
        <Text style={[styles.timeText, { color: text }]}>
          {`${startTime} - ${endTime}`}
        </Text>
        <Progress.Bar
          progress={progress || 0}
          width={null}
          color={getProgressBarColor(progress || 0)}
          style={styles.progressBar}
        />
        <Text style={[styles.progressText, { color: text }]}>
          {`${
            Number.isFinite(progress) ? Math.round(progress * 100) : 0
          }% Complete`}
        </Text>
      </View>
    </View>
  );
};

export default DashboardOngoingTask;

const styles = StyleSheet.create({
  mainContainer: {
    padding: 5,
    rowGap: 5,
    borderRadius: 5,
    borderWidth: 0.5,
    marginHorizontal: 5,
  },

  container: {
    padding: 5,
    rowGap: 5,
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

  timeText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "400",
    marginBottom: 5,
  },

  progressText: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    textAlign: "right",
    marginTop: 5,
  },

  progressBar: {
    width: "100%",
    height: 6,
    borderRadius: 3,
  },
});
