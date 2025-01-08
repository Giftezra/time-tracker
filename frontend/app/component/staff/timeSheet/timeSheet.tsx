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
        return "grey";
      case "cancelled":
        return "red";
      default:
        return "black";
    }
  };

  return (
    <View style={styles.mainContainer}>
      <View style={styles.dots} />

      <View style={styles.detailsContainer}>
        <Text style={styles.taskSerialText}>{props.taskSerial}</Text>
        <Text style={[styles.otherText]}>{props.contractName}</Text>
        <Text
          style={[
            styles.otherText,
            { color: getStatusColor(props.status || "") },
          ]}
        >
          {props.status}
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={styles.timeText}>{props.startTime}</Text>
        <Text style={styles.timeText}>{props.endTime}</Text>
      </View>

      <View style={styles.loggedTimeContainer}>
        <Text style={styles.timeText}>{props.loggedTime}</Text>
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
    padding: 1,
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 1,
  },

  dots: {
    width: 5,
    height: 5,
    borderRadius: 5,
    backgroundColor: "green",
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
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 2,
    marginHorizontal: 5,
  },

  loggedTimeContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 2,
  },

  pressable: {
    padding: 5,
  },

  taskSerialText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BarlowLight",
    textTransform: "uppercase",
  },

  otherText: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    fontWeight: "400",
    textTransform: "capitalize",
  },

  timeText: {
    fontSize: 11,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
