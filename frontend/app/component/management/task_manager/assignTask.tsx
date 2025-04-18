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

const AssignTaskModal = ({
  task,
  onClose,
}: {
  task: OpenTaskProps;
  onClose: () => void;
}) => {
  const { axiosInstance } = useAuth();
  const { employeeList } = useManagementTask();

  const [selectedEmployees, setSelectedEmployees] = useState<EmployeeType[]>(
    []
  );
  const [employeeToggle, setEmployeeToggle] = useState(false);

  const handleEmployeeDisplay = () => setEmployeeToggle(!employeeToggle);
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

  /**
   * Used to assigned the selected task to a list of employees
   * Return the response from the server and show the alert to the user based on the response
   * If the response is success, show the alert to the user and close the modal
   * If the response is error, show the alert to the user and close the modal
   */
  const handleAssignTask = async () => {
    if (selectedEmployees.length === 0) {
      Alert.alert("Error", "Please select at least one employee");
      return;
    }

    try {
      // Get array of employee IDs
      const employeeIds = selectedEmployees.map((emp) => emp.employee_id);
      // Call the context method to assign task
      const response = await axiosInstance.post("/api/assign/task/", {
        task_id: task.task_id,
        staff_ids: employeeIds,
      });
      if (response.status === 200) {
        Alert.alert("Task Assignment", response.data);
        onClose();
      } else {
        Alert.alert("Error", "Failed to assign task. Please try again.");
      }
    } catch (error) {
      Alert.alert("Error", "Failed to assign task. Please try again.");
      console.error("Error assigning task:", error);
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
      <View style={styles.dateContainer}>
        <Text style={[styles.text, { color: "black" }]}>Start Date:</Text>
        <Text style={[styles.text, { color: "black" }]}>
          {task.task_start_date}
        </Text>
      </View>
      <View style={styles.dateContainer}>
        <Text style={[styles.text, { color: "black" }]}>End Date:</Text>
        <Text style={[styles.text, { color: "black" }]}>
          {task.task_end_date}
        </Text>
      </View>
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
});
