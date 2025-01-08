import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import TimeSheetDatecomponent from "./timeSheetDate";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

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
  //Get he current month and day
  const date = new Date();
  const month = date.toLocaleDateString('default', { month: 'short' });
  const day = date.getDate();
  
  const inactiveBtn = useThemeColor({}, "inactivebtn");
  const activeBtn = useThemeColor({}, "activebtn");

  const [pressedIn, setPressedIn] = useState<string>("");

  const handleButtonPressIn = (value: string) => {
    setPressedIn(value);
  };

  return (
    <View style={styles.maincontainer}>
      {/* This part of the view contains the top part of the header */}
      <View style={[styles.container, { borderBottomWidth: 1 }]}>
        <View style={styles.dateContainer}>
          <TimeSheetDatecomponent month={month} day={day} />
        </View>
        <View style={styles.buttonContainer}>
          <Pressable
            style={[
              styles.button,
              { backgroundColor: inactiveBtn },
              pressedIn === "startBreak" && {
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
            onPress={startBreakButton}
            onFocus={() => handleButtonPressIn("startBreak")}
          >
            <MaterialCommunityIcons name="coffee" size={15} color="black" />
            <Text style={styles.buttonText}>start break</Text>
          </Pressable>

          <Pressable
            style={[
              styles.button,
              pressedIn === "clockOut" && {
                shadowOffset: { width: 0, height: 0 },
              },
            ]}
            onPress={clockOutButton}
            onFocus={() => handleButtonPressIn("clockOut")}
          >
            <MaterialCommunityIcons name="logout" size={15} color="black" />
            <Text style={styles.buttonText}>clock out</Text>
          </Pressable>
        </View>
      </View>

      {/* This part contains the lower part */}
      <View style={[styles.container, styles.lowerContainer]}>
        <View style={styles.innerContainer}>
          <Text style={styles.timeheaderText}>clock in</Text>
          <Text style={styles.timeText}>{clockInTime}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.innerContainer}>
          <Text style={styles.timeheaderText}>break</Text>
          <Text style={styles.timeText}>{breakTime}</Text>
        </View>
        <View style={styles.separator} />
        <View style={styles.innerContainer}>
          <Text style={styles.timeheaderText}>clock out</Text>
          <Text style={styles.timeText}>{clockOutTime}</Text>
        </View>
      </View>
    </View>
  );
};

export default TimeSheetHeaderComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: "column",
    padding: 2,
    borderRadius: 2,
    borderWidth: 0.2,
    marginHorizontal: 5,
    marginVertical: 5,
  },

  container: {
    flexDirection: "row",
    padding: 2,
    columnGap: 10,
  },

  lowerContainer: {
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  innerContainer: {
    padding: 2,
    flex: 1,
    alignItems: "center",
  },

  dateContainer: {
    alignItems: "center",
    justifyContent: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    padding: 2,
    justifyContent: "center",
    columnGap: 10,
  },

  button: {
    padding: 5,
    borderRadius: 5,
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    columnGap: 5,
    borderWidth: 0.2,
    shadowOffset: { width: 0, height: 2 },
  },

  buttonText: {
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    fontSize: 12,
    textTransform: "capitalize",
    textAlign: "center",
  },

  timeheaderText: {
    fontWeight: "500",
    fontSize: 13,
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },

  timeText: {
    fontWeight: "700",
    fontSize: 16,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  separator: {
    width: 1,
    height: '100%',
    backgroundColor: 'black',
  },
});