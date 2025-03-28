import {
  ActionSheetIOS,
  ActivityIndicator,
  Button,
  Image,
  Modal,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

import { ca, DatePickerModal, TimePickerModal } from "react-native-paper-dates";

import { EmployeeType } from "@/app/types/management/employee";
import { user_image } from "@/app/utils/images";
import {
  ContractListType,
  CreateTaskInterface,
} from "@/app/types/management/task";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import ButtonComponent from "../../helper/buttons";
import TextInputComponent from "../../helper/textInput";
import SubmitButtonComponent from "../../helper/submitButton";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";

const CreateTaskComponent = () => {
  const {
    contractList,
    employeeList,
    onConfirmDate,
    onConfirmStartTime,
    onConfirmEndTime,
    onDateDismiss,
    onStartTimeDismiss,
    onEndTimeDismiss,
    handleDateDisplay,
    handleStartTimeDisplay,
    handleEndTimeDisplay,
    dateVisible,
    startTimeVisible,
    endTimeVisible,
    isLoading,
    dates,
    startTime,
    endTime,
    collectNewTaskData,
    taskData,
    getAvailableEmployees: get_available_employees,
    handleTaskCreation,
  } = useManagementTask();

  const primary = useThemeColor({}, "primaryColor");
  const text = useThemeColor({}, "text");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const innerBackground = useThemeColor({}, "innerBackground");
  const hightlight = useThemeColor({}, "highlight");
  const textinput = useThemeColor({}, "textinput");
  const otherText = useThemeColor({}, "otherText");

  const [siteSelected, setSiteSelected] = useState<ContractListType | null>(
    null
  );
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeType[]>(
    []
  );
  const [selected, setSelected] = useState<string>("");
  const [isCreating, setIsCreating] = useState(false);
  const [error, setError] = useState<string | null>(null);

  /**
   * The method is used to handle the toggling of the contract list and the list of employees.
   * When one is selected, the other is unselected so it is closed.
   * @param selected the selected item
   * @returns void
   */
  const handleToggleSites = (selected: string) => {
    if (selected === "contracts" || selected === "employees") {
      setSelected((prevSelected) =>
        prevSelected === selected ? "" : selected
      );
    }
  };

  /**
   * This method is used to gather all of the selected component, and would handle the creation of the task
   * To do this, it will call the create_task method from the management task context and pass the required parameters
   */

  const handleEmployeeSelection = (employee: EmployeeType) => {
    setSelectedEmployees((prev) => {
      const isSelected = prev.some(
        (e) => e.employee_id === employee.employee_id
      );
      if (isSelected) {
        // Remove employee if already selected
        const filtered = prev.filter(
          (e) => e.employee_id !== employee.employee_id
        );
        // Update task data with remaining employee IDs
        collectNewTaskData(
          "employee_id",
          filtered.map((e) => e.employee_id).join(",")
        );
        return filtered;
      } else {
        // Add new employee
        const newSelection = [...prev, employee];
        // Update task data with all employee IDs
        collectNewTaskData(
          "employee_id",
          newSelection.map((e) => e.employee_id).join(",")
        );
        return newSelection;
      }
    });
  };

  /**
   * Handles the submission of the task/shift creation
   */
  const handleSubmit = async () => {
    if (!taskData) {
      setError("Please fill in the required fields");
      return;
    }

    setIsCreating(true);
    setError(null);

    try {
      await handleTaskCreation(taskData);
      // Clear form or navigate away
      setSelectedEmployees([]);
      // Add other form reset logic as needed
    } catch (err: any) {
      setError(err.message || "Failed to create task");
    } finally {
      setIsCreating(false);
    }
  };

  return (
    <ScrollView style={styles.maincontainer}>
      <View style={{ width: "100%" }}>
        {/* Contract Selection */}
        <View
          style={[
            styles.container,
            { backgroundColor: innerBackground, shadowColor: primary },
          ]}
        >
          <TouchableOpacity
            onPressIn={() => handleToggleSites("contracts")}
            style={[styles.button]}
          >
            {isLoading ? (
              <ActivityIndicator size={15} color={text} />
            ) : (
              <Text style={[styles.headerText, { color: text }]}>
                {siteSelected ? "Selected Contract" : "Select Contract"}
              </Text>
            )}
          </TouchableOpacity>

          {siteSelected && !selected && (
            <View style={styles.selectedDetailsContainer}>
              <Text style={[styles.detailText, { color: text }]}>
                Contract ID: {siteSelected.contract_id}
              </Text>
              <Text style={[styles.detailText, { color: text }]}>
                Name: {siteSelected.contract_name}
              </Text>
              <Text style={[styles.detailText, { color: text }]}>
                Address: {siteSelected.contract_address}
              </Text>
              <Text style={[styles.detailText, { color: text }]}>
                Client: {siteSelected.client_name}
              </Text>
            </View>
          )}

          {selected === "contracts" && (
            <ScrollView
              style={styles.scrollviewContainer}
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}
            >
              {contractList?.map((site, index) => (
                <TouchableOpacity
                  onPress={() => setSiteSelected(site)}
                  // Check if the site is undefined before collecting and assigning the data
                  // Else assign an empty string
                  onPressOut={() =>
                    collectNewTaskData(
                      "contract_id",
                      site.contract_id !== undefined ? site.contract_id : ""
                    )
                  }
                  key={index}
                  style={[
                    styles.pressable,
                    siteSelected === site && {
                      backgroundColor: primary,
                      borderRadius: 5,
                      shadowColor: "red",
                      padding: 4,
                    },
                    { backgroundColor: inactivebtn },
                  ]}
                >
                  <View style={styles.contractTeXtContainer}>
                    <Text style={[styles.text, { color: text }]}>
                      {site.contract_id}
                    </Text>
                    <Text style={[styles.text, { color: text }]}>
                      {site.contract_name}
                    </Text>
                  </View>
                  <View style={styles.contractTeXtContainer}>
                    <Text style={[styles.text, { color: text }]}>
                      {site.contract_address}
                    </Text>
                    <Text style={[styles.text, { color: text }]}>
                      {site.contract_city}
                    </Text>
                    <Text style={[styles.text, { color: text }]}>
                      {site.client_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Employee Selection */}
        <View style={[styles.container, { backgroundColor: innerBackground }]}>
          <TouchableOpacity
            onPress={() => handleToggleSites("employees")}
            style={styles.button}
          >
            <Text style={[styles.buttonText]}>
              {selectedEmployees.length > 0
                ? `Selected Employees (${selectedEmployees.length})`
                : "Select Employees"}
            </Text>
          </TouchableOpacity>

          {selectedEmployees.length > 0 && !selected && (
            <View style={styles.selectedEmployeesContainer}>
              {selectedEmployees.map((emp, index) => (
                <View
                  key={index}
                  style={[
                    styles.selectedEmployeeChip,
                    { backgroundColor: primary },
                  ]}
                >
                  <Text style={[styles.chipText, { color: "white" }]}>
                    {emp.employee_name}
                  </Text>
                  <TouchableOpacity
                    onPress={() => handleEmployeeSelection(emp)}
                    style={{ marginLeft: 5 }}
                  >
                    <Text style={[styles.chipText, { color: "white" }]}>×</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}

          {selected === "employees" && (
            <ScrollView
              style={styles.scrollviewContainer}
              nestedScrollEnabled={true}
              showsHorizontalScrollIndicator={false}
            >
              {employeeList?.map((employee, index) => (
                <TouchableOpacity
                  onPress={() => handleEmployeeSelection(employee)}
                  key={index}
                  style={[
                    styles.pressable,
                    selectedEmployees.some(
                      (e) => e.employee_id === employee.employee_id
                    ) && {
                      backgroundColor: primary,
                      borderRadius: 5,
                      shadowColor: "red",
                      padding: 4,
                    },
                    { backgroundColor: inactivebtn },
                  ]}
                >
                  <Image source={user_image} style={styles.image} />
                  <View
                    style={{
                      flex: 1,
                      flexDirection: "row",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <Text style={[styles.text, { color: text }]}>
                      {employee.employee_name}
                    </Text>
                  </View>
                </TouchableOpacity>
              ))}
            </ScrollView>
          )}
        </View>

        {/* Conditionally render the apps information display when the user is yet to select  a staff member and an employee*/}
        {siteSelected && (
          <View style={{ marginHorizontal: 10 }}>
            <Text style={[styles.infoText, { color: otherText }]}>
              • Select dates and times for your task/shift
            </Text>
            <Text style={[styles.infoText, { color: otherText }]}>
              • If no employees are selected, this will create a task
            </Text>
            <Text style={[styles.infoText, { color: otherText }]}>
              • Select employees to create a shift instead
            </Text>
          </View>
        )}
      </View>

      {/* The view contains the date and time selection components */}
      <View style={{ width: "100%" }}>
        <Text style={[styles.headerText, { color: text }]}>
          select date and time
        </Text>

        {/* Display selected dates and times */}
        <View style={styles.selectedTimeContainer}>
          <Text style={[styles.detailText]}>
            Selected Dates:{" "}
            {dates.map((date) => date.toLocaleDateString()).join(", ")}
          </Text>
          <Text style={[styles.detailText]}>
            Start Time: {startTime.hours}:
            {startTime.minutes.toString().padStart(2, "0")}
          </Text>
          <Text style={[styles.detailText]}>
            End Time: {endTime.hours}:
            {endTime.minutes.toString().padStart(2, "0")}
          </Text>
        </View>

        <View style={{ flex: 1 }}>
          <ButtonComponent title="date" onPress={handleDateDisplay} />
          <View style={[styles.dateTimeButtonContainer]}>
            <TouchableOpacity
              onPress={handleStartTimeDisplay}
              style={[
                styles.dateTimeButton,
                { backgroundColor: innerBackground },
              ]}
            >
              <Text style={[styles.dateTimeButtonText, { color: text }]}>
                Start Time
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEndTimeDisplay}
              style={[
                styles.dateTimeButton,
                { backgroundColor: innerBackground },
              ]}
            >
              <Text style={[styles.dateTimeButtonText, { color: text }]}>
                End Time
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <DatePickerModal
          visible={dateVisible}
          onDismiss={onDateDismiss}
          onConfirm={onConfirmDate}
          mode="multiple"
          locale={"en"}
          animationType="slide"
          label="Select date"
          saveLabel="Save"
        />

        <TimePickerModal
          visible={startTimeVisible}
          onDismiss={onStartTimeDismiss}
          onConfirm={onConfirmStartTime}
          animationType="slide"
          label="Select time"
          cancelLabel="Cancel"
        />

        <TimePickerModal
          visible={endTimeVisible}
          onDismiss={onEndTimeDismiss}
          onConfirm={onConfirmEndTime}
          animationType="slide"
          label="Select time"
          cancelLabel="Cancel"
        />

        <View style={{ width: "100%", marginVertical: 10 }}>
          <TextInputComponent
            placeholder="Amount"
            value={taskData?.amount?.toString()}
            text="Amount"
            setValue={(value: string) => {
              collectNewTaskData("amount", value);
            }}
            keyboardType="numeric"
          />

          <TextInputComponent
            placeholder="Description"
            value={taskData?.description}
            text="Description"
            setValue={(value: string) => {
              collectNewTaskData("description", value);
            }}
            isMultiline={true}
            lines={3}
          />

          <TextInputComponent
            placeholder="Task Serial"
            text="Task Serial"
            setValue={(value: string) => {
              collectNewTaskData("task_serial", value);
            }}
          />
        </View>
        {error && (
          <Text style={[styles.errorText, { color: "red" }]}>{error}</Text>
        )}
        <SubmitButtonComponent
          title={
            isCreating
              ? "Creating..."
              : selectedEmployees.length === 0
              ? "Create Task"
              : "Create Shift"
          }
          onPress={handleSubmit}
        />
      </View>
    </ScrollView>
  );
};

export default CreateTaskComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: "column",
    width: "100%",
    flex: 1,
  },

  container: {
    flexDirection: "column",
    width: "100%",
    borderWidth: 0.1,
    marginBottom: 10,
    elevation: 10,
    shadowRadius: 10,
    borderRadius: 5,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 12 : 16,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  button: {
    padding: Platform.OS === "web" ? 5 : 10,
    alignItems: "center",
  },

  buttonText: {
    fontSize: Platform.OS === "web" ? 12 : 15,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  scrollviewContainer: {
    width: "100%",
    maxHeight: 200,
    marginVertical: 10,
  },

  pressable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
    marginVertical: 2,
    marginHorizontal: 3,
    borderRadius: 10,
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.4,
  },

  text: {
    fontFamily: "RobotoRegular",
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "500",
    textTransform: "lowercase",
  },

  input: {
    padding: 10,
    flex: 1,
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 13 : 16,
    fontWeight: "500",
    textTransform: "capitalize",
  },

  inputContainer: {
    marginVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
  },

  contractTeXtContainer: {
    marginHorizontal: 10,
    marginVertical: 2,
  },

  image: {
    width: 20,
    height: 20,
    borderRadius: 30,
    marginEnd: 10,
  },

  selectedText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "lowercase",
  },

  selectedTextContainer: {
    marginHorizontal: 10,
    marginVertical: 2,
  },

  selectedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
  },

  dateTimeButtonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    gap: 10,
    marginVertical: 10,
  },

  dateTimeButton: {
    flex: 1,
    padding: Platform.OS === "web" ? 12 : 15,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.22,
    shadowRadius: 2.22,
  },

  dateTimeButtonText: {
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  infoText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontFamily: "BarlowRegular",
    fontWeight: "400",
    textTransform: "none",
    padding: 2,
    marginVertical: 5,
  },

  selectedDetailsContainer: {
    padding: 10,
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    borderWidth: 0.5,
  },

  detailText: {
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 12 : 14,
    marginVertical: 2,
  },

  selectedTimeContainer: {
    padding: 10,
    marginVertical: 10,
    borderRadius: 5,
    borderWidth: 0.5,
  },

  selectedEmployeesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
    gap: 5,
    marginHorizontal: 10,
  },

  selectedEmployeeChip: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderRadius: 5,
    marginRight: 5,
  },

  chipText: {
    fontSize: Platform.OS === "web" ? 10 : 14,
    fontFamily: "BarlowRegular",
  },

  errorText: {
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 12 : 14,
    marginVertical: 10,
    textAlign: "center",
  },
});
