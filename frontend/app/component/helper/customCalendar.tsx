import React, { useState } from "react";
import { View, Text, TouchableOpacity, StyleSheet } from "react-native";
import { Calendar } from "react-native-calendars";

interface CustomCalendarProps {
  onSelectDate: (date: string) => void;
}

const CustomCalendar: React.FC<CustomCalendarProps> = ({ onSelectDate }) => {
  const [selectedDate, setSelectedDate] = useState("");

  const handleDayPress = (day: any) => {
    setSelectedDate(day.dateString);
    onSelectDate(day.dateString);
  };

  // Get current date for maxDate
  const today = new Date();
  const maxDate = today.toISOString().split("T")[0];

  // Calculate minimum date (must be at least 18 years old)
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - 100); // Allow dates up to 100 years ago
  const minDateString = minDate.toISOString().split("T")[0];

  return (
    <View style={styles.container}>
      <Calendar
        onDayPress={handleDayPress}
        markedDates={{
          [selectedDate]: { selected: true, selectedColor: "#2563EB" },
        }}
        maxDate={maxDate}
        minDate={minDateString}
        enableSwipeMonths={true}
        theme={{
          todayTextColor: "#2563EB",
          selectedDayBackgroundColor: "#2563EB",
          selectedDayTextColor: "#ffffff",
          textDayFontFamily: "BarlowRegular",
          textMonthFontFamily: "BarlowRegular",
          textDayHeaderFontFamily: "BarlowRegular",
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 15,
    marginVertical: 10,
    overflow: "hidden",
  },
});

export default CustomCalendar;
