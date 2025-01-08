import {
  FlatList,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";

import TaskDetailsComponent from "@/app/component/staff/task/taskDetails";
import TasksComponent from "@/app/component/staff/task/tasksComponent";
import CustomModal from "@/app/component/helper/customModal";
import CalenderComponent from "@/app/component/staff/helper/calender";

import { TaskDetailsType, TaskProps } from "@/app/types/staff/task";
import { useTask } from "@/app/context/staff/staffTaskProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";

const MainStaffTaskManager = () => {
  const { tasks, taskDetials } = useTask();

  const {
    isModalVisible,
    handleTaskDetails,
    handleModalDisplay,
    setSelectedDate,
    markedDates,
  } = useTask();

  return (
    <SafeAreaProvider style={styles.maincontainer}>
      <View style={{ flex: 1 }}>
        <View style={styles.calendarContainer}>
          <CalenderComponent
            setSelectedDate={setSelectedDate}
            markedDates={markedDates}
          />
        </View>
        <View style={styles.container}>
          <FlatList
            data={tasks}
            keyExtractor={(item, index) => index.toString()}  
            renderItem={({ item }) => (
              <TasksComponent props={item} onPress={handleTaskDetails} />
            )}
            showsHorizontalScrollIndicator={false}
          />
        </View>

        <CustomModal
          isModalOpen={isModalVisible}
          closeModal={handleModalDisplay}
        >
          <TaskDetailsComponent
            onModalClose={handleModalDisplay}
            props={taskDetials}
          />
        </CustomModal>
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
    flex:1,
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
