import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { DatePickerInput, DatePickerModal } from "react-native-paper-dates";
import CalenderComponent from "../helper/calender";
import { useAvailability } from "@/app/context/staff/availabilityProvider";

const AvailabilityDetailsComponent = ({ onPress }: { onPress: () => void }) => {
  const { setMarkedDates, markedDates } = useAvailability();

  return (
    <View style={styles.maincontainer}>
      <View style={styles.headerContainer}>
        <Text>Availability details</Text>
        <Pressable onPress={onPress}>
          <Text>Close</Text>
        </Pressable>
      </View>

      <View>
        <View style={styles.calendarContainer}>
          <CalenderComponent
            setSelectedDate={setMarkedDates}
            markedDates={markedDates}
          />
        </View>

        
      </View>
    </View>
  );
};

export default AvailabilityDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 2,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },

  calendarContainer: {
    flex: 1,
    borderRadius: 2,
    borderWidth: 1,
    overflow: "hidden",
    backgroundColor: "white",
  },
});
