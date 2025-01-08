import { StyleSheet, View } from "react-native";
import { Calendar } from "react-native-calendars";
import { useTask } from "@/app/context/staff/staffTaskProvider";
import {arrowDown} from "@/app/utils/animations/onboardingAnimation";

const CalenderComponent = ({
  setSelectedDate,
  markedDates,
}: {
  setSelectedDate: (date: string) => void;
  markedDates: string;
}) => {
  return (
    <View style={styles.maincontainer}>
      <Calendar
        onDayPress={({ day }: { day: string }) => {
          setSelectedDate(day);
        }}
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
