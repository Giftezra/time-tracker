import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTask } from "@/app/context/staff/staffTaskProvider";
import {arrowDown} from "@/app/utils/animations/onboardingAnimation";

const CalenderComponent = ({
  markedDates,
}: {
  markedDates: string;
}) => {
  const { handleMonthChangeEvent, handleDaySelectedEvent } = useTask();

  return (
    <View style={styles.maincontainer}>
      <Calendar
      /* Get the exact day, month and year for the date clicked */
          onDayPress={(day: any) => {
            handleDaySelectedEvent(day);
          }}
          // Get the month change event
        onMonthChange={(month:any) => handleMonthChangeEvent(month)}
        firstDay={1}
        showWeekNumbers={true}
        markedDates={markedDates}
        theme={{
          textDayFontSize: 12,
          textMonthFontSize: 15,
          textDayHeaderFontSize: 12,
          todayTextColor: "red",
          selectedDayBackgroundColor: "green",
          dayTextColor: "#2d4150",
          arrowColor: "red",
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
    padding: 2,
    marginBottom: 10,
  },
});
