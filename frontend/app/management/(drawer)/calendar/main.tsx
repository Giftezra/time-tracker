import {
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import TextInputComponent from "@/app/component/helper/textInput";
import ButtonComponent from "@/app/component/helper/buttons";
import SearchInputContainer from "@/app/component/helper/searchInput";
import WeeklyShiftCalendar from "@/app/component/management/calendar/calendarHeader";
import CalendarHeader from "@/app/component/management/calendar/calendarHeader";
import CalendarContextProvider, {
  useCalendar,
} from "@/app/context/management/calendar/calendarContext";
import CalendarShiftComponent from "@/app/component/management/calendar/shifts";
import MyTasksComponent from "@/app/component/management/calendar/myTask";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SideComponent from "@/app/component/helper/sideComponent";
import { useAuth } from "@/app/context/authentication";

const MainManagementCalendarComponent = () => {
  const {
    schedule,
    timeFrame,
    search,
    setSearch,
    handleSchedule,
    handleWeekSeleced,
  } = useCalendar();

  const { screenWidth, windowWidth } = useAuth();

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flexGrow: 1 }}>
          <View style={{ flexDirection: "row", flex: 1 }}>
            {/* Check thge platform type to display the side component */}
            {Platform.OS === "web" && (
              <View style={{ width: windowWidth * 0.2, marginEnd: 5 }}>
                <SideComponent />
              </View>
            )}
            {/* Main view for the calendar  should have a width set based on the platform or a flex if it a mpbile*/}
            <View
              style={
                Platform.OS === "web"
                  ? { width: windowWidth * 0.8 }
                  : { flex: 1 }
              }
            >
              <View style={styles.calendarContainer}>
                <CalendarHeader onPress={() => console.log("pressed")} />
              </View>
              {schedule === "shifts" ? (
                /* Render the view in a scrollview horizontally for mobile */
                Platform.OS === "web" ? (
                  <View style={{ flexGrow: 1, marginEnd: 5 }}>
                    <CalendarShiftComponent />
                  </View>
                ) : (
                  <ScrollView
                    style={{ flexGrow: 1 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <CalendarShiftComponent />
                  </ScrollView>
                )
              ) : Platform.OS === "web" ? (
                <View style={{ flexGrow: 1, marginEnd: 5 }}>
                  <MyTasksComponent />
                </View>
              ) : (
                <ScrollView
                  style={{ flexGrow: 1 }}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                >
                  <MyTasksComponent />
                </ScrollView>
              )}
            </View>
          </View>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default MainManagementCalendarComponent;

const styles = StyleSheet.create({
  calendarContainer: Platform.select({
    web: {
      width: "100%",
    },
    default: {
      flex: 0.4,
      flexDirection: "column",
    },
  }),
});
