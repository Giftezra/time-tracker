import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { DayAvailabilityInterface } from "@/app/types/staff/availability";
import { MaterialIcons } from "@expo/vector-icons";

const AvailableDay = ({
  availability,
  onDelete,
  onUpdate,
  closeDisplay,
}: {
  availability?: DayAvailabilityInterface;
  onDelete: (id: number) => void;
  onUpdate: (id: number) => void;
  closeDisplay: () => void;
}) => {
  return (
    <View style={styles.container}>
      <View>
        <Text>{availability?.all_day ? "All Day" : ""}</Text>
        <View>
          <Text>Start Time</Text>
          <Text>{availability?.start_time}</Text>
        </View>
        <View>
          <Text>End Time</Text>
          <Text>{availability?.end_time}</Text>
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={() => onUpdate(availability?.id || 0)}
          style={styles.iconButton}
        >
          <MaterialIcons name="edit" size={24} color="#007AFF" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={() => onDelete(availability?.id || 0)}
          style={styles.iconButton}
        >
          <MaterialIcons name="delete" size={24} color="#FF3B30" />
        </TouchableOpacity>
      </View>
      <TouchableOpacity
        onPress={closeDisplay}
        style={styles.overlayCloseButton}
      >
        <MaterialIcons name="close" size={24} color="#007AFF" />
      </TouchableOpacity>
    </View>
  );
};

export default AvailableDay;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    backgroundColor: "white",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  timeContainer: {
    flex: 1,
  },
  timeText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
  },
  allDayText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#007AFF",
  },
  noteText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
  },
  iconButton: {
    padding: 8,
    marginLeft: 8,
  },

  overlayCloseButton: {
    position: "absolute",
    top: 0,
    right: 0,
  },
});
