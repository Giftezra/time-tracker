/**
 * Component is used to display the list of open tasks. the component is self sufficient by callining its own methods to get the data from the server..
 */

import {
  Alert,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import AssignTaskModal from "./assignTask";
import { AntDesign } from "@expo/vector-icons";

import CustomModal from "../../helper/customModal";

import { OpenTaskProps } from "@/app/types/management/task";
import { useThemeColor } from "@/hooks/useThemeColor";
import SearchInputContainer from "../../helper/searchInput";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";

const OpenTaskComponents = () => {
  // Get the methods from the context
  const { unassignedTask } = useManagementTask();

  const inactivebtn = useThemeColor({}, "inactivebtn");
  const innerBackground = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");
  const textinput = useThemeColor({}, "textinput");
  const highlight = useThemeColor({}, "otherText");
  const background = useThemeColor({}, "background");

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OpenTaskProps | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState({ hours: 0, minutes: 0 });

  /**
   * Method opens the modal and sets the task selected
   */
  const openAssignTaskModal = (task: OpenTaskProps) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeAssignTaskModal = () => {
    setModalVisible(false);
    alert("Task Assigne");
  };

  return (
    <View style={styles.maincontainer}>
      <Text style={[styles.headerText]}>Open Tasks</Text>
      {/* View for the search params of task based on the id or status */}
      <SearchInputContainer placeholder="enter task serial" />
      <ScrollView
        style={styles.scrollContainer}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Map the data
              The mapped data represents a task that will be clickable to open a modal. which will enable the admin assign the task to a user.*/}
          {unassignedTask?.map((task, Index) => (
            /**
             * Main dropdown container for the task component which contains the task details
             */
            <View
              key={Index}
              style={[
                styles.dropdownContainer,
                { backgroundColor: innerBackground },
              ]}
            >
              <View style={styles.headerContainer}>
                <Text style={[styles.headerText, { color: text }]}>
                  {task.contract_name}
                </Text>
                <View
                  style={[
                    styles.priority,
                    /**
                     * The priority of the task is represented by the color of the circle
                     */
                    task.task_priority === "High"
                      ? { backgroundColor: "red" }
                      : task.task_priority === "Medium"
                      ? { backgroundColor: "yellow" }
                      : { backgroundColor: "green" },
                  ]}
                ></View>
              </View>

              <Text style={[styles.text, { color: text, alignSelf: "center" }]}>
                {task.task_created_at}
              </Text>
              <View style={styles.containers}>
                <Text style={[styles.text, { color: highlight }]}>
                  {task.contract_address}
                </Text>
                <Text style={[styles.text, { color: highlight, textTransform: "uppercase" }]}>
                  {task.contract_postcode}
                </Text>
                <View style={{ flexWrap: "wrap" }}>
                  <Text style={[styles.text, { color: highlight }]}>
                    {task.created_by}
                  </Text>
                </View>
              </View>
              <View style={styles.containers}>
                <Text style={[styles.text, { color: highlight }]}>
                  {task.task_start_date}
                </Text>
                <Text style={[styles.text, { color: highlight }]}>
                  {task.task_end_date}
                </Text>
              </View>

              <TouchableOpacity
                style={[styles.assignButton, { backgroundColor: inactivebtn }]}
                onPress={() => openAssignTaskModal(task)}
              >
                <Text style={styles.buttonText}>assign task</Text>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      </ScrollView>

      <CustomModal
        isModalOpen={modalVisible}
        closeModal={() => setModalVisible(!modalVisible)}
      >
        <View
          style={[styles.centeredmodalView, { backgroundColor: background }]}
        >
          <View style={styles.modalView}>
            {selectedTask && (
              <AssignTaskModal
                task={selectedTask}
                dates={selectedDates}
                setDates={setSelectedDates}
                time={selectedTime}
                setTime={setSelectedTime}
                onClose={closeAssignTaskModal}
              />
            )}
          </View>
        </View>
      </CustomModal>
    </View>
  );
};

export default OpenTaskComponents;

const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: "column",
    width: "100%",
    flex: 1,
  },

  scrollContainer: {
    flexGrow: 1,
  },

  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    alignItems: "center",
    width: "100%",
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  priority: {
    width: 15,
    height: 15,
    backgroundColor: "red",
    borderRadius: 120,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 13 : 20,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    alignSelf: "center",
    marginVertical: 2,
  },

  text: {
    fontSize: Platform.OS === "web" ? 10 : 14,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "lowercase",
    padding: 2,
  },

  containers: {
    flexDirection: "column",
    padding: 5,
    borderWidth: 0.5,
    marginVertical: 2,
    borderRadius: 5,
  },

  dropdownContainer: {
    flexGrow: 1,
    flexDirection: "column",
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    width: 150,
    maxWidth: 200,
    marginHorizontal: 5,
    marginVertical: 5,
  },

  assignButton: {
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 0.3,
    marginVertical: 5,
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.4,
  },

  buttonText: {
    color: "white",
    fontSize: Platform.OS === "web" ? 12 : 16,
    fontWeight: "600",
    fontFamily: "OswaldVariable",
    textTransform: "capitalize",
  },

  centeredmodalView: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 2,
  },

  modalView: {
    flexGrow: 1,
  },

  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginHorizontal: 2,
    borderWidth: 0.5,
    borderRadius: 5,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },

  input: {
    flex: 1,
    padding: Platform.OS === "web" ? 5 : 8,
    fontSize: Platform.OS === "web" ? 12 : 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },

  searchIcon: {
    padding: Platform.OS === "web" ? 5 : 10,
    alignItems: "center",
    backgroundColor: "gray",
    borderRadius: 20,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.5,
    marginVertical: 1,
    marginHorizontal: 5,
  },
});
