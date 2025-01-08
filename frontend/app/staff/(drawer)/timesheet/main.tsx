import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TimeSheetHeaderComponent from "@/app/component/staff/timeSheet/timeSheetHeader";
import TaskDetailsContainerComponent from "@/app/component/staff/helper/taskDetailsContainer";
import TaskDataManager from "@/app/component/staff/timeSheet/taskDataManager";
import TimeSheetComponent from "@/app/component/staff/timeSheet/timeSheet";
import TimeSheetContainerComponent from "@/app/component/staff/timeSheet/timesheetContainer";
import { useTask } from "@/app/context/staff/staffTaskProvider";

const MainStaffTimesheetComponent = () => {
  const { handleBreakTime, handleEndTask } = useTask();

  return (
    <SafeAreaProvider style={styles.maincontainer}>
      <View>
        <TimeSheetHeaderComponent
          startBreakButton={() => {}}
          clockOutButton={() => {}}
          clockOutTime="12:00"
          breakTime="00:00"
          clockInTime="00:00"
        />
        <TaskDataManager />
      </View>
      <View style={{ flex: 1 }}>
        <TimeSheetContainerComponent />
      </View>
    </SafeAreaProvider>
  );
};

export default MainStaffTimesheetComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 5,
  },
});
