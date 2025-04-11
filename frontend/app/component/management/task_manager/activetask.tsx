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
import SearchInputContainer from "@/app/component/helper/SearchInput";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import SubtitleThemedText from "@/app/component/helper/SubtitleThemedText";
import ActiveTask from "@/app/component/helper/tasks/ActiveTask";
/* Constant value for the sub headers representing each mapped item */
const subHeaders = ["task serial", "employees", "contract", "start time"];

/**
 * Method is used to format the time string to a more readable format.
 * The new date is used to ensure that the time is displayed in the local timezone.
 * @param timeString - The time string to format.
 * @returns The formatted time string.
 */
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
/* Import the useManagementTask context and destructure the necessary values */
const ActiveTaskComponent = () => {
  const {
    handleIsTaskClicked,
    isTaskClicked,
    isModalVisible,
    activeTaskClicked,
    render_popup_button: renderPopupButton,
    activeTasks,
  } = useManagementTask();

  const [isPopupVisible, setIsPopupVisible] = useState(false);

  const inactivebtn = useThemeColor({}, "inactivebtn");
  const text = useThemeColor({}, "text");



  return (
    <View style={[styles.maincontainer, ]}>
      <Text style={[styles.headerText, { color: "black" }]}>active tasks</Text>
      {/* Handles the task filter view */}
      <SearchInputContainer placeholder="Search by task ID or Staff name" text="Search Active Tasks" />
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
          >
            <Text
              style={[
                styles.text,
                { color: text, textTransform: "uppercase" },
              ]}
            >
              {task.task_serial}
            </Text>

            <Text style={[styles.text, { color: text }]}>
              {task.employee_name}
            </Text>

            <Text style={[styles.text, { color: text }]}>
              {task.contract_name}
            </Text>
            <Text style={[styles.text, { color: text }]}>
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
          <ActiveTask activeTaskClicked={activeTaskClicked as ActiveTaskType} />
         
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
    padding: Platform.OS === "web" ? 5 : 10,
    shadowRadius: 5,
    elevation: 5,
    shadowOpacity: 0.5,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 14 : 16,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
    marginVertical: 10,
    borderRadius: 20,
    textShadowRadius: 10,
    letterSpacing: 0.4,
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
    fontFamily: "BarlowMedium",
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "600",
    textTransform: "capitalize",
  },

  scrollview: {
    padding: 2,
    width: "100%",
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

});
