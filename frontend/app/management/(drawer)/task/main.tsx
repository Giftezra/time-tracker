/**
 * This is the main component of the task manager. The component is divided into three sections:
 * 1. Active tasks is a list of tasks that are currently in progress alongside the details of the task.
 * 2. Open tasks is a list of tasks that are not yet assigned to an employee. this task can be assigned to an employee in the assign task modal.
 * 3. Create task is a form that enables the admin to create a task and assign it to an employee.
 *
 * Each of these tasks are all self contained components that are imported into the main task manager component.
 * This means that each of the components can be used independently of the main task manager component and perform their respective functions.
 */

import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";

import ActiveTaskComponent from "@/app/component/management/task_manager/activetask";
import CreateTaskComponent from "@/app/component/management/task_manager/createTask";
import OpenTaskComponents from "@/app/component/management/task_manager/opentasks";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useAuth } from "@/app/context/authentication";
import SideComponent from "@/app/component/helper/sideComponent";
import AssignTaskModal from "@/app/component/management/task_manager/assignTask";
import { AntDesign } from "@expo/vector-icons";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";
import EditTaskComponent from "@/app/component/management/task_manager/editTask";

/** Variable for the sub header representing views to display */
const subHeader = ["open tasks", "active tasks", "create task"];

const MainEmployeeTaskManager = () => {
  const {
    assignTaskModalVisible,
    selectedTask,
    closeAssignTaskModal,
    setAssignTaskModalVisible,
    editTask,
    isEditTaskModalVisible,
    setIsEditTaskModalVisible,
    updateTask,
  } = useManagementTask();
  
  const { screenWidth, windowWidth } = useAuth();

  const background = useThemeColor({}, "background");
  const text = useThemeColor({}, "text");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const highlight = useThemeColor({}, "highlight");
  const innerBackground = useThemeColor({}, "innerBackground");


  const [toggleView, setToggleView] = useState<string>("open tasks");

  /**
   * Handles the toggle to set the value of the currently selected view.
   * When called the set value helps to determine the view that is currently selected.
   * @param view
   */
  const handleToggleView = (view: string) => {
    setToggleView(view);
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={[
          { flex: 1, width: windowWidth },
          { backgroundColor: background },
        ]}
      >
        {/* Display the views based on the plaform */}
        {Platform.OS === "web" ? (
          <View style={{ flex: 1, width: windowWidth, flexDirection: "row" }}>
            <View style={{ width: windowWidth * 0.2 }}>
              <SideComponent />
            </View>
            <View
              style={[
                styles.rowContainer,
                {
                  backgroundColor: innerBackground,
                  width: windowWidth * 0.8,
                },
              ]}
            >
              <View style={styles.columnContainer}>
                <View
                  style={[styles.column, { backgroundColor: secondaryColor }]}
                >
                  <OpenTaskComponents />
                </View>
                <View
                  style={[styles.column, { backgroundColor: secondaryColor }]}
                >
                  <ActiveTaskComponent />
                </View>
              </View>

              <View
                style={[
                  styles.createTaskcontainer,
                  { backgroundColor: secondaryColor },
                ]}
              >
                <CreateTaskComponent />
              </View>
            </View>
          </View>
        ) : (
          /**
           * The mobile view of the task manager. The view is divided into two sections:
           * The views are arranged in a column layout.
           */
          <View
            style={[
              styles.mobileContainer,
              { backgroundColor: innerBackground },
            ]}
          >
            <View>
              <View style={{ backgroundColor: secondaryColor }}>
                <Text style={styles.mobileHeaderText}>Task manager</Text>
              </View>
              {/* Create buttons to monitor the states and conditinally display the respective view  */}
              <View
                style={[
                  styles.mobileHeader,
                  { backgroundColor: secondaryColor },
                ]}
              >
                {/* Conditionally render the sub header */}
                {subHeader.map((header, index) => (
                  <TouchableOpacity
                    key={index}
                    onPress={() => handleToggleView(header)}
                    style={[
                      styles.mobileViewButtons,
                      toggleView === header &&
                        (styles.mobileSelectedView,
                        { borderBottomWidth: 1, borderBottomColor: highlight }),
                    ]}
                  >
                    <Text style={styles.mobileButtonText}>{header}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </View>

            {/* Conditionally render the selected view */}
            {toggleView === "open tasks" && (
              <View
                style={[
                  styles.mobileToggleView,
                  { backgroundColor: secondaryColor },
                ]}
              >
                <OpenTaskComponents />
              </View>
            )}
            {toggleView === "active tasks" && (
              <View
                style={[
                  styles.mobileToggleView,
                  { backgroundColor: secondaryColor },
                ]}
              >
                <ActiveTaskComponent />
              </View>
            )}
            {toggleView === "create task" && (
              <View
                style={[
                  styles.mobileToggleView,
                  { backgroundColor: secondaryColor },
                ]}
              >
                <CreateTaskComponent />
              </View>
            )}
          </View>
        )}

        {/* Display the assign task modal */}
        <Modal
          visible={assignTaskModalVisible}
          animationType="slide"
          transparent={true}
        >
          <View style={[styles.modalContent]}>
            <TouchableOpacity
              style={styles.modalCloseButton}
              onPress={() => setAssignTaskModalVisible(false)}
            >
              <AntDesign name="close" size={24} color={text} />
            </TouchableOpacity>
            {selectedTask && (
              <AssignTaskModal
                task={selectedTask}
                onClose={closeAssignTaskModal}
              />
            )}
          </View>
        </Modal>

        {/* Display the edit task modal */}
        {editTask && (
          <Modal
            visible={isEditTaskModalVisible}
            animationType="slide"
            transparent={true}
            style={styles.modalOverlay}
          >
            <View style={[styles.modalContent]}>
              <TouchableOpacity
                style={styles.modalCloseButton}
                onPress={() => setIsEditTaskModalVisible(false)}
              >
                <AntDesign name="close" size={24} color={text} />
              </TouchableOpacity>
            </View>

            <EditTaskComponent
              props={editTask}
              onPress={() => setIsEditTaskModalVisible(false)}
            />
          </Modal>
        )}
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default MainEmployeeTaskManager;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    width: "100%",
    flex: 1,
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },

  column: {
    flex: 1,
    shadowRadius: 10,
    shadowOpacity: 0.4,
    padding: 5,
    marginVertical: 1,
    borderRadius: 5,
    elevation: 10,
    marginHorizontal: 1,
  },

  columnContainer: {
    flex: 2,
    flexDirection: "column",
    justifyContent: "space-between",
    marginHorizontal: 2,
  },

  createTaskcontainer: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    shadowRadius: 10,
    shadowOpacity: 0.4,
    borderRadius: 5,
    elevation: 10,
    marginVertical: 1,
  },

  mobileContainer: {
    flex: 1,
    width: "100%",
  },

  mobileHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },

  mobileHeaderText: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "OswaldVariable",
    textTransform: "uppercase",
    color: "#771f07",
    alignSelf: "center",
    padding: 10,
  },

  mobileViewButtons: {
    flex: 1,
    padding: 5,
    alignItems: "center",
    marginHorizontal: 5,
    borderRadius: 5,
  },

  mobileButtonText: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    color: "white",
  },

  mobileToggleView: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
  },

  mobileSelectedView: {
    elevation: 5,
    shadowRadius: 5,
  },

  modalContent: {
    borderRadius: 10,
    padding: 5,
  },

  modalCloseButton: {
    alignSelf: "flex-end",
    padding: 10,
  },

  modalOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
});
