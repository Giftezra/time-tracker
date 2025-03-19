import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { TimeSheetType } from "@/app/types/staff/timeSheet";
import { MaterialCommunityIcons } from "@expo/vector-icons";

/* This component defines a basic time sheet display data
this is used to display the task details done by the user  */
const TimeSheetComponent: React.FC<TimeSheetType> = (props) => {
  const getStatusColor = (status: string) => {
    switch (status.toLowerCase()) {
      case "approved":
        return "green";
      case "pending":
        return "red";
      default:
        return "black";
    }
  };

  /* Render a dot based on the status of the task */
  const renderDotStatus = (status: string) => {
    return (
      <View style = {{
        width: 6,
        height: 6,
        borderRadius: 3,
        backgroundColor: getStatusColor(status),
      }}/>
    )
  }

  return (
    <View style={styles.mainContainer}>
      <View style={styles.dots} />

      <View style={styles.detailsContainer}>
        <Text style={styles.taskSerialText}>{props.task_serial}</Text>
      </View>

      <View style={styles.detailsContainer}>
        <Text style={[styles.otherText, {margin:2}]}>{props.contract_name}</Text>
        <Text
          style={[
            styles.otherText,
            { color: getStatusColor(props.status || "") },
          ]}
        >
          {renderDotStatus(props.status || "")}
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.timeText}>
          {props.start_time}
        </Text>
        <Text>-</Text>
        <Text style={styles.timeText}>
          {props.end_time}
        </Text>
      </View>

      <View style={styles.loggedTimeContainer}>
        <Text style={styles.timeText}>{props.task_start_time}</Text>
        <Pressable style={styles.pressable}>
          <MaterialCommunityIcons
            name="dots-horizontal"
            size={15}
            color="black"
          />
        </Pressable>
      </View>
    </View>
  );
};

export default TimeSheetComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    shadowColor: "#000",
  },

  dots: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: "#4CAF50",
  },

  container: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 5,
    padding: 2,
    columnGap: 5,
  },

  detailsContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginHorizontal: 5,
  },

  loggedTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#F8F9FA",
    padding: 8,
    borderRadius: 6,
  },

  pressable: {
    padding: 5,
  },

  taskSerialText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "#1A1A1A",
    letterSpacing: 0.5,
  },

  otherText: {
    fontSize: 13,
    fontFamily: "BarlowRegular",
    color: "#4A4A4A",
  },

  timeText: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    color: "#666666",
  },
});
