import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { useAvailability } from "@/app/context/staff/availabilityProvider";
import { Calendar, CalendarList } from "react-native-calendars";

const AvailabilityDetailsComponent = ({ onPress }: { onPress: () => void }) => {
  const { markedDates } = useAvailability();

  return (
    <View style={styles.maincontainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Availability Details</Text>
        <Pressable onPress={onPress} style={styles.closeButton}>
          <Text style={styles.closeButtonText}>Close</Text>
        </Pressable>
      </View>

      <View style={styles.calendarContainer}>
        <CalendarList
          markingType={"period"}
          markedDates={markedDates}
          theme={{
            backgroundColor: "#ffffff",
            calendarBackground: "#ffffff",
            textSectionTitleColor: "#b6c1cd",
            selectedDayBackgroundColor: "#00adf5",
            selectedDayTextColor: "#ffffff",
            todayTextColor: "#00adf5",
            dayTextColor: "#2d4150",
            textDisabledColor: "#d9e1e8",
            monthTextColor: "#2d4150",
          }}
          pastScrollRange={12}
          futureScrollRange={12}
          scrollEnabled={true}
          showScrollIndicator={false}
          calendarHeight={320}
        />
      </View>
    </View>
  );
};

export default AvailabilityDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 10,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginBottom: 15,
    backgroundColor: "white",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
  },

  calendarContainer: {
    flex: 1,
    borderRadius: 5,
    overflow: "hidden",
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.23,
    shadowRadius: 2.62,
    elevation: 4,
    borderWidth: 1,
    borderColor: "gray",
  },

  headerText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "#1a1a1a",
  },

  closeButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f0f0f0",
  },

  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
});
