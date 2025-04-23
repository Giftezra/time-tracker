import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import { useAvailability } from "@/app/context/staff/availabilityProvider";
import { CalendarList } from "react-native-calendars";
import { MaterialIcons } from "@expo/vector-icons";
import { useMemo, useState } from "react";
import AvailableDay from "./AvailableDay";
import { DayAvailabilityInterface } from "@/app/types/staff/availability";

const AvailabilityDetailsComponent = ({ onPress }: { onPress: () => void }) => {
  const { markedDates, isLoading, isDateDisabled, getDayAvailability, showDayAvailability, setShowDayAvailability, dayAvailability } =
    useAvailability();

  const handleDayPress = async (day: any) => {
    if (isDateDisabled(day.dateString, markedDates)) {
      return; // Ignore press on disabled dates
    }
    const date = day.dateString;
    console.log('date', date)
    await getDayAvailability(date);
  };

  return (
    <View style={styles.maincontainer}>
      <View style={styles.headerContainer}>
        <Text style={styles.headerText}>Availability Details</Text>
        <Pressable onPress={onPress} style={styles.closeButton}>
          <MaterialIcons name="close" size={24} color="black" />
        </Pressable>
      </View>
      {/* Display the calandarlist when the markedDates is not empty. other wise display the text "No availability set" */}
      {Object.keys(markedDates).length > 0 ? (
        <View style={styles.calendarContainer}>
          {isLoading ? (
            <ActivityIndicator
              size="large"
              color="#0000ff"
              style={{
                alignSelf: "center",
                justifyContent: "center",
                alignItems: "center",
              }}
            />
          ) : (
            <CalendarList
              onDayPress={(day) => {
                handleDayPress(day);
              }}
              markingType={"period"}
              markedDates={markedDates}
              dayComponent={({ date, state }) => {
                const dateStr = date?.dateString || "";
                const isDisabled = isDateDisabled(dateStr, markedDates);

                return (
                  <TouchableOpacity
                    onPress={() =>
                      !isDisabled &&
                      date &&
                      handleDayPress(date)
                    }
                    style={[
                      styles.dayContainer,
                      isDisabled && styles.disabledDay,
                      markedDates[dateStr] && styles.unavailableDay,
                    ]}
                  >
                    <Text
                      style={[
                        styles.dayText,
                        isDisabled && styles.disabledText,
                        markedDates[dateStr] && styles.unavailableText,
                      ]}
                    >
                      {date?.day}
                    </Text>
                  </TouchableOpacity>
                );
              }}
              theme={{
                backgroundColor: "red",
                calendarBackground: "#ffffff",
                monthTextColor: "#0066cc",
                textSectionTitleColor: "#ff0000",
                selectedDayBackgroundColor: "#00adf5",
                selectedDayTextColor: "#ffffff",
                todayTextColor: "#00adf5",
                dayTextColor: "#2d4150",
                textDisabledColor: "#d9e1e8",
              }}
              pastScrollRange={12}
              futureScrollRange={12}
              scrollEnabled={true}
              showScrollIndicator={false}
              calendarHeight={320}
            />
          )}
        </View>
      ) : (
        <Text style={styles.noAvailabilityText}>No availability set</Text>
      )}

      {/* Display a view with position absolute to the bottom of the screen with the day availability details */}
      {showDayAvailability && (
        <View style={styles.dayAvailabilityContainer}>
          <AvailableDay
            availability={dayAvailability}
            onDelete={() => {}}
            onUpdate={() => {}}
            closeDisplay={() => setShowDayAvailability(false)}
          />
        </View>
      )}
    </View>
  );
};

export default AvailabilityDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 15,
    backgroundColor: "white",
    marginHorizontal: 10,
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
    padding: 5,
    borderRadius: 8,
  },

  closeButtonText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },
  noAvailabilityText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
    textAlign: "center",
    marginTop: 10,
  },
  dayContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding:5,
    borderRadius:20,
  },
  dayText: {
    fontSize: 16,
    fontWeight: "500",
    color: "#666",
  },

  disabledDay: {
    opacity: 0.7,
  },
  disabledText: {
    color: "gray",
    fontFamily: "BarlowMedium",
    fontSize: 14,
    fontWeight: "700",
  },
  unavailableDay: {
    backgroundColor: "blue",
    padding:7,
    borderRadius:20,
  },
  unavailableText: {
    color: "#c8c8c8",
  },

  dayAvailabilityContainer: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    top:0,
    zIndex: 1000,
    marginHorizontal: 10,
    backgroundColor: "white",
    maxHeight: 300,
    maxWidth: 300,
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "gray",
    justifyContent: "center",
    alignItems: "center",
  },
});
