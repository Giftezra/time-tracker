import { useLoadedFonts } from "@/hooks/useLoadedFonts";
import { useThemeColor } from "@/hooks/useThemeColor";
import React, { useState, useCallback } from "react";
import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
("react-native-paper-dates");

import { EmployeeType } from "@/app/types/management/employee";
import { OpenTaskProps } from "@/app/types/management/task";

const allEmployees: EmployeeType[] = [
  {
    employee_name: "John Doe",
    employee_id: "123",
  },
  {
    employee_name: "Jane Smith",
    employee_id: "456",
  },
  {
    employee_name: "Alice Johnson",
    employee_id: "789",
  },
  {
    employee_name: "Alice Johnson",
    employee_id: "789",
  },
];


type AssignTaskModalProps = {
  task: OpenTaskProps;
  dates: Date[];
  setDates: (dates: Date[]) => void;
  time: { hours: number; minutes: number };
  setTime: (time: { hours: number; minutes: number }) => void;
  onClose: () => void;
};

const AssignTaskModal: React.FC<AssignTaskModalProps> = ({
  task,
  dates,
  setDates,
  time,
  setTime,
  onClose,
}) => {
  const [employeeSelected, setEmployeeSelected] = useState<EmployeeType>();
  const [employeeToggle, setEmployeeToggle] = useState(false);

  const handleEmployeeDisplay = () => setEmployeeToggle(!employeeToggle);
  const innerBackground = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");
  const primaryColor = useThemeColor({}, "primaryColor");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const highlight = useThemeColor({}, "highlight");

  return (
    /**
     * Used to assigned the selected task to a list of employees
     */
    <View style={[styles.mainContainer, { backgroundColor: innerBackground }]}>
      <Text style={styles.headerText}>
        Assigning task: {task.contract_name}
      </Text>
      <Text style={[styles.text, { color: text }]}>{task.contract_name}</Text>
      <Text style={[styles.text, { color: text }]}>{task.task_serial}</Text>
      <Text style={[styles.text, { color: text }]}>
        {task.task_description}
      </Text>
      {/* Contains the details of the selected task */}
      <View
        style={[styles.selectEmployeeButton, { backgroundColor: primaryColor }]}
      >
        {/* Button to trigger the dropdown of all employees */}
        <TouchableOpacity
          onPress={handleEmployeeDisplay}
          style={styles.selectEmployeeButton}
        >
          <Text style={styles.buttonText}>Select Employee</Text>
        </TouchableOpacity>

        {/* Conditionally render the employee list when toggled */}
        {employeeToggle && (
          <ScrollView
            style={[styles.scrollview]}
            showsVerticalScrollIndicator={false}
          >
            {/* Displays a drop down of the employees
            This is pressable to allow selection */}
            {allEmployees.map((employee, index) => (
              <Pressable
                key={index}
                onPress={() => setEmployeeSelected(employee)}
                style={[styles.pressables, { backgroundColor: inactivebtn }]}
              >
                <Text style={[styles.pressableText, { color: text }]}>
                  {employee.employee_name}
                </Text>
                <Text style={[styles.pressableText, { color: text }]}>
                  {employee.employee_id}
                </Text>
              </Pressable>
            ))}
          </ScrollView>
        )}
      </View>
      {/* Selected employee details to ensure the employee was selected ok. */}
      <Text
        style={[
          styles.text,
          {
            fontSize: 14,
            fontWeight: "400",
            padding: 2,
            textTransform: "lowercase",
          },
        ]}
      >
        Selected Employee:
        {employeeSelected ? employeeSelected.employee_name : "None"}
      </Text>
      <TouchableOpacity
        onPress={onClose}
        style={[
          styles.assignButton,
          { backgroundColor: inactivebtn, borderBlockColor: highlight },
        ]}
      >
        <Text style={styles.buttonText}>assign</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AssignTaskModal;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    borderRadius: 1,
    marginVertical: 1,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 12 : 15,
    fontWeight: "700",
    fontFamily: "OswaldVariable",
    textTransform: "uppercase",
    borderRadius: 20,
    textShadowRadius: 10,
    padding: 5,
  },

  text: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "lowercase",
  },

  selectEmployeeButton: {
    padding: 3,
    width: "100%",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 5,
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.5,
    borderWidth: 0.1,
    marginTop: 5,
    maxHeight: 500,
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
    flexGrow: 1,
    width: "100%",
    marginVertical: 5,
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
});
