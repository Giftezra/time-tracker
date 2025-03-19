import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TimeSheetHeaderComponent from "@/app/component/staff/timeSheet/timeSheetHeader";
import TimeSheetContainerComponent from "@/app/component/staff/timeSheet/timesheetContainer";

const MainStaffTimesheetComponent = () => {
  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <SafeAreaProvider style={styles.maincontainer}>
        <View>
          <TimeSheetHeaderComponent
            startBreakButton={() => {}}
            clockOutButton={() => {}}
            clockOutTime="12:00"
            breakTime="00:00"
            clockInTime="00:00"
          />
        </View>
        <View style={{ flex: 1 }}>
          <TimeSheetContainerComponent />
        </View>
      </SafeAreaProvider>
    </GestureHandlerRootView>
  );
};

export default MainStaffTimesheetComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 5,
  },
});
