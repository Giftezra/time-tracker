import {
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

const renderOverlay = ({ onPress }: { onPress: (id: string) => void }) => {
  return (
    <View style={styles.overlayContainer}>
      <Text style={styles.overlayHeaderText}>Choose frequency</Text>

      <Pressable
        onPress={() => onPress("repeat")}
        style={styles.overlayButtons}
      >
        <Text style={styles.otherHeaderText}>repeat</Text>
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
    onTimeDimiss,
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
    setStartTime,
    startDate,
    setStartDate,
    allDay,
    setAllDay,
    note,
    setNote,
    noteText,
    setNoteText,
    repeatStatus,
    endDate,
    setEndDate,
    endTime,
  } = useAvailability();

  const textInput = useThemeColor({}, "textinput");

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
            <Text style={styles.otherText}>
              {startDate ? startDate.toLocaleDateString() : "Select Date"}
            </Text>
          </Pressable>
          {/* Conditionally render the button only when the user does not chose to be off all day */}
          {!allDay && (
            <Pressable onPress={() => setStartTimeOpen(true)}>
              <Text style={styles.otherText}>
                {startTime || "Select start time"}
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
            <Text style={styles.otherText}>
              {endDate ? endDate.toLocaleDateString() : "Select Date"}
            </Text>
          </Pressable>
          {/* Conditionally render the time modal if the user does not chose all day */}
          {!allDay && (
            <Pressable onPress={() => setEndTimeOpen(true)}>
              <Text style={styles.otherText}>
                {endTime || "Select end time"}
              </Text>
            </Pressable>
          )}
        </View>
      </View>

      {/* Repeat */}
      <View style={styles.rowContainer}>
        <Text style={styles.otherHeaderText}>repeat</Text>
        <Pressable onPress={() => setOverlayVisible(!overlayVisible)}>
          <Text style={styles.otherText}>{repeatStatus}</Text>
        </Pressable>
      </View>

      {/* Note */}
      <View style={styles.rowContainer}>
        <Text style={styles.otherHeaderText}>note</Text>
        <Pressable onPress={() => setNote(!note)}>
          <Text style={styles.otherText}>add a note</Text>
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
      <View style={{ flex: 0.2 }}>
        <SubmitButtonComponent
          title="create availability"
          onPress={onDismiss}
        />
      </View>

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
        saveLabel="Save date"
        animationType="slide"
      />

      <DatePickerModal
        locale="en"
        mode="single"
        visible={endDateOpen}
        onDismiss={() => setEndDateOpen(false)} // Close the end date modal
        date={endDate || new Date()} // Default to current date if no date selected
        onConfirm={onConfirmEndDate} // Use external method for end date confirmation
        saveLabel="Save date"
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
    padding: 5,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 5,
    marginHorizontal: 5,
    padding: 5,
  },

  innerContainer: {
    padding: 5,
    alignItems: "center",
    marginVertical: 5,
    rowGap: 10,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    textAlign: "center",
    padding: 5,
  },

  informationText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    padding: 1,
  },

  otherHeaderText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    textAlign: "center",
    padding: 1,
  },

  otherText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    textAlign: "center",
    padding: 1,
  },

  input: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 5,
    flex: 1,
  },

  viewAvailabilityContainer: {
    padding: 5,
    margin: 5,
    borderRadius: 5,
  },

  viewAvailabilityBtn: {
    padding: 5,
    borderRadius: 5,
    backgroundColor: "gray",
  },

  viewAvailabilityText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 5,
  },
  // These styles are for the overlay

  overlayHeaderText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    textAlign: "center",
    padding: 5,
  },

  overlayContainer: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(5,0,0.5)",
    justifyContent: "center",
    alignItems: "center",
  },

  overlayButtons: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
  },
});
