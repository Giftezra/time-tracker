import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState } from "react";
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import { EmployeeType } from "@/app/types/management/employee";
import { OpenTaskProps } from "@/app/types/management/task";
import { FlatList } from "react-native-gesture-handler";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";
import { useAuth } from "@/app/authentication";
import DateScroller from "@/app/component/helper/dateScroller";

const AssignTaskModal = ({
  task,
  onClose,
}: {
  task: OpenTaskProps;
  onClose: () => void;
}) => {
  const { axiosInstance, setIsAlertVisible, setAlertConfig } = useAuth();
  const { employeeList } = useManagementTask();
  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeType[]>(
    []
  );
  const [employeeToggle, setEmployeeToggle] = useState(false);
  const handleEmployeeDisplay = () => setEmployeeToggle(!employeeToggle);
  const [isLoading, setIsLoading] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);

  // Parse task dates and set initial state
  const parseDate = (dateString: string) => {
    const date = new Date(dateString);
    return {
      day: date.getDate(),
      month: date.getMonth() + 1,
      year: date.getFullYear(),
    };
  };

  // Replace the existing startDate and endDate state initialization
  const [startDate, setStartDate] = useState(
    parseDate(task.task_start_date || "")
  );
  const [endDate, setEndDate] = useState(parseDate(task.task_end_date || ""));

  const innerBackground = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primaryColor");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const highlight = useThemeColor({}, "highlight");

  const handleEmployeeSelection = (employee: EmployeeType) => {
    setSelectedEmployees((prev) => {
      const isSelected = prev.some(
        (emp) => emp.employee_id === employee.employee_id
      );
      if (isSelected) {
        return prev.filter((emp) => emp.employee_id !== employee.employee_id);
      } else {
        return [...prev, employee];
      }
    });
  };

  const formatDate = (date: typeof startDate) => {
    return `${String(date.day).padStart(2, "0")}-${String(date.month).padStart(
      2,
      "0"
    )}-${date.year}`;
  };

  const dateSection = (
    <View style={styles.datesContainer}>
      <View style={styles.dateRow}>
        <Text style={[styles.text, { color: "black" }]}>Start Date:</Text>
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </Pressable>
      </View>

      <View style={styles.dateRow}>
        <Text style={[styles.text, { color: "black" }]}>End Date:</Text>
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
          <Text style={styles.calendarIcon}>📅</Text>
        </Pressable>
      </View>

      {showStartDatePicker && (
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerContainer}>
            <DateScroller
              day={startDate.day}
              month={startDate.month}
              year={startDate.year}
              onChangeDay={(day) => setStartDate((prev) => ({ ...prev, day }))}
              onChangeMonth={(month) =>
                setStartDate((prev) => ({ ...prev, month }))
              }
              onChangeYear={(year) =>
                setStartDate((prev) => ({ ...prev, year }))
              }
            />
            <TouchableOpacity
              style={styles.confirmDateButton}
              onPress={() => setShowStartDatePicker(false)}
            >
              <Text style={styles.confirmDateText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {showEndDatePicker && (
        <View style={styles.datePickerOverlay}>
          <View style={styles.datePickerContainer}>
            <DateScroller
              day={endDate.day}
              month={endDate.month}
              year={endDate.year}
              onChangeDay={(day) => setEndDate((prev) => ({ ...prev, day }))}
              onChangeMonth={(month) =>
                setEndDate((prev) => ({ ...prev, month }))
              }
              onChangeYear={(year) => setEndDate((prev) => ({ ...prev, year }))}
            />
            <TouchableOpacity
              style={styles.confirmDateButton}
              onPress={() => setShowEndDatePicker(false)}
            >
              <Text style={styles.confirmDateText}>Confirm</Text>
            </TouchableOpacity>
          </View>
        </View>
      )}
    </View>
  );

  /**
   * Handles the assignment of a task to selected employees.
   * Makes an API call to assign the task and processes the response to show appropriate messages.
   *
   * The response can include:
   * - Successful assignments: List of employee IDs who were successfully assigned
   * - Failed assignments: List of employee IDs and reasons why assignment failed
   * - General success/error messages
   *
   * @returns {Promise<void>}
   */
  const handleAssignTask = async () => {
    // Validate that employees are selected before proceeding
    if (selectedEmployees.length === 0) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: "Please select at least one employee",
        onConfirm: () => setIsAlertVisible(false),
        isVisible: true,
      });
      return;
    }

    // Format dates for API request
    const startDateString = `${startDate.year}-${String(
      startDate.month
    ).padStart(2, "0")}-${String(startDate.day).padStart(2, "0")}`;
    const endDateString = `${endDate.year}-${String(endDate.month).padStart(
      2,
      "0"
    )}-${String(endDate.day).padStart(2, "0")}`;

    try {
      // Prepare employee IDs for the request
      const employeeIds = selectedEmployees.map((emp) => emp.employee_id);

      // Make API call to assign task
      const response = await axiosInstance.post("/api/assign/task/", {
        task_id: task.task_id,
        staff_ids: employeeIds,
        start_date: startDateString,
        end_date: endDateString,
      });

      if (response.status === 200) {
        // Process successful response
        let messageComponents = [];

        // Add main response message if it exists
        if (response.data.message) {
          messageComponents.push(response.data.message);
        }

        // Add successful assignments message if any
        if (response.data.successful_assignments?.length > 0) {
          // Map employee IDs to names for better readability
          const successfulNames = response.data.successful_assignments
            .map(
              (id: string) =>
                selectedEmployees.find((emp) => emp.employee_id === id)
                  ?.employee_name
            )
            .filter(Boolean)
            .join(", ");

          messageComponents.push(
            `Successfully assigned employees: ${successfulNames}`
          );
        }

        // Add failed assignments message if any
        if (response.data.failed_assignments?.length > 0) {
          const failureMessages = response.data.failed_assignments
            .map((failure: { employee_id: string; reason: string }) => {
              const employeeName =
                selectedEmployees.find(
                  (emp) => emp.employee_id === failure.employee_id
                )?.employee_name || failure.employee_id;
              return `- ${employeeName}: ${failure.reason}`;
            })
            .join("\n");

          messageComponents.push(`Failed assignments:\n${failureMessages}`);
        }

        // Show success alert with combined message
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Task Assignment Results",
          message: messageComponents.join("\n\n"),
          onConfirm: () => {
            setIsAlertVisible(false);
            onClose(); // Close modal only on confirmation
          },
          isVisible: true,
        });
      }
    } catch (error: any) {
      // Handle error response
      const errorMessage = error.response?.data?.message
        ? typeof error.response.data.message === "object"
          ? JSON.stringify(error.response.data.message)
          : String(error.response.data.message)
        : "Failed to assign task. Please try again.";

      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: errorMessage,
        onConfirm: () => setIsAlertVisible(false),
        isVisible: true,
      });
    }
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: "white" }]}>
      <Text style={[styles.headerText, { color: "black" }]}>
        Assigning task: {task.contract_name}
      </Text>
      <Text style={[styles.text, { color: "black" }]}>
        {task.contract_name}
      </Text>
      <Text style={[styles.text, { color: "black" }]}>{task.task_serial}</Text>

      {dateSection}

      {/* Contains the details of the selected task */}
      <View
        style={[
          styles.selectEmployeeContainer,
          { backgroundColor: innerBackground },
        ]}
      >
        {/* Button to trigger the dropdown of all employees */}
        <TouchableOpacity
          onPress={handleEmployeeDisplay}
          style={styles.selectEmployeeButton}
        >
          <Text style={styles.buttonText}>
            {selectedEmployees.length > 0
              ? `${selectedEmployees.length} Employee(s) Selected`
              : "Select Employees"}
          </Text>
        </TouchableOpacity>

        {/* Show selected employees */}
        {selectedEmployees.length > 0 && (
          <View style={styles.selectedEmployeesContainer}>
            {selectedEmployees.map((emp) => (
              <View
                key={emp.employee_id}
                style={[
                  styles.selectedEmployeeChip,
                  { backgroundColor: primaryColor },
                ]}
              >
                <Text style={[styles.chipText, { color: "white" }]}>
                  {emp.employee_name}
                </Text>
                <TouchableOpacity onPress={() => handleEmployeeSelection(emp)}>
                  <Text
                    style={[styles.chipText, { color: "white", marginLeft: 5 }]}
                  >
                    ×
                  </Text>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        )}

        {employeeToggle && (
          <FlatList
            data={employeeList}
            style={[styles.scrollview]}
            showsVerticalScrollIndicator={false}
            renderItem={({ item, index }) => {
              const isSelected = selectedEmployees.some(
                (emp) => emp.employee_id === item.employee_id
              );
              return (
                <Pressable
                  key={index}
                  onPress={() => handleEmployeeSelection(item)}
                  style={[
                    styles.pressables,
                    {
                      backgroundColor: isSelected ? primaryColor : inactivebtn,
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.pressableText,
                      { color: isSelected ? "white" : text },
                    ]}
                  >
                    {item.employee_name}
                  </Text>
                </Pressable>
              );
            }}
          />
        )}
      </View>
      <TouchableOpacity
        onPress={handleAssignTask}
        style={[
          styles.assignButton,
          {
            backgroundColor:
              selectedEmployees.length > 0 ? primaryColor : inactivebtn,
            borderBlockColor: highlight,
          },
        ]}
      >
        <Text style={styles.buttonText}>Assign Task</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AssignTaskModal;

const styles = StyleSheet.create({
  mainContainer: {
    width: Platform.OS === "web" ? "50%" : "100%",
    maxHeight: "90%",
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 16 : 20,
    fontWeight: "700",
    fontFamily: "OswaldVariable",
    textTransform: "uppercase",
    marginBottom: 15,
    textAlign: "center",
  },

  text: {
    fontSize: Platform.OS === "web" ? 14 : 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    marginBottom: 10,
    textTransform: "capitalize",
  },

  selectEmployeeContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 5,
    borderWidth: 0.5,
    marginVertical: 10,
  },

  selectEmployeeButton: {
    padding: 10,
    alignItems: "center",
    width: "100%",
  },

  buttonText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    color: "white",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    width: "100%",
  },

  button: {
    backgroundColor: "gray",
    padding: 50,
    paddingRight: 10,
    paddingStart: 10,
    alignItems: "center",
    borderRadius: 5,
  },

  scrollview: {
    width: "100%",
    marginTop: 10,
  },

  pressables: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
    marginVertical: 1,
    borderBottomWidth: 0.5,
    borderRadius: 5,
    elevation: 5,
    shadowOpacity: 0.5,
  },

  pressableText: {
    fontFamily: "RobotoRegular",
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  assignButton: {
    width: "100%",
    backgroundColor: "#21130d",
    padding: Platform.OS === "web" ? 10 : 15,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 5,
  },

  dateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  selectedEmployeesContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
    gap: 5,
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

  datesContainer: {
    width: "100%",
    marginVertical: 10,
  },

  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginVertical: 5,
    paddingHorizontal: 10,
  },

  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ddd",
  },

  dateButtonText: {
    fontSize: 16,
    marginRight: 10,
    color: "#333",
  },

  calendarIcon: {
    fontSize: 18,
  },

  datePickerOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    justifyContent: "center",
    alignItems: "center",
    zIndex: 1000,
  },

  datePickerContainer: {
    backgroundColor: "white",
    padding: 5,
    borderRadius: 10,
    width: "90%",
    alignItems: "center",
  },

  confirmDateButton: {
    backgroundColor: "#0066ff",
    padding: 10,
    borderRadius: 8,
    marginTop: 15,
    width: "100%",
    alignItems: "center",
  },

  confirmDateText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
});
