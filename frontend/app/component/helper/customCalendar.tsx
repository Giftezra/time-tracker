import { StyleSheet, Text, View } from "react-native";
import React from "react";
import {Calendar} from "react-native-calendars";

const header = () => { 
  return (
    <Text>hell</Text>
  )
}

const CalendarComponent = ({ onSelectDate }: { onSelectDate: (date:string) => void }) => {
  return (
    <View style={styles.maincontainer}>
      <View style={styles.container}>
        <Calendar
          onDayPress={(day: any) => {
            const { day: selectedDay, month, year } = day;
            onSelectDate(`${year}-${month}-${selectedDay}`);
          }}
          markingType={"period"}
          markedDates={{
            "2025-02-15": { marked: true, dotColor: "#50cebb" },
            "2025-02-16": { marked: true, dotColor: "#50cebb" },
            "2025-02-21": {
              startingDay: true,
              color: "#50cebb",
              textColor: "white",
            },
            "2012-05-22": { color: "#70d7c7", textColor: "white" },
            "2012-05-23": {
              color: "#70d7c7",
              textColor: "white",
              marked: true,
              dotColor: "white",
            },
            "2012-05-24": { color: "#70d7c7", textColor: "white" },
            "2012-05-25": {
              endingDay: true,
              color: "#50cebb",
              textColor: "white",
            },
          }}
        />
      </View>
    </View>
  );
};

export default CalendarComponent;

const styles = StyleSheet.create({
  maincontainer: {
    position: "absolute",
    top: 0,
    bottom: 0,
    zIndex: 100,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },

  container: {
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 5,
    backgroundColor: "white",
    minWidth: 200,
    maxWidth: 300,
    shadowRadius: 5,
    elevation: 5,
    shadowColor: "gray",
  },
});
