/**
 * The component handles the activity task of the task manager.
 * The component is self suffients and requires no props, enabling it to be used independently of the main task manager component across the application.
 *
 * The list of on going task is displayed in a scroll view with the details of the task displayed in a row.
 */

import {
  ActivityIndicator,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import PopupButton from "../../helper/popupButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AntDesign } from "@expo/vector-icons";
import { ActiveTaskType } from "@/app/types/management/task";
import Index from "@/app";
import { EmployeeType } from "@/app/types/management/employee";
import { useActiveTask } from "@/app/context/management/task manager/active-task-context";
import { isLoaded, isLoading } from "expo-font";
import SearchInputContainer from "../../helper/searchInput";

const activeTasks: ActiveTaskType[] = [
  {
    shift_id: "123",
    task_serial: "1234",
    client_name: "John Doe",
    employee: [
      {
        employee_id: "1234",
        employee_name: "John Doe",
      },
      {
        employee_id: "1235",
        employee_name: "Jane Doe",
      },
    ],
    start_time: "12:00",
  },
  {
    shift_id: "123",
    task_serial: "1234",
    client_name: "John Doe",
    employee: [
      {
        employee_id: "1234",
        employee_name: "John Doe",
      },
      {
        employee_id: "1235",
        employee_name: "Jane Doe",
      },
    ],
    start_time: "12:00",
  },
];

/* Constant value for the sub headers representing each mapped item */
const subHeaders = [
  "shift id",
  "task serial",
  "employees",
  "client name",
  "start time",
];

const ActiveTaskComponent = () => {
  const {
    gotoMessageScreen,
    handleIsTaskClicked,
    isTaskClicked,
    isModalVisible,
    employee,
    hideModal,
    renderPopupButton,
    isLoading,
    activeTasks,
  } = useActiveTask();

  const [search, setSearch] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const inactivebtn = useThemeColor({}, "inactivebtn");
  const text = useThemeColor({}, "text");
  const icon = useThemeColor({}, "icon");
  const textinput = useThemeColor({}, "textinput");
  const background = useThemeColor({}, "background");
  const tint = useThemeColor({}, "tint");

  return (
    <View style={styles.maincontainer}>
      <Text style={[styles.headerText, { color: text }]}>active tasks</Text>
      {/* Handles the task filter view */}
      <SearchInputContainer placeholder="staff name" />
      {/* Display the subheaders */}
      <View style={styles.subheadercontainer}>
        {subHeaders.map((header, index) => (
          <Text key={index} style={[styles.subHeadersText, { color: text }]}>
            {header}
          </Text>
        ))}
      </View>
      {/* Map the list of active activities making them scrollable.
      
        The list when clicked opens a view to terminate the task.
        The button contains the task id and sends the id to the server to terminate the task*/}
      <ScrollView
        style={styles.scrollview}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
      >
        {activeTasks?.map((task, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.scrollButton,
              styles.subcontainer,
              { backgroundColor: inactivebtn, shadowColor: inactivebtn },
            ]}
            onPressIn={() => handleIsTaskClicked(task.employee)}
            onLongPress={() => setIsPopupVisible(true)}
          >
            <Text style={[styles.text, { color: text }]}>{task.shift_id}</Text>

            <Text style={[styles.text, { color: text }]}>
              {task.task_serial}
            </Text>

            <Text style={[styles.text, { color: text }]}>
              {task.employee.length}
            </Text>

            <Text style={[styles.text, { color: text }]}>
              {task.client_name}
            </Text>
            <Text style={[styles.text, { color: text }]}>
              {task.start_time}
            </Text>
            {isPopupVisible &&
              renderPopupButton(task.shift_id, () => setIsPopupVisible(false))}
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Conditionally render an absolute view that displays a button to terminate the task. */}
      {isTaskClicked && (
        <Modal
          visible={isModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={styles.mainModalContainer}>
            <Pressable onPress={hideModal}>
              <Text>Close</Text>
            </Pressable>
            <View
              style={[styles.modalContainer, { backgroundColor: background }]}
            >
              {/* Conditianally render the employees with a button that navigates to the message page given the employee id */}
              {employee?.map((employee, index) => (
                <View key={index} style={styles.modalDetails}>
                  <Text style={[styles.modalText, { color: text }]}>
                    do you wanna communicate with {employee.employee_name} ?
                  </Text>
                  <TouchableOpacity
                    style={[
                      styles.modalMessageButton,
                      { backgroundColor: tint },
                    ]}
                    onPress={() => gotoMessageScreen(employee)}
                  >
                    <Text style={styles.modalBtnText}>send message</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          </View>
        </Modal>
      )}
    </View>
  );
};

export default ActiveTaskComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: "column",
    width: "100%",
    flex: 1,
  },

  subcontainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
  },

  scrollButton: {
    marginVertical: 2,
    borderRadius: 5,
    padding: Platform.OS === "web" ? 5 : 12,
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.5,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 14 : 16,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
    marginVertical: 2,
    borderRadius: 20,
    textShadowRadius: 10,
  },

  subHeadersText: {
    textTransform: "capitalize",
    padding: Platform.OS === "web" ? 2 : 5,
    fontFamily: "RobotoRegular",
    fontSize: Platform.OS === "web" ? 8 : 10,
    fontWeight: "600",
    marginVertical: 2,
  },

  subheadercontainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  text: {
    fontFamily: "BarlowLight",
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  scrollview: {
    padding: 5,
    width: "100%",
    flexGrow: 1,
  },

  activeTask: {
    width: Platform.OS === "web" ? 7 : 10,
    height: Platform.OS === "web" ? 7 : 10,
    backgroundColor: "green",
    borderRadius: 20,
  },

  input: {
    padding: Platform.OS === "web" ? 5 : 10,
    flex: 1,
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "lowercase",
  },

  filterButton: {
    padding: Platform.OS === "web" ? 5 : 15,
    alignItems: "center",
    borderRadius: 30,
  },

  terminateTaskContainer: {
    position: "absolute",
    top: 0,
    left: 0,
    backgroundColor: "#e63a0a",
    padding: 5,
    borderRadius: 5,
  },
  terminateTaskButton: {
    paddingStart: 10,
    paddingEnd: 10,
    alignItems: "center",
  },

  mainModalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  modalContainer: {
    maxWidth: Platform.OS === "web" ? "50%" : "100%",
    padding: 5,
    borderRadius: 10,
    borderWidth: 0.5,
    elevation: 5,
    shadowRadius: 5,
    opacity: 0.8,
    shadowOpacity: 0.8,
  },

  modalDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
    marginVertical: 5,
  },

  modalText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  modalMessageButton: {
    padding: Platform.OS === "web" ? 5 : 10,
    borderRadius: 20,
    elevation: 5,
    shadowRadius: 5,
    opacity: 0.6,
  },

  modalBtnText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
