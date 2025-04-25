import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import * as Progress from "react-native-progress";
import { userData } from "@/app/utils/loadData";
import { useStaffDashboard } from "@/app/context/staff/dashboardProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSideComponentContext } from "@/app/context/staff/sideComponentProvider";
/**
 * This component is used to display the users ongoing tasks on the dashboard.
 * It displays a calculation that uses the current time and the task end time to show a progress bar.
 * IT displays the company deta that employed the client and the task details.
 */
const DashboardOngoingTask = () => {
  const user = userData();
  const { progress } = useStaffDashboard();
  const { event } = useSideComponentContext();
  const innerbackground = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");
  const highlight = useThemeColor({}, "highlight");

  if (event.status !== "started") {
    return (
      <View
        style={[
          styles.mainContainer,
          { backgroundColor: innerbackground, alignItems: "center" },
        ]}
      >
        <Text style={[styles.companyNameText, { color: text }]}>
          You currently have no active shifts yet
        </Text>
        <Text style={[styles.shiftText, { color: highlight }]}>
          refresh live events to see your active shifts
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
        return "gray";
      case progress < 0.66:
        return "orange";
      default:
        return "green";
    }
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: innerbackground }]}>
      <View style={styles.container}>
        <Text style={[styles.shiftText, { color: 'green', fontSize:14, textTransform:'capitalize', fontWeight:'700'}]}>
          {event?.contract_name}
        </Text>
        <Text style={[styles.timeText, { color: text }]}>
          {`${event?.start_time?.slice(0, 5)} - ${event?.end_time?.slice(
            0,
            5
          )}`}
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
    borderRadius: 5,
    borderWidth: 0.5,
    marginHorizontal: 5,
  },

  container: {
    gap: 5,
    padding: 5,
  },

  companyNameText: {
    fontSize: 15,
    fontFamily: "BarlowMedium",
    fontWeight: "600",
    textTransform: "capitalize",
    padding: 5,
  },

  shiftText: {
    fontSize: 12,
    fontFamily: "BarlowMedium",
    fontWeight: "600",
    textTransform: "lowercase",
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
