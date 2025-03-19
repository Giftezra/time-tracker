import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEmployeeContext } from "@/app/context/management/employee/employeeContext";
import { WorklogInterface } from "@/app/types/management/employee";

const WorkLog:React.FC<WorklogInterface> = (props) => {
  const { startShift, endShift, shiftError } = useEmployeeContext();
  const text = useThemeColor({}, "text");
  const highlight = useThemeColor({}, "highlight");
  const primaryColor = useThemeColor({}, "primaryColor");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const innerBackground = useThemeColor({}, "innerBackground");
  const otherText = useThemeColor({}, "otherText");

  const handleStartShift = async () => {
    try {
        if (!props?.id) {
        Alert.alert("Error", "No shift ID found");
        return;
      }else{
        await startShift(props.id);
      }
    } catch (error) {
      Alert.alert("Error", shiftError || "Failed to start shift");
    }
  };

  const handleEndShift = async () => {
    try {
      if (!props?.id) {
        Alert.alert("Error", "No shift ID found");
        return;
      }else{
        await endShift(props.id);
      }
    } catch (error) {
      Alert.alert("Error", shiftError || "Failed to end shift");
    }
  };

  return (
    <View
      style={[styles.worklogContainer, { backgroundColor: innerBackground }]}
    >
      <Text style={[styles.worklogDetailsText, { color: text }]}>
        {props?.name} work log
      </Text>
      <View>
        <Text style={[styles.worklogDetailsText, { color: text }]}>
          {props?.task_start_date?.split("T")[0]}
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
          {props?.task_start_time}
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
              {props?.shift_start_time?.split("T")[1]}
            </Text>
            <TouchableOpacity
              style={[
                styles.clockinClockoutButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: secondaryColor,
                  borderBlockColor: highlight,
                  opacity: props?.status === "started" ? 0.5 : 1,
                },
              ]}
              disabled={props?.status === "started"}
              onPress={handleStartShift}
            >
              <Text
                style={[
                  styles.clockinClockoutButtonText,
                  { opacity: props?.status === "started" ? 0.5 : 1 },
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
              {props?.task_end_time}
            </Text>
            <TouchableOpacity
              style={[
                styles.clockinClockoutButton,
                {
                  backgroundColor: primaryColor,
                  shadowColor: primaryColor,
                  borderBlockColor: highlight,
                  opacity: props?.status !== "started" ? 0.5 : 1,
                },
              ]}
              disabled={props?.status !== "started"}
              onPress={handleEndShift}
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
    flexGrow: 1,
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 5,
    borderWidth: 1,
    marginHorizontal: 5,
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
