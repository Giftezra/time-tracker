import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TimeSheetDatecomponent from "./timeSheetDate";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useTimeSheetContext } from "@/app/context/staff/timeSheetProvider";
const TimeSheetHeaderComponent = ({
  startBreakButton,
  clockOutButton,
  clockOutTime,
  breakTime,
  clockInTime,
}: {
  startBreakButton: () => void;
  clockOutButton: () => void;
  clockOutTime: string;
  breakTime: string;
  clockInTime: string;
}) => {
  const { ongoingShift } = useTimeSheetContext();
  //Get he current month and day
  const date = new Date();
  const month = date.toLocaleDateString("default", { month: "short" });
  const day = date.getDate();

  const inactiveBtn = useThemeColor({}, "inactivebtn");
  const textColor = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "background");
  const separatorColor = useThemeColor({}, "primaryColor");

  const [pressedIn, setPressedIn] = useState<string>("");

  const handleButtonPressIn = (value: string) => {
    setPressedIn(value);
  };

  return (
    <View style={[styles.maincontainer, { borderColor }]}>
      <View
        style={[
          styles.container,
          { borderBottomColor: borderColor, borderBottomWidth: 1 },
        ]}
      >
        <View style={styles.dateContainer}>
          <TimeSheetDatecomponent month={month} day={day} />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: inactiveBtn, borderColor: separatorColor },
              pressed && styles.buttonPressed,
            ]}
            onPress={startBreakButton}
          >
            <MaterialCommunityIcons name="coffee" size={16} color={textColor} />
            <Text style={[styles.buttonText, { color: textColor }]}>
              Start Break
            </Text>
          </Pressable>

          <Pressable
            style={({ pressed }) => [
              styles.button,
              { backgroundColor: inactiveBtn, borderColor: separatorColor },
              pressed && styles.buttonPressed,
            ]}
            onPress={clockOutButton}
          >
            <MaterialCommunityIcons name="logout" size={16} color={textColor} />
            <Text style={[styles.buttonText, { color: textColor }]}>
              Clock Out
            </Text>
          </Pressable>
        </View>
      </View>

      <View style={[styles.container, styles.lowerContainer]}>
        <View style={styles.innerContainer}>
          <Text style={[styles.timeheaderText, {color: '#432318'}]}>
            Clocked In
          </Text>
          <Text style={[styles.timeText, {color:'blue'}]}>
            {ongoingShift?.shift_start_time}
          </Text>
        </View>
        <View style={[styles.separator, { backgroundColor: separatorColor }]} />
        <View style={styles.innerContainer}>
          <Text style={[styles.timeheaderText, {color: '#432318'}]}>
            Will Clock Out
          </Text>
          <Text style={[styles.timeText, {color:'blue'}]}>
            {ongoingShift?.task_end_time}
          </Text>
        </View>
      </View>
    </View>
  );
};

export default TimeSheetHeaderComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: "column",
    borderRadius: 8,
    borderWidth: 1,
    marginHorizontal: 12,
    marginVertical: 8,
    backgroundColor: "white",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },

  container: {
    flexDirection: "row",
    padding: 12,
    columnGap: 16,
  },

  lowerContainer: {
    justifyContent: "space-between",
    paddingVertical: 16,
  },

  innerContainer: {
    flex: 1,
    alignItems: "center",
  },

  dateContainer: {
    alignItems: "center",
    justifyContent: "center",
    flex: 1,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    columnGap: 12,
    flex: 2,
  },

  button: {
    padding: 8,
    borderRadius: 6,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 6,
    borderWidth: 1,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 1,
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    fontFamily: "BarlowMedium",
    fontSize: 13,
    textTransform: "capitalize",
    textAlign: "center",
  },

  timeheaderText: {
    fontSize: 14,
    fontFamily: "BarlowMedium",
    textTransform: "capitalize",
    marginBottom: 4,
    opacity: 0.7,
  },

  timeText: {
    fontSize: 15,
    fontFamily: "BarlowSemiBold",
    textTransform: "capitalize",
  },

  separator: {
    width: 1,
    height: "80%",
    alignSelf: "center",
  },
});
