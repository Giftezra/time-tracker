import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEmployeeContext } from "@/app/context/management/employee/employeeContext";
import { WorklogInterface } from "@/app/types/management/employee";
import { useSideComponentContext } from "@/app/context/staff/sideComponentProvider";
const WorkLog = ({workLog}:{workLog: WorklogInterface}) => {
  const {handleStartShift, handleEndShift} = useSideComponentContext();

  const text = '#000'
  const highlight = useThemeColor({}, "highlight");
  const primaryColor = useThemeColor({}, "primaryColor");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const otherText = useThemeColor({}, "otherText");

  return (
    <View
      style={[styles.worklogContainer,]}
    >
      <Text style={[styles.worklogDetailsText, { color: text }]}>
        {workLog?.name} work log
      </Text>
      <View>
        <Text style={[styles.worklogDetailsText, { color: text }]}>
          {workLog?.task_start_date?.split("T")[0]}
        </Text>
        <Text
          style={[
            styles.worklogDetailsText,
            {
              fontSize: 20,
              fontWeight: "bold",
              color: highlight,
              marginTop: 5,
            },
          ]}
        >
          {workLog?.task_start_time}
        </Text>
        <Text
          style={[
            styles.worklogDetailsText,
            { fontSize: 12, marginBottom: 10 },
          ]}
        >
          work schedule
        </Text>
        <View style={styles.clockinClockoutContainer}>
          <View style={styles.clockinClockoutTextContainer}>
            <Text style={[styles.clockinClockoutText, { color: otherText }]}>
              Clock in
            </Text>
            <Text style={[styles.clockinClockoutText, { color: otherText }]}>
              {workLog?.shift_start_time?.split("T")[1]}
            </Text>
            <TouchableOpacity
              style={[
                styles.clockinClockoutButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: secondaryColor,
                  borderBlockColor: highlight,
                  opacity: workLog?.status === "started" ? 0.5 : 1,
                },
              ]}
              disabled={workLog?.status === "started"}
              onPress={() => handleStartShift(workLog?.id ?? "")}
            >
              <Text
                style={[
                  styles.clockinClockoutButtonText,
                  { opacity: workLog?.status === "started" ? 0.5 : 1 },
                ]}
              >
                start shift
              </Text>
            </TouchableOpacity>
          </View>
          <View style={styles.clockinClockoutTextContainer}>
            <Text style={[styles.clockinClockoutText, { color: otherText }]}>
              Clock out
            </Text>
            <Text style={[styles.clockinClockoutText, { color: otherText }]}>
              {workLog?.task_end_time}
            </Text>
            <TouchableOpacity
              style={[
                styles.clockinClockoutButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  borderBlockColor: highlight,
                  opacity: workLog?.status !== "started" ? 0.5 : 1,
                },
              ]}
              disabled={workLog?.status !== "started"}
              onPress={() => handleEndShift(workLog?.id ?? "")}
            >
              <Text style={styles.clockinClockoutButtonText}>end shift</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  worklogContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 10,
    borderWidth: 1,
    marginHorizontal: 5,
    gap:20,
    borderRadius:10,
  },
  worklogDetailsText: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
  },
  clockinClockoutContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 5,
  },
  clockinClockoutTextContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },
  clockinClockoutText: {
    fontSize: 12,
    fontWeight: "normal",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    padding: 2,
  },
  clockinClockoutButton: {
    flexGrow: 1,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    elevation: 10,
    shadowRadius: 10,
  },
  clockinClockoutButtonText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
    color: "white",
  },
});

export default WorkLog;
