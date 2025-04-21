import { StyleSheet, Text, View, ScrollView, Pressable } from "react-native";
import React from "react";

interface DateScrollerProps {
  day: number;
  month: number;
  year: number;
  onChangeDay: (val: number) => void;
  onChangeMonth: (val: number) => void;
  onChangeYear: (val: number) => void;
}

const DateScroller: React.FC<DateScrollerProps> = ({
  day,
  month,
  year,
  onChangeDay,
  onChangeMonth,
  onChangeYear,
}) => {
  return (
    <View style={styles.dateContainer}>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        decelerationRate="fast"
        snapToInterval={40}
        nestedScrollEnabled
      >
        {Array.from({ length: 31 }, (_, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [
              styles.dateItem,
              day === i + 1 && styles.selectedDate,
              pressed && styles.pressedItem,
            ]}
            onPress={() => onChangeDay(i + 1)}
          >
            <Text
              style={[
                styles.dateText,
                day === i + 1 && styles.selectedDateText,
              ]}
            >
              {(i + 1).toString().padStart(2, "0")}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        decelerationRate="fast"
        snapToInterval={40}
        nestedScrollEnabled
      >
        {Array.from({ length: 12 }, (_, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [
              styles.dateItem,
              month === i + 1 && styles.selectedDate,
              pressed && styles.pressedItem,
            ]}
            onPress={() => onChangeMonth(i + 1)}
          >
            <Text
              style={[
                styles.dateText,
                month === i + 1 && styles.selectedDateText,
              ]}
            >
              {(i + 1).toString().padStart(2, "0")}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
      <ScrollView
        style={styles.scrollContainer}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContentContainer}
        decelerationRate="fast"
        snapToInterval={40}
        nestedScrollEnabled
      >
        {Array.from({ length: 31 }, (_, i) => (
          <Pressable
            key={i}
            style={({ pressed }) => [
              styles.dateItem,
              year === 2020 + i && styles.selectedDate,
              pressed && styles.pressedItem,
            ]}
            onPress={() => onChangeYear(2020 + i)}
          >
            <Text
              style={[
                styles.dateText,
                year === 2020 + i && styles.selectedDateText,
              ]}
            >
              {2020 + i}
            </Text>
          </Pressable>
        ))}
      </ScrollView>
    </View>
  );
};

export default DateScroller;

const styles = StyleSheet.create({
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#1a1a1a",
    borderRadius: 5,
    padding: 5,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#333333",
    overflow: "hidden",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 6,
    elevation: 8,
  },
  scrollContainer: {
    height: 180,
    width: 80,
    backgroundColor: "#252525",
    borderRadius: 5,
    marginHorizontal: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333333",
  },
  scrollContentContainer: {
    paddingVertical: 70,
  },
  dateItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  selectedDate: {
    backgroundColor: "rgba(0, 102, 255, 0.15)",
    borderBottomWidth: 2,
    borderBottomColor: "#0066ff",
  },
  pressedItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  dateText: {
    fontSize: 18,
    color: "#e0e0e0",
    fontFamily: "BarlowMedium",
  },
  selectedDateText: {
    color: "#0066ff",
    fontFamily: "BarlowSemiBold",
    fontSize: 20,
  },
});
