import { StyleSheet, TouchableOpacity, View, Text } from "react-native";
import { Calendar } from "react-native-calendars";
import { useStaffTask } from "@/app/context/staff/staffTaskProvider";
import { arrowDown } from "@/app/utils/animations/onboardingAnimation";

const CalenderComponent = ({ markedDates }: { markedDates: string }) => {
  const { handleMonthChangeEvent, handleDaySelectedEvent, isDateDisabled } =
    useStaffTask();

  return (
    <View style={styles.maincontainer}>
      <Calendar
        /* Get the exact day, month and year for the date clicked */
        onDayPress={(day: any) => {
          handleDaySelectedEvent(day);
        }}
        dayComponent={({ date, state }: { date: any; state: any }) => {
          const dateString = date.dateString;
          const isDisabled = isDateDisabled(dateString, markedDates);
          return (
            <TouchableOpacity
              onPress={() =>
                !isDisabled &&
                date &&
                handleDaySelectedEvent(date)
              }
              style={[
                styles.dayContainer,
                isDisabled && styles.disabledDay,
                markedDates[dateString] && styles.taskDay,
              ]}
            >
              <Text
                style={[
                  styles.dayText,
                  isDisabled && styles.disabledText,
                  markedDates[dateString] && styles.unavailableText,
                ]}
              >
                {date?.day}
              </Text>
            </TouchableOpacity>
          );
        }}
        // Get the month change event
        onMonthChange={(month: any) => handleMonthChangeEvent(month)}
        firstDay={1}
        showWeekNumbers={true}
        markingType="period"
        markedDates={markedDates}
        theme={{
          textDayFontSize: 12,
          textMonthFontSize: 15,
          textDayHeaderFontSize: 12,
          todayTextColor: "red",
          selectedDayBackgroundColor: "green",
          dayTextColor: "#2d4150",
          arrowColor: "green",
          "stylesheet.calendar.main": {
            container: { paddingHorizontal: 10, paddingVertical: 10 },
          },
        }}
      />
    </View>
  );
};

export default CalenderComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    overflow: "hidden",
  },
  dayContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 20,
  },
  dayText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "BarlowMedium",
    color: "#666",
  },
  disabledDay: {
    opacity: 0.7,
  },
  disabledText: {
    color: "red",

  },
  taskDay : {
    backgroundColor: "blue",
    padding: 8,
    borderRadius: 20,
    shadowColor: "red",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,

  },
  unavailableText: {
    color: "white",
    fontFamily: "BarlowMedium",
    fontSize: 14,
    fontWeight: "700",

  },
});
