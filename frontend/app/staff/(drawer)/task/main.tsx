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
import CustomModal from "@/app/component/helper/customModal";
import CalenderComponent from "@/app/component/staff/helper/calender";

import { TaskDetailsInterface, TaskInterface } from "@/app/types/staff/task";
import { useTask } from "@/app/context/staff/staffTaskProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const MainStaffTaskManager = () => {
  const { tasks, taskDetials } = useTask();

  const { isModalVisible, handleTaskDetails, handleModalDisplay, markedDates } =
    useTask();

  return (
    <SafeAreaProvider style={styles.maincontainer}>
      <View style={{ flex: 1 }}>
        <View style={styles.calendarContainer}>
          {/* Display the calendar component which when clicked, fires the method to get the tasks available for the selected day. */}
          <CalenderComponent markedDates={markedDates} />
        </View>
        <View style={styles.container}>
          <FlatList
            data={tasks}
            keyExtractor={(item) => item.id}
            renderItem={({ item }) => (
              <TasksComponent
                props={item}
                onPress={() => handleTaskDetails(item.id)}
              />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <Modal visible={isModalVisible} animationType="slide">
          <View style={styles.modalContainer}>
            <TouchableOpacity onPress={handleModalDisplay}>
              <MaterialCommunityIcons name="close" size={30} color="black" />
            </TouchableOpacity>

            <TaskDetailsComponent
              onModalClose={handleModalDisplay}
              props={taskDetials}
            />
          </View>
        </Modal>
      </View>
    </SafeAreaProvider>
  );
};

export default MainStaffTaskManager;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 2,
  },

  calendarContainer: {
    flex: 1,
    borderRadius: 5,
    borderWidth: 2,
    overflow: "hidden",
    backgroundColor: "white",
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
});
