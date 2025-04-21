import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  Pressable,
  TextInput,
  Alert,
} from "react-native";
import React, { useState, useEffect } from "react";
import { OpenTaskProps } from "@/app/types/management/task";
import { MaterialIcons } from "@expo/vector-icons";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";
import TimeScroller from "@/app/component/helper/timeScroller";
import DateScroller from "@/app/component/helper/dateScroller";
import ThemedHeaderText from "@/app/component/helper/ThemedHeaderText";
import TextInputComponent from "../../helper/textInput";
import SubtitleThemedText from "../../helper/SubtitleThemedText";
import InnerThemedText from "../../helper/InnerThemedText";
import ButtonText from "../../helper/ButtonText";
const EditTaskComponent = ({
  props,
  onPress,
}: {
  props: OpenTaskProps;
  onPress: () => void;
}) => {
  const { updateTask} = useManagementTask();

  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);
  const [taskDetails, setTaskDetails] = useState<OpenTaskProps|undefined>(undefined);

  const [isTimePickerVisible, setIsTimePickerVisible] = useState(false);

  const [startHours, setStartHours] = useState(0);
  const [startMinutes, setStartMinutes] = useState(0);
  const [endHours, setEndHours] = useState(0);
  const [endMinutes, setEndMinutes] = useState(0);
  const [activeTimePicker, setActiveTimePicker] = useState<
    "start" | "end" | "date" | null
  >(null);
  /* Get the time and date from the props, and set the state to the time and date. */
  useEffect(() => {
    if (props.task_start_time) {
      const [h, m] = props.task_start_time.split(":").map(Number);
      setStartHours(h);
      setStartMinutes(m);
    }
    if (props.task_end_time) {
      const [h, m] = props.task_end_time.split(":").map(Number);
      setEndHours(h);
      setEndMinutes(m);
    }
    if (props.task_start_date) {
      const date = new Date(props.task_start_date);
      setDay(date.getDate());
      setMonth(date.getMonth() + 1);
      setYear(date.getFullYear());
    }
    // Update taskDetails when props change
    setTaskDetails({
      contract_name: props.contract_name || "",
      contract_address: props.contract_address || "",
      contract_postcode: props.contract_postcode || "",
      task_description: props.task_description || "",
      task_serial: props.task_serial || "",
      required_number_of_staff: props.required_number_of_staff || 0,
    });
    // Ensure the hook is only called when the props change.
  }, [props]);

  /**
   * Handle the save button press which would update the task details on the server.
   * Spread the task details and add the task id to the details including the start and end time and date.
   * Call the updateTask function and pass the new task details.
   * If the response is successful, show an alert and close the modal.
   * If the response is not successful, show an alert.
   * The open tasks list will already be updated when this runs.
   */
  const handleSave = async () => {
    const newTaskDetails: OpenTaskProps = {
      ...taskDetails,
      task_id: props.task_id,
      task_start_time: `${startHours.toString().padStart(2, "0")}:${startMinutes
        .toString()
        .padStart(2, "0")}`,
      task_end_time: `${endHours.toString().padStart(2, "0")}:${endMinutes
        .toString()
        .padStart(2, "0")}`,
      task_end_date: `${year}-${month.toString().padStart(2, "0")}-${day
        .toString()
        .padStart(2, "0")}`,
      task_start_date: props.task_start_date,
    };
    updateTask(newTaskDetails);
  };

  return (
    <View style={styles.container}>
      <ThemedHeaderText text="Edit Task" />
      <View
        style={{
          borderBottomWidth: 1,
          padding: 10,
          marginBottom: 10,
        }}
      />

      <ScrollView style={styles.scrollView} nestedScrollEnabled>
        <View style={styles.taskInfo}>
          <TextInputComponent
            text="Task Serial"
            placeholder="Enter Task Serial"
            value={taskDetails?.task_serial}
            setValue={(text) =>
              setTaskDetails((prev) => ({ ...prev, task_serial: text }))
            }
          />

          <TextInputComponent
            text="Contract Name"
            placeholder="Enter Contract Name"
            value={taskDetails?.contract_name}
            setValue={(text) =>
              setTaskDetails((prev) => ({ ...prev, contract_name: text }))
            }
          />

          <TextInputComponent
            text="Address"
            placeholder="Enter Address"
            value={taskDetails?.contract_address}
            setValue={(text) =>
              setTaskDetails((prev) => ({ ...prev, contract_address: text }))
            }
          />

          <TextInputComponent
            text="Postcode"
            placeholder="Enter Postcode"
            value={taskDetails?.contract_postcode}
            setValue={(text) =>
              setTaskDetails((prev) => ({ ...prev, contract_postcode: text }))
            }
          />

          <TextInputComponent
            text="Description"
            placeholder="Enter Description"
            value={taskDetails?.task_description}
            setValue={(text) =>
              setTaskDetails((prev) => ({ ...prev, task_description: text }))
            }
            isMultiline={true}
            lines={4}
          />

          <TextInputComponent
            text="Required Number of Staff"
            placeholder="Enter Required Number of Staff"
            value={taskDetails?.required_number_of_staff?.toString()}
            setValue={(text) =>
              setTaskDetails((prev) => ({ ...prev, required_number_of_staff: parseInt(text) }))
            }
          />

          <View style={styles.timeSection}>
            <ThemedHeaderText text="Time Settings" />
            <Pressable
              style={[
                styles.timePickerButton,
                activeTimePicker === "start" && styles.activeTimePickerButton,
              ]}
              onPress={() =>
                setActiveTimePicker(
                  activeTimePicker === "start" ? null : "start"
                )
              }
            >
              <View style={styles.timePickerHeader}>
                <SubtitleThemedText text="Start Time" />
                <InnerThemedText text={`${startHours.toString().padStart(2, "0")}:${startMinutes
                    .toString()
                    .padStart(2, "0")}`} />
                <MaterialIcons name="access-time" size={24} color="#4a4a4a" />
              </View>
            </Pressable>

            {activeTimePicker === "start" && (
              <View style={styles.timePickerContainer}>
                <TimeScroller
                  value={startHours}
                  onChange={setStartHours}
                  max={24}
                />
                <InnerThemedText text=":" />
                <TimeScroller
                  value={startMinutes}
                  onChange={setStartMinutes}
                  max={60}
                />
              </View>
            )}

            <Pressable
              style={[
                styles.timePickerButton,
                activeTimePicker === "end" && styles.activeTimePickerButton,
              ]}
              onPress={() =>
                setActiveTimePicker(activeTimePicker === "end" ? null : "end")
              }
            >
              <View style={styles.timePickerHeader}>
                <SubtitleThemedText text="End Time" />
                <InnerThemedText text={`${endHours.toString().padStart(2, "0")}:${endMinutes
                    .toString()
                    .padStart(2, "0")}`} />
                <MaterialIcons name="access-time" size={24} color="#4a4a4a" />
              </View>
            </Pressable>

            {activeTimePicker === "end" && (
              <View style={styles.timePickerContainer}>
                <TimeScroller
                  value={endHours}
                  onChange={setEndHours}
                  max={24}
                />
                <InnerThemedText text=":" />
                <TimeScroller
                  value={endMinutes}
                  onChange={setEndMinutes}
                  max={60}
                />
              </View>
            )}

            <Pressable
              style={[
                styles.timePickerButton,
                activeTimePicker === "date" && styles.activeTimePickerButton,
              ]}
              onPress={() =>
                setActiveTimePicker(activeTimePicker === "date" ? null : "date")
              }
            >
              <View style={styles.timePickerHeader}>
                <SubtitleThemedText text="End Date" />
                <InnerThemedText text={`${day.toString().padStart(2, "0")}/${month
                    .toString()
                    .padStart(2, "0")}/${year}`} />
                <MaterialIcons name="date-range" size={24} color="#4a4a4a" />
              </View>
            </Pressable>

            {activeTimePicker === "date" && (
              <View style={styles.timePickerContainer}>
                <DateScroller
                  day={day}
                  month={month}
                  year={year}
                  onChangeDay={setDay}
                  onChangeMonth={setMonth}
                  onChangeYear={setYear}
                />
              </View>
            )}
          </View>

          <Pressable style={styles.saveButton} onPress={handleSave}>
            <ButtonText text="Save Changes" />
          </Pressable>
        </View>
      </ScrollView>
    </View>
  );
};

export default EditTaskComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
    borderRadius: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  header: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    marginBottom: 24,
    color: "#1a1a1a",
    textAlign: "center",
  },
  taskInfo: {
    padding: 5,
    backgroundColor: "#fff",
    borderRadius: 5,
    marginBottom: 24,
  },
  fieldLabel: {
    fontSize: 14,
    fontWeight: "600",
    color: "#4a4a4a",
    marginBottom: 8,
    fontFamily: "BarlowRegular",
    letterSpacing: 0.3,
  },
  input: {
    fontSize: 16,
    fontFamily: "BarlowRegular",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 10,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  textArea: {
    height: 120,
    textAlignVertical: "top",
    lineHeight: 20,
  },
  timeContainer: {
    flexDirection: "row",
    alignItems: "center",
    height: 120,
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    padding: 10,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    overflow: "hidden",
  },
  scrollContainer: {
    height: 150,
    width: 70,
    backgroundColor: "#fff",
    borderRadius: 8,
    marginHorizontal: 4,
    overflow: "hidden",
  },
  scrollContentContainer: {
    paddingVertical: 55,
  },
  timeItem: {
    height: 40,
    padding: 8,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
  },
  selectedTime: {
    borderBottomWidth: 1,
    borderBottomColor: "#0066ff",
    borderRadius: 8,
  },
  timeText: {
    fontSize: 18,
    fontFamily: "BarlowRegular",
  },
  selectedTimeText: {
    fontWeight: "800",
    fontFamily: "BarlowRegular",
  },
  timeSeparator: {
    fontSize: 24,
    marginHorizontal: 12,
    color: "#4a4a4a",
    fontWeight: "600",
  },
  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    borderRadius: 12,
    padding: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
    overflow: "hidden",
  },
  dateItem: {
    height: 40,
    justifyContent: "center",
    alignItems: "center",
    marginVertical: 2,
    paddingHorizontal: 12,
  },
  selectedDate: {
    borderBottomWidth: 1,
    borderBottomColor: "#0066ff",
    borderRadius: 8,
  },
  dateText: {
    fontSize: 16,
    color: "#4a4a4a",
    fontFamily: "BarlowRegular",
  },
  selectedDateText: {
    fontWeight: "800",
    fontFamily: "BarlowRegular",
  },
  saveButton: {
    backgroundColor: "#0066ff",
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 24,
    marginBottom: 16,
    shadowColor: "#0066ff",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    letterSpacing: 0.5,
  },
  scrollView: {
    flex: 1,
  },

  pickerButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  pickerButtonText: {
    fontSize: 16,
    color: "#4a4a4a",
    fontFamily: "BarlowRegular",
    marginRight: 12,
  },
  pickerIcon: {
    marginLeft: "auto",
  },

  timeSection: {
    backgroundColor: "#fff",
    borderRadius: 12,
    padding: 5,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },

  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
    fontFamily: "BarlowRegular",
  },

  timePickerButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    padding: 5,
    marginVertical: 2,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },

  activeTimePickerButton: {
    borderColor: "#0066ff",
    backgroundColor: "#f0f7ff",
  },

  timePickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  timePickerLabel: {
    fontSize: 16,
    color: "#4a4a4a",
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  },

  timeDisplay: {
    fontSize: 18,
    color: "#1a1a1a",
    fontFamily: "BarlowRegular",
    fontWeight: "600",
  },

  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    padding: 5,
  },
});
