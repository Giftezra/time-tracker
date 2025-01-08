import { StyleSheet, Text, View } from "react-native";
import React from "react";
import TaskDetailsContainerComponent from "../helper/taskDetailsContainer";

const TaskDataManager = () => {
  return (
    <View style={styles.taskDataContainer}>
      <View style={styles.taskData}>
        <TaskDetailsContainerComponent
          title="This pay period"
          data="£500"
        />
      </View>
      <View style={styles.taskData}>
        <TaskDetailsContainerComponent
          title="total hours worked"
          data="45:45hrs"
        />
      </View>
    </View>
  );
};

export default TaskDataManager;

const styles = StyleSheet.create({
  taskDataContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
  },
    taskData: {
    borderRadius: 5,
    borderWidth: 0.2,
    padding: 2,
    marginHorizontal: 2,
    marginVertical: 2,
  },
});
