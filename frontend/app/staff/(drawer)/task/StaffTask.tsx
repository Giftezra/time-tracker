import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";

import TaskDetailsComponent from "@/app/component/staff/task/taskDetails";
import TasksComponent from "@/app/component/staff/task/tasksComponent";
import CalenderComponent from "@/app/component/staff/helper/calender";
import { useStaffTask } from "@/app/context/staff/staffTaskProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StaffTask = () => {
  const { tasks, taskDetails } = useStaffTask();

  const {
    isModalVisible,
    getCompleteTaskDetails,
    handleModalDisplay,
    markedDates,
  } = useStaffTask();

  return (
    <SafeAreaProvider style={styles.maincontainer}>
      <View style={{ flex: 1 }}>
        <View style={styles.calendarContainer}>
          <View style={styles.calendarInstructions}>
            <MaterialCommunityIcons name="information" size={20} color="#666" />
            <Text style={styles.instructionText}>
              Navigate through months using ◀️ and ▶️ to view available tasks
            </Text>
          </View>
          <CalenderComponent markedDates={markedDates} />
        </View>
        {/* Display the tasks available for the selected day  if theres any available. otherwise display a message to the user */}
        {tasks.length > 0 ? (
          <View style={styles.container}>
            <FlatList
              data={tasks}
              keyExtractor={(item) => item.id}
              renderItem={({ item }) => (
                <TasksComponent
                  props={item}
                  onPress={() => getCompleteTaskDetails(item.id)}
                />
              )}
              showsHorizontalScrollIndicator={false}
            />
          </View>
        ) : (
          <View style={styles.noTasksContainer}>
            <Text style={styles.noTasksText}>
              There are no tasks available for the selected day. contact your
              admin, or check again later.
            </Text>
          </View>
        )}

        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity
              onPress={handleModalDisplay}
              style={styles.overlayCloseButton}
            >
              <Text style={{ fontSize: 20 }}>❌</Text>
            </TouchableOpacity>

            <TaskDetailsComponent
              onModalClose={handleModalDisplay}
              taskDetails={taskDetails}
            />
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
};

export default StaffTask;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 2,
  },

  calendarContainer: {
    flex: 1,
    overflow: "hidden",
    backgroundColor: "white",
    borderRadius: 5,
    margin: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
    minHeight: 200,
  },

  calendarInstructions: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },

  instructionText: {
    marginLeft: 8,
    fontSize: 14,
    color: "#666",
    fontFamily: "BarlowLight",
    flex: 1,
  },

  modalContainer: {
    flex: 1,
    width: "100%",
  },

  container: {
    flex: 1,
    padding: 2,
    marginTop: 5,
  },

  innerContainer: {
    width: "90%",
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
  },

  overlayCloseButton: {
    position: "absolute",
    top: 0,
    right: 0,
    zIndex: 100,
    padding: 10,
  },

  noTasksContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    marginTop: 10,
    padding: 10,
    flexWrap: "wrap",
  },

  noTasksText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    letterSpacing: 1,
  },
});
