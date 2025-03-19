import { StyleSheet, Text, ScrollView, Pressable } from "react-native";
import React from "react";

interface TimeScrollerProps {
  value: number;
  onChange: (val: number) => void;
  max: number;
}

const TimeScroller: React.FC<TimeScrollerProps> = ({
  value,
  onChange,
  max,
}) => {
  return (
    <ScrollView
      style={styles.scrollContainer}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContentContainer}
      decelerationRate="fast"
      snapToInterval={40}
      nestedScrollEnabled
    >
      {Array.from({ length: max }, (_, i) => (
        <Pressable
          key={i}
          style={({ pressed }) => [
            styles.timeItem,
            value === i && styles.selectedTime,
            pressed && styles.pressedItem,
          ]}
          onPress={() => onChange(i)}
        >
          <Text
            style={[
              styles.timeText,
              value === i && styles.selectedTimeText,
            ]}
          >
            {i.toString().padStart(2, "0")}
          </Text>
        </Pressable>
      ))}
    </ScrollView>
  );
};

export default TimeScroller;

const styles = StyleSheet.create({
  scrollContainer: {
    height: 180,
    width: 80,
    backgroundColor: "#252525",
    borderRadius: 10,
    marginHorizontal: 2,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#333333",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 6,
  },
  scrollContentContainer: {
    paddingVertical: 70,
  },
  timeItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
    paddingHorizontal: 12,
    borderRadius: 5,
  },
  selectedTime: {
    backgroundColor: "rgba(0, 102, 255, 0.15)",
    borderBottomWidth: 2,
    borderBottomColor: "#0066ff",
  },
  pressedItem: {
    backgroundColor: "rgba(255, 255, 255, 0.05)",
  },
  timeText: {
    fontSize: 18,
    color: "#e0e0e0",
    fontFamily: "BarlowMedium",
    letterSpacing: 1,
  },
  selectedTimeText: {
    color: "#0066ff",
    fontFamily: "BarlowSemiBold",
    fontSize: 20,
  },
});