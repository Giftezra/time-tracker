import {
  ActivityIndicator,
  Image,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { DatePickerModal, TimePickerModal } from "react-native-paper-dates";
import { EmployeeType } from "@/app/types/management/employee";
import { user_image } from "@/app/utils/images";
import { ContractListType } from "@/app/types/management/task";
import ButtonComponent from "../../helper/buttons";
import TextInputComponent from "../../helper/textInput";
import SubmitButtonComponent from "../../helper/submitButton";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";

const CreateTaskComponent = () => {
  const {
    contractList,
    employeeList,
    onConfirmStartTime,
    onConfirmEndTime,
    onStartTimeDismiss,
    onEndTimeDismiss,
    handleStartTimeDisplay,
    handleEndTimeDisplay,
    startTimeVisible,
    endTimeVisible,
    isLoading,
    startTime,
    endTime,
    collectNewTaskData,
    taskData,
    getAvailableEmployees: get_available_employees,
    handleTaskCreation,
    startDateVisible,
    endDateVisible,
    startDates,
    endDates,
    onConfirmStartDate,
    onConfirmEndDate,
    onStartDateDismiss,
    onEndDateDismiss,
    handleStartDateDisplay,
    handleEndDateDisplay,
    handleShiftCreation,
  } = useManagementTask();

  const primary = useThemeColor({}, "primaryColor");
  const text = useThemeColor({}, "text");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const innerBackground = useThemeColor({}, "innerBackground");
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

  return (
    <ScrollView style={styles.maincontainer}>
      <View style={{ width: "100%" }}>
        {/* Contract Selection */}
        <View style={[styles.container, { shadowColor: primary }]}>
          {/* Display the contract selection button when there is a contract in the contract list */}
          {contractList?.length && contractList?.length > 0 ? (
            <TouchableOpacity
              onPressIn={() => handleToggleSites("contracts")}
              style={[styles.button, { backgroundColor: primary }]}
            >
              {isLoading ? (
                <ActivityIndicator size={15} color={text} />
              ) : (
                <Text style={[styles.headerText, { color: text }]}>
                  {siteSelected ? "Selected Contract" : "Select Contract"}
                </Text>
              )}
            </TouchableOpacity>
          ) : (
            <View style={styles.noContractContainer}>
              <Text style={[styles.noContractText]}>
                No contracts available Go to client page to create a contract
                and assign to a client
              </Text>
            </View>
          )}

          {siteSelected && !selected && (
            <View
              style={[
                styles.selectedDetailsContainer,
                { backgroundColor: primary },
              ]}
            >
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
        <View style={[styles.container]}>
          {/* Display the employee selection button when there is an employee in the employee list */}
          {employeeList?.length && employeeList?.length > 0 ? (
            <TouchableOpacity
              onPress={() => handleToggleSites("employees")}
              style={styles.button}
            >
              <Text style={[styles.buttonText, { color: "#000" }]}>
                {selectedEmployees.length > 0
                  ? `Selected Employees (${selectedEmployees.length})`
                  : "Select Employees"}
              </Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.noContractContainer}>
              <Text style={[styles.noContractText]}>
                No employees available, assign Go to employee page to create an
                employee
              </Text>
            </View>
          )}
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
          select dates and times
        </Text>

        {/* Display selected dates and times */}
        <View style={styles.selectedTimeContainer}>
          <Text style={[styles.detailText]}>
            Start Date:
            {startDates ? startDates.toLocaleDateString() : "Not selected"}
          </Text>
          <Text style={[styles.detailText]}>
            End Date:
            {endDates ? endDates.toLocaleDateString() : "Not selected"}
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
          <View style={[styles.dateTimeButtonContainer]}>
            <TouchableOpacity
              onPress={handleStartDateDisplay}
              style={[
                styles.dateTimeButton,
                { backgroundColor: innerBackground },
              ]}
            >
              <Text style={[styles.dateTimeButtonText, { color: text }]}>
                Start Date
              </Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={handleEndDateDisplay}
              style={[
                styles.dateTimeButton,
                { backgroundColor: innerBackground },
              ]}
            >
              <Text style={[styles.dateTimeButtonText, { color: text }]}>
                End Date
              </Text>
            </TouchableOpacity>
          </View>

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
          visible={startDateVisible}
          onDismiss={onStartDateDismiss}
          onConfirm={onConfirmStartDate}
          mode="single"
          locale="en"
          animationType="slide"
          label="Select start date"
          saveLabel="Save"
        />

        <DatePickerModal
          visible={endDateVisible}
          onDismiss={onEndDateDismiss}
          onConfirm={onConfirmEndDate}
          mode="single"
          locale="en"
          animationType="slide"
          label="Select end date"
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
            placeholder="SD1233"
            text="Task Serial"
            setValue={(value: string) => {
              collectNewTaskData("task_serial", value);
            }}
          />

          <TextInputComponent
            placeholder="0"
            text="Required Number of Staff"
            setValue={(value: string) => {
              collectNewTaskData("required_number_of_staff", value);
            }}
            keyboardType="numeric"
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
          /* Create the task or shift based on the selected employees */
          onPress={() => {
            if (selectedEmployees.length === 0) {
              setIsCreating(true);
              handleTaskCreation().finally(() => {
                setIsCreating(false);
              });
            } else {
              setIsCreating(true);
              handleShiftCreation().finally(() => {
                setIsCreating(false);
              });
            }
          }}
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
    padding: 5,
  },

  container: {
    flexDirection: "column",
    width: "100%",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    marginBottom: 16,
    borderRadius: 8,
    shadowColor: "#000",
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 14 : 18,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    marginBottom: 8,
  },

  button: {
    padding: Platform.OS === "web" ? 12 : 16,
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },

  buttonText: {
    fontSize: Platform.OS === "web" ? 13 : 16,
    fontWeight: "500",
    fontFamily: "BarlowMedium",
    textTransform: "capitalize",
  },

  scrollviewContainer: {
    width: "100%",
    maxHeight: 200,
    marginVertical: 8,
    padding: 5,
  },

  pressable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "web" ? 12 : 16,
    marginVertical: 6,
    borderRadius: 12,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.05)",
  },

  text: {
    fontFamily: "RobotoRegular",
    fontSize: Platform.OS === "web" ? 12 : 15,
    fontWeight: "500",
    color: "#333",
    marginBottom: 4,
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
    flex: 1,
    marginHorizontal: 12,
    marginVertical: 4,
  },

  image: {
    width: 32,
    height: 32,
    borderRadius: 16,
    marginEnd: 12,
    backgroundColor: "rgba(0,0,0,0.05)",
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
    gap: 12,
    marginVertical: 12,
  },

  dateTimeButton: {
    flex: 1,
    padding: Platform.OS === "web" ? 12 : 10,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
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
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(0,0,0,0.02)",
  },

  detailText: {
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 13 : 15,
    marginVertical: 4,
    lineHeight: 22,
  },

  selectedTimeContainer: {
    padding: 16,
    marginVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0,0,0,0.1)",
    backgroundColor: "rgba(0,0,0,0.02)",
  },

  selectedEmployeesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 12,
    gap: 8,
    backgroundColor: "rgba(0,0,0,0.02)",
    borderRadius: 12,
    marginHorizontal: 12,
    marginVertical: 8,
  },

  selectedEmployeeChip: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 14,
    borderRadius: 20,
    marginRight: 8,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },

  chipText: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    color: "#fff",
  },

  errorText: {
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 13 : 15,
    marginVertical: 12,
    textAlign: "center",
    padding: 8,
    borderRadius: 4,
    backgroundColor: "rgba(255,0,0,0.1)",
  },

  noContractContainer: {
    padding: 16,
    borderRadius: 12,
    marginHorizontal: 12,
    alignItems: "center",
  },
  noContractText: {
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 13 : 15,
    fontWeight: "500",
    color: "#000",
    textTransform: "capitalize",
    letterSpacing: 0.3,
  },
});
