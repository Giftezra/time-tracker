/**
 * The component handles the activity task of the task manager.
 * The component is self suffients and requires no props, enabling it to be used independently of the main task manager component across the application.
 *
 * The list of on going task is displayed in a scroll view with the details of the task displayed in a row.
 */

import {
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView, TextInput } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { ActiveTaskType } from "@/app/types/management/task";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";
import SearchInputContainer from "../../helper/searchInput";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import SubtitleThemedText from "../../helper/SubtitleThemedText";

/* Constant value for the sub headers representing each mapped item */
const subHeaders = ["task serial", "employees", "contract", "start time"];

const formatTime = (timeString: string) => {
  try {
    // If timeString is already in HH:mm format, just parse it
    if (timeString.includes(":")) {
      const [hours, minutes] = timeString.split(":");
      const date = new Date();
      date.setHours(parseInt(hours, 10));
      date.setMinutes(parseInt(minutes, 10));
      return date.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      });
    }

    // Otherwise try to parse as full datetime
    const date = new Date(timeString);
    if (isNaN(date.getTime())) {
      return timeString; // Return original if parsing fails
    }
    return date.toLocaleTimeString([], {
      hour: "2-digit",
      minute: "2-digit",
      hour12: true,
    });
  } catch (error) {
    return timeString; // Return original string if any error occurs
  }
};

const ActiveTaskComponent = () => {
  const {
    gotoMessageScreen,
    handleIsTaskClicked,
    isTaskClicked,
    isModalVisible,
    activeTaskClicked,
    hideModal,
    render_popup_button: renderPopupButton,
    isLoading,
    activeTasks,
    terminateTask,
  } = useManagementTask();

  const [search, setSearch] = useState<string>("");
  const [isPopupVisible, setIsPopupVisible] = useState(false);
  const [isTerminating, setIsTerminating] = useState(false);
  const [terminationError, setTerminationError] = useState<string>("");

  const inactivebtn = useThemeColor({}, "inactivebtn");
  const icon = useThemeColor({}, "icon");
  const textinput = useThemeColor({}, "textinput");

  /**
   * Method is used to handle the task termination process, and also handles any errors
   * that may occur during the process.
   */
  const handleTaskTermination = async () => {
    setIsTerminating(true);
    try {
      await terminateTask(activeTaskClicked);
    } catch (error) {
      console.log(error);
      setTerminationError("An error occurred while terminating the task");
    } finally {
      setIsTerminating(false);
    }
  };

  return (
    <View style={[styles.maincontainer, { backgroundColor: "white" }]}>
      <Text style={[styles.headerText, { color: "black" }]}>active tasks</Text>
      {/* Handles the task filter view */}
      <SearchInputContainer placeholder="staff name" />
      {/* Display the subheaders */}
      <View style={styles.subheadercontainer}>
        {subHeaders.map((header, index) => (
          <SubtitleThemedText key={index} text={header} />
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
            onPress={() => handleIsTaskClicked(task)}
            onLongPress={() => setIsPopupVisible(true)}
          >
            <Text
              style={[
                styles.text,
                { color: "black", textTransform: "uppercase" },
              ]}
            >
              {task.task_serial}
            </Text>

            <Text style={[styles.text, { color: "black" }]}>
              {task.employee_name}
            </Text>

            <Text style={[styles.text, { color: "black" }]}>
              {task.contract_name}
            </Text>
            <Text style={[styles.text, { color: "black" }]}>
              {formatTime(task.start_time)}
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
            <Pressable
              onPress={hideModal}
              style={[styles.modalCloseButton, { backgroundColor: textinput }]}
            >
              <Text style={styles.modalCloseButtonText}>Close</Text>
            </Pressable>
            <View
              style={[styles.modalContainer, { backgroundColor: textinput }]}
            >
              {/* Conditionally render the active task that was clicked, to display information to enable the user message the employee or call them. */}
              {activeTaskClicked && (
                <View style={styles.modalDetails}>
                  {/* Display the shift detials and buttons to terminate the shift, send a message to the staff */}
                  <View style={styles.modalInnerContainer}>
                    <Text style={styles.modalText}>shift id</Text>
                    <Text style={styles.modalText}>
                      {activeTaskClicked.shift_id}
                    </Text>
                  </View>

                  <View style={styles.modalInnerContainer}>
                    <Text style={styles.modalText}>employee details</Text>
                    <Text style={styles.modalText}>
                      {activeTaskClicked.employee_name}
                    </Text>
                    <Text style={styles.modalText}>
                      {activeTaskClicked.employee_id}
                    </Text>
                  </View>

                  {/* Navigate to the message screen when clicked to send the staff member a message. */}
                  <View>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={() => gotoMessageScreen(activeTaskClicked)}
                    >
                      <Text style={styles.modalBtnText}>message</Text>
                      <AntDesign name="message1" size={24} color={icon} />
                    </TouchableOpacity>
                  </View>

                  {/* Terminate the task when clicked */}
                  <View>
                    <TouchableOpacity
                      style={styles.modalButton}
                      onPress={handleTaskTermination}
                    >
                      <Text style={styles.modalBtnText}>terminate shift</Text>
                      <MaterialCommunityIcons
                        name="cancel"
                        size={24}
                        color={icon}
                      />
                    </TouchableOpacity>
                  </View>
                </View>
              )}
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

  mainModalContainer: {
    flex: 1,
    justifyContent: "center",
  },

  modalCloseButton: {
    alignSelf: "center",
    padding: 10,
    marginVertical: 10,
    borderRadius: 20,
    borderWidth: 1,
  },

  modalCloseButtonText: {
    fontSize: 15,
    fontFamily: "RobotoRegular",
    fontWeight: "800",
    textTransform: "uppercase",
  },

  modalContainer: {
    maxWidth: Platform.OS === "web" ? "50%" : "100%",
    padding: 5,
    borderRadius: 5,
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
    padding: 5,
    marginVertical: 2,
  },

  modalText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  modalButton: {
    alignItems: "center",
    padding: 5,
    rowGap: 5,
  },

  modalBtnText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  modalInnerContainer: {
    rowGap: 5,
  },
});
