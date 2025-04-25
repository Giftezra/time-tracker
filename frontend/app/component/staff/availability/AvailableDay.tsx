import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { DayAvailabilityInterface } from "@/app/types/staff/availability";
import { MaterialIcons } from "@expo/vector-icons";
import { TimePickerModal } from "react-native-paper-dates";

const AvailableDay = ({
  availability,
  onDelete,
  onUpdate,
  closeDisplay,
}: {
  availability?: DayAvailabilityInterface;
  onDelete: (id: number) => Promise<void>;
  onUpdate: (id: number, startTime: string, endTime: string) => Promise<void>;
  closeDisplay: () => void;
}) => {
  const [showStartPicker, setShowStartPicker] = useState(false);
  const [showEndPicker, setShowEndPicker] = useState(false);
  const [selectedStartTime, setSelectedStartTime] = useState(
    availability?.start_time || "00:00"
  );
  const [selectedEndTime, setSelectedEndTime] = useState(
    availability?.end_time || "00:00"
  );
  const [hasTimeChanged, setHasTimeChanged] = useState(false);

  const onDismissStart = () => {
    setShowStartPicker(false);
  };
  const onDismissEnd = () => {
    setShowEndPicker(false);
  };

  /* Confirm the start time and save it in the state */
  const onConfirmStart = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    setShowStartPicker(false);
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    setSelectedStartTime(formattedTime);
    setHasTimeChanged(true);
  };

  /* Confirm the end time and save it in the state */
  const onConfirmEnd = ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => {
    setShowEndPicker(false);
    const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
      .toString()
      .padStart(2, "0")}`;
    setSelectedEndTime(formattedTime);
    setHasTimeChanged(true);
  };


  const handleUpdate = async () => {
    await onUpdate(availability?.id || 0, selectedStartTime, selectedEndTime);
    closeDisplay();
  };

  const handleDelete = async () => {
    await onDelete(availability?.id || 0);
    closeDisplay();
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={closeDisplay}
        style={styles.overlayCloseButton}
      >
        <MaterialIcons name="close" size={24} color="#007AFF" />
      </TouchableOpacity>

      <View style={styles.timeContainer}>
        {availability?.all_day && (
          <Text style={styles.allDayText}>All Day</Text>
        )}
        <View>
          <Text style={styles.timeText}>Start Time</Text>
          <TouchableOpacity
            onPress={() => setShowStartPicker(true)}
            style={styles.timePickerButton}
          >
            <Text style={styles.timeText}>{selectedStartTime}</Text>
          </TouchableOpacity>
          <TimePickerModal
            visible={showStartPicker}
            onDismiss={onDismissStart}
            onConfirm={onConfirmStart}
            hours={parseInt(selectedStartTime.split(":")[0])}
            minutes={parseInt(selectedStartTime.split(":")[1])}
          />
        </View>
        <View>
          <Text style={styles.timeText}>End Time</Text>
          <TouchableOpacity
            onPress={() => setShowEndPicker(true)}
            style={styles.timePickerButton}
          >
            <Text style={styles.timeText}>{selectedEndTime}</Text>
          </TouchableOpacity>
          <TimePickerModal
            visible={showEndPicker}
            onDismiss={onDismissEnd}
            onConfirm={onConfirmEnd}
            hours={parseInt(selectedEndTime.split(":")[0])}
            minutes={parseInt(selectedEndTime.split(":")[1])}
          />
        </View>
      </View>

      <View style={styles.actionButtons}>
        <TouchableOpacity
          onPress={handleUpdate}
          style={[styles.iconButton, hasTimeChanged && styles.activeButton]}
        >
          <Text style={styles.iconButtonText}>update</Text>
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleDelete}
          style={styles.iconButton}
        >
          <Text style={styles.iconButtonText}>delete</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default AvailableDay;

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
    padding: 20,
    backgroundColor: "white",
    position: "relative",
  },
  timeContainer: {
    flex: 1,
    justifyContent: "center",
  },
  timeText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1C1C1E",
    marginVertical: 5,
    fontFamily: "BarlowMedium",
  },
  allDayText: {
    fontSize: 18,
    fontWeight: "600",
    color: "#007AFF",
    marginBottom: 10,
  },
  noteText: {
    fontSize: 14,
    color: "#8E8E93",
    marginTop: 4,
  },
  actionButtons: {
    flexDirection: "row",
    justifyContent: "center",
    paddingVertical: 15,
  },
  iconButton: {
    flex: 1,
    padding: 10,
    marginHorizontal: 10,
    alignItems: "center",
    borderRadius: 20,
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    shadowColor: "blue",
    backgroundColor: "white",
    borderWidth: 0.3,
  },

  iconButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#1C1C1E",
    textAlign: "center",
    textTransform: "capitalize",
  },
  overlayCloseButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 5,
  },
  timePickerButton: {
    padding: 8,
    backgroundColor: "#f0f0f0",
    borderRadius: 8,
    marginVertical: 5,
  },
  activeButton: {
    backgroundColor: "#007AFF",
  },
});
