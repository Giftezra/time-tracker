import {
  Alert,
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Switch,
  SwitchBase,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useAvailability } from "@/app/context/staff/availabilityProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ErrorInterface } from "@/app/types/staff/availability";

const renderOverlay = ({ onPress }: { onPress: (id: string) => void }) => {
  return (
    <View style={styles.overlayContainer}>
      <Text style={styles.overlayHeaderText}>Choose frequency</Text>
      <Pressable onPress={() => onPress("daily")} style={styles.overlayButtons}>
        <Text style={styles.otherHeaderText}>daily</Text>
      </Pressable>
      <Pressable
        onPress={() => onPress("weekly")}
        style={styles.overlayButtons}
      >
        <Text style={styles.otherHeaderText}>weekly</Text>
      </Pressable>
      <Pressable
        onPress={() => onPress("monthly")}
        style={styles.overlayButtons}
      >
        <Text style={styles.otherHeaderText}>monthly</Text>
      </Pressable>
      <Pressable onPress={() => onPress("never")} style={styles.overlayButtons}>
        <Text style={styles.otherHeaderText}>never</Text>
      </Pressable>
    </View>
  );
};

const AvailabilityPageComponent = ({ onPress }: { onPress: () => void }) => {
  const {
    onConfirmEndDate,
    onConfirmStartDate,
    onDismiss,
    onEndTimeConfirm,
    onStartTimeConfirm,
    handleRepeatStatus,
    startDateOpen,
    setStartDateOpen,
    endDateOpen,
    setEndDateOpen,
    startTimeOpen,
    setStartTimeOpen,
    endTimeOpen,
    setEndTimeOpen,
    overlayVisible,
    setOverlayVisible,
    repeatStatus,
    handleAvailabilityCreation,
    error,
    handleAvailability,
    availability,
    noteOpen,
    setNoteOpen,
  } = useAvailability();

  const textInput = useThemeColor({}, "textinput");

  return (
    <KeyboardAvoidingView
      style={styles.maincontainer}
      behavior="padding"
      keyboardVerticalOffset={100}
      
    >
      <View style={styles.header}>
        <Text style={styles.headerText}>Availability Management</Text>
        <Pressable onPress={onPress} style={styles.viewAvailabilityBtn}>
          <Text style={styles.viewAvailabilityText}>View Schedule</Text>
          <Text style={{ fontSize: 20 }}>🗓️</Text>
        </Pressable>
      </View>

      <Text style={styles.informationText}>
        Set your availability window and preferences below
      </Text>

      <View style={styles.formSection}>
        <View style={styles.rowContainer}>
          <View style={styles.labelContainer}>
            <Text style={{ fontSize: 20 }}>⏲️</Text>
            <Text style={styles.otherHeaderText}>All Day</Text>
          </View>
          <Switch
            value={availability?.all_day}
            onValueChange={() => handleAvailability("all_day", !availability?.all_day)}
            trackColor={{ false: "#d1d1d1", true: "#007AFF50" }}
            thumbColor={availability?.all_day ? "#007AFF" : "#f4f3f4"}
          />
        </View>

        {/* starts in */}
        <View style={styles.rowContainer}>
          <Text style={styles.otherHeaderText}>starts</Text>
          <View style={styles.innerContainer}>
            <Pressable onPress={() => setStartDateOpen(!startDateOpen)}>
              <Text
                style={[
                  styles.otherText,
                  { color: error?.start_date ? "red" : "black" },
                ]}
              >
                {availability?.start_date
                  ? availability?.start_date.toLocaleDateString()
                  : "select start date"}
              </Text>
            </Pressable>
            {/* Conditionally render the button only when the user does not chose to be off all day */}
            {!availability?.all_day && (
              <Pressable onPress={() => setStartTimeOpen(true)}>
                <Text
                  style={[
                    styles.otherText,
                    { color: error?.start_time ? "red" : "black" },
                  ]}
                >
                  {availability?.start_time || "select start time"}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Ends in */}
        <View style={styles.rowContainer}>
          <Text style={styles.otherHeaderText}>ends</Text>
          <View style={styles.innerContainer}>
            <Pressable onPress={() => setEndDateOpen(!endDateOpen)}>
              <Text
                style={[
                  styles.otherText,
                  { color: error?.end_date ? "red" : "black" },
                ]}
              >
                {availability?.end_date ? availability?.end_date.toLocaleDateString() : "select end date"}
              </Text>
            </Pressable>
            {/* Conditionally render the time modal if the user does not chose all day */}
            {!availability?.all_day && (
              <Pressable onPress={() => setEndTimeOpen(true)}>
                <Text
                  style={[
                    styles.otherText,
                    { color: error?.end_time ? "red" : "black" },
                  ]}
                >
                  {availability?.end_time || "select end time"}
                </Text>
              </Pressable>
            )}
          </View>
        </View>

        {/* Repeat */}
        <View style={styles.rowContainer}>
          <Text style={styles.otherHeaderText}>repeat</Text>
          <Pressable onPress={() => setOverlayVisible(!overlayVisible)}>
            <Text
              style={[
                styles.otherText,
                { color: error?.repeat ? "red" : "black" },
              ]}
            >
              {repeatStatus}
            </Text>
          </Pressable>
        </View>

        {/* Note */}
        <View style={styles.rowContainer}>
          <Text style={styles.otherHeaderText}>note</Text>
          <Pressable onPress={() => setNoteOpen(!noteOpen)}>
            <Text
              style={[
                styles.otherText,
                { color: error?.note ? "red" : "black" },
              ]}
            >
              add a note
            </Text>
          </Pressable>
        </View>
      </View>

      {noteOpen && (
        <View style={styles.noteContainer}>
          <TextInput
            value={availability?.note}
            onChangeText={(text) => handleAvailability("note", text)}
            placeholder="Add any additional notes here..."
            multiline
            numberOfLines={4}
            style={[styles.input, { backgroundColor: textInput }]}
            autoCorrect
          />
        </View>
      )}

      <Pressable
        onPress={handleAvailabilityCreation}
        style={({ pressed }) => [
          styles.submitButton,
          { backgroundColor: pressed ? "#0056b3" : "#007AFF" },
        ]}
      >
        <Text style={styles.submitButtonText}>Set Unavailability</Text>
      </Pressable>

      {/* Time */}
      {/* Conditionally render the overlay when the user select clicks the repeaty button */}
      {overlayVisible && renderOverlay({ onPress: handleRepeatStatus })}

      <DatePickerModal
        locale="en"
        mode="single"
        visible={startDateOpen}
        onDismiss={() => setStartDateOpen(false)}
        date={availability?.start_date || new Date()}
        onConfirm={onConfirmStartDate}
        saveLabel="Save Start Date"
        animationType="slide"
      />

      <DatePickerModal
        locale="en"
        mode="single"
        visible={endDateOpen}
        onDismiss={() => setEndDateOpen(false)}
        date={availability?.end_date || new Date()}
        onConfirm={onConfirmEndDate}
        saveLabel="Save End Date"
        animationType="slide"
      />

      <TimePickerModal
        locale="en"
        visible={startTimeOpen}
        onDismiss={() => setStartTimeOpen(false)}
        onConfirm={onStartTimeConfirm}
        hours={availability?.start_time?.split(":")[0]}
        minutes={availability?.start_time?.split(":")[1]}
        label="Select start time"
        cancelLabel="Cancel"
        confirmLabel="Ok"
        animationType="slide"
      />

      <TimePickerModal
        locale="en"
        visible={endTimeOpen}
        onDismiss={() => setEndTimeOpen(false)}
        onConfirm={onEndTimeConfirm}
        hours={availability?.end_time?.split(":")[0]}
        minutes={availability?.end_time?.split(":")[1]}
        label="Select end time"
        cancelLabel="Cancel"
        confirmLabel="Ok"
        animationType="slide"
      />
    </KeyboardAvoidingView>
  );
};

export default AvailabilityPageComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  header: {
    padding: 10,
    backgroundColor: "white",
    borderBottomWidth: 2,
    borderBottomColor: "#e1e1e1",
    marginBottom: 16,
  },

  headerText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "BarlowMedium",
    marginBottom: 16,
  },

  formSection: {
    backgroundColor: "white",
    borderRadius: 12,
    marginHorizontal: 16,
    marginBottom: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },

  labelContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  informationText: {
    fontSize: 15,
    fontFamily: "BarlowLight",
    color: "#666",
    marginHorizontal: 16,
    marginBottom: 24,
  },

  otherHeaderText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "BarlowMedium",
    color: "#333",
    textTransform: "capitalize",
  },

  otherText: {
    fontSize: 15,
    fontFamily: "BarlowLight",
    color: "#666",
    padding: 8,
  },

  noteContainer: {
    margin: 16,
    backgroundColor: "white",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  input: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    padding: 16,
    borderRadius: 12,
    minHeight: 120,
    textAlignVertical: "top",
  },

  viewAvailabilityBtn: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },

  viewAvailabilityText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "white",
  },

  submitButton: {
    margin: 16,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "#007AFF",
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "white",
    textTransform: "capitalize",
  },

  overlayContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    padding: 24,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 8,
  },

  overlayHeaderText: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "#333",
    marginBottom: 16,
  },

  overlayButtons: {
    padding: 16,
    marginVertical: 4,
    borderRadius: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#f0f0f0",
  },
});
