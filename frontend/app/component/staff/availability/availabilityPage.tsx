import {
  Alert,
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
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import TextInputComponent from "../../helper/textInput";
import RegistrationTextInputComponent from "../../helper/registrationTextinput";
import { useAvailability } from "@/app/context/staff/availabilityProvider";
import SubmitButtonComponent from "../../helper/submitButton";
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
    startTime,
    startDate,
    allDay,
    setAllDay,
    note,
    setNote,
    noteText,
    setNoteText,
    repeatStatus,
    endDate,
    endTime,
    createAvailability,
  } = useAvailability();

  const textInput = useThemeColor({}, "textinput");
  const inActiveBtn = useThemeColor({}, "inactivebtn");

  const [error, setError] = useState<ErrorInterface>({
    start_date: "",
    end_date: "",
    start_time: "",
    end_time: "",
    repeat: "",
    note: "",
  });

  /* Check that all field are filled before creating the availability */
  const handleAvailabilityCreation = () => {
    // If all day, set the error state accordingly to ensure the user provides the start and end time.
    if (!allDay) {
      // Check if the user provides the start_time and end_time
      if (!startTime || !endTime || !startDate || !endDate) {
        setError({
          start_date: "Start date is required",
          end_date: "End date is required",
          start_time: "Start time is required",
          end_time: "End time is required",
          repeat: "",
          note: "",
        });

        return;
      }
    } else {
      // Check if the user provides the start_date and end_date
      if (!startDate || !endDate) {
        setError({
          start_date: "Start date is required",
          end_date: "End date is required",
          start_time: "",
          end_time: "",
          repeat: "",
          note: "",
        });
        return;
      }
    }
    // Check if the start date is after the end date
    // Alert the user if it is
    if (startDate >= endDate) {
      Alert.alert("Start date cannot be after end date");
      return;
    }

    // Check if the start date ot end date is less than the current date
    // Alert the user if it is
    if (startDate < new Date() || endDate < new Date()) {
      Alert.alert("Start date or end date cannot be in the past");
      return;
    }

    // Check if start time is after end time - only check when dates are the same
    if (
      !allDay &&
      startDate &&
      endDate &&
      startDate.toDateString() === endDate.toDateString() &&
      startTime >= endTime
    ) {
      Alert.alert("Start time cannot be after end time on the same day");
      return;
    }

    // If all fields are filled, create the availability
    createAvailability();
  };

  return (
    <View style={styles.maincontainer}>
      <View style={styles.viewAvailabilityContainer}>
        <Text style={styles.headerText}>availabilty</Text>

        <Pressable onPress={onPress} style={styles.viewAvailabilityBtn}>
          <Text style={[styles.viewAvailabilityText, { textAlign: "auto" }]}>
            View your availability
          </Text>
        </Pressable>
      </View>

      <View style={{ padding: 5, flexWrap: "wrap" }}>
        <Text style={styles.informationText}>
          please choose your availabilty and enter a note if neccessary
        </Text>
      </View>

      {/* This component contains the availability details */}
      <View style={styles.rowContainer}>
        <View
          style={[
            styles.innerContainer,
            { flexDirection: "row", columnGap: 5, alignItems: "center" },
          ]}
        >
          <MaterialCommunityIcons name="clock" size={18} color="black" />
          <Text style={styles.otherHeaderText}>all day</Text>
        </View>
        <View style={styles.innerContainer}>
          <Switch value={allDay} onValueChange={() => setAllDay(!allDay)} />
        </View>
      </View>
      {/* starts in */}
      <View style={styles.rowContainer}>
        <Text style={styles.otherHeaderText}>starts</Text>
        <View style={styles.innerContainer}>
          <Pressable onPress={() => setStartDateOpen(!startDateOpen)}>
            <Text
              style={[
                styles.otherText,
                { color: error.start_date ? "red" : "black" },
              ]}
            >
              {startDate ? startDate.toLocaleDateString() : "select start date"}
            </Text>
          </Pressable>
          {/* Conditionally render the button only when the user does not chose to be off all day */}
          {!allDay && (
            <Pressable onPress={() => setStartTimeOpen(true)}>
              <Text
                style={[
                  styles.otherText,
                  { color: error.start_time ? "red" : "black" },
                ]}
              >
                {startTime || "select start time"}
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
                { color: error.end_date ? "red" : "black" },
              ]}
            >
              {endDate ? endDate.toLocaleDateString() : "select end date"}
            </Text>
          </Pressable>
          {/* Conditionally render the time modal if the user does not chose all day */}
          {!allDay && (
            <Pressable onPress={() => setEndTimeOpen(true)}>
              <Text
                style={[
                  styles.otherText,
                  { color: error.end_time ? "red" : "black" },
                ]}
              >
                {endTime || "select end time"}
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
              { color: error.repeat ? "red" : "black" },
            ]}
          >
            {repeatStatus}
          </Text>
        </Pressable>
      </View>

      {/* Note */}
      <View style={styles.rowContainer}>
        <Text style={styles.otherHeaderText}>note</Text>
        <Pressable onPress={() => setNote(!note)}>
          <Text
            style={[styles.otherText, { color: error.note ? "red" : "black" }]}
          >
            add a note
          </Text>
        </Pressable>
      </View>

      {note && (
        <View style={styles.rowContainer}>
          <TextInput
            value={noteText}
            onChangeText={setNoteText}
            placeholder="Enter note here"
            multiline
            numberOfLines={4}
            keyboardType="default"
            inputMode="text"
            style={[styles.input, { backgroundColor: textInput }]}
            autoCorrect
          />
        </View>
      )}

      {/* Call the submit button */}

      <Pressable
        onPress={handleAvailabilityCreation}
        style={[styles.submitButton, { backgroundColor: inActiveBtn }]}
      >
        <Text style={[styles.submitButtonText, { color: textInput }]}>
          create unavailiability
        </Text>
      </Pressable>

      {/* Time */}
      {/* Conditionally render the overlay when the user select clicks the repeaty button */}
      {overlayVisible && renderOverlay({ onPress: handleRepeatStatus })}

      <DatePickerModal
        locale="en"
        mode="single"
        visible={startDateOpen}
        onDismiss={() => setStartDateOpen(false)}
        date={startDate || new Date()}
        onConfirm={onConfirmStartDate}
        saveLabel="Save Start Date"
        animationType="slide"
      />

      <DatePickerModal
        locale="en"
        mode="single"
        visible={endDateOpen}
        onDismiss={() => setEndDateOpen(false)} // Close the end date modal
        date={endDate || new Date()} // Default to current date if no date selected
        onConfirm={onConfirmEndDate} // Use external method for end date confirmation
        saveLabel="Save End Date"
        animationType="slide"
      />

      <TimePickerModal
        locale="en"
        visible={startTimeOpen}
        onDismiss={() => setStartTimeOpen(false)}
        onConfirm={onStartTimeConfirm}
        hours={12}
        minutes={30}
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
        hours={12}
        minutes={30}
        label="Select end time"
        cancelLabel="Cancel"
        confirmLabel="Ok"
        animationType="slide"
      />
    </View>
  );
};

export default AvailabilityPageComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#f8f9fa",
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 8,
    paddingVertical: 12,
    paddingHorizontal: 16,
    backgroundColor: "white",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.18,
    shadowRadius: 1.0,
    elevation: 1,
  },

  innerContainer: {
    padding: 8,
    alignItems: "center",
    marginVertical: 4,
    rowGap: 8,
  },

  headerText: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    color: "#1a1a1a",
    marginBottom: 16,
  },

  informationText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "BarlowLight",
    color: "#666",
    marginBottom: 24,
  },

  otherHeaderText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "BarlowRegular",
    color: "#333",
    textTransform: "capitalize",
  },

  otherText: {
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "BarlowLight",
    color: "#666",
    padding: 4,
  },

  input: {
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    padding: 12,
    borderRadius: 8,
    flex: 1,
    minHeight: 100,
    textAlignVertical: "top",
  },

  viewAvailabilityContainer: {
    padding: 8,
    marginBottom: 24,
  },

  viewAvailabilityBtn: {
    padding: 12,
    borderRadius: 8,
    backgroundColor: "#007AFF",
  },

  viewAvailabilityText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "white",
    textAlign: "center",
  },

  overlayHeaderText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "#333",
    marginBottom: 16,
  },

  overlayContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "white",
    padding: 24,
    borderTopLeftRadius: 30,
    borderTopRightRadius: 30,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  overlayButtons: {
    padding: 8,
    marginVertical: 2,
    borderRadius: 5,
    borderBottomWidth: 1,
    width: "100%",
  },

  submitButton: {
    padding: 15,
    borderRadius: 10,
    alignItems: "center",
    borderWidth: 1,
    borderColor: "#007AFF",
    marginTop: 10,
  },

  submitButtonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
});
