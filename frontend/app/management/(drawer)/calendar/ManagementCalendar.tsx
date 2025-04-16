import {
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import CalendarHeader from "@/app/component/management/calendar/calendarHeader";
import CalendarContextProvider, {
  useCalendar,
} from "@/app/context/management/calendar/calendarContext";
import CalendarShiftComponent from "@/app/component/management/calendar/shifts";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SideComponent from "@/app/component/helper/sideComponent";
import { useAuth } from "@/app/authentication";
import EditShiftComponent from "@/app/component/management/calendar/editshift";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const ManagementCalendar = () => {
  const {
    schedule,
    showEditShiftModal,
    setShowEditShiftModal,
    activeShift,
  } = useCalendar();

  const { windowWidth } = useAuth();

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
                <CalendarHeader />
              </View>
              {schedule === "shifts" &&
                /* Render the view in a scrollview horizontally for mobile */
                (Platform.OS === "web" ? (
                  <View style={{ flexGrow: 1, marginEnd: 5 }}>
                    <CalendarShiftComponent />
                  </View>
                ) : (
                  <ScrollView
                    style={{ flex: 1 }}
                    horizontal={true}
                    showsHorizontalScrollIndicator={false}
                  >
                    <CalendarShiftComponent />
                  </ScrollView>
                ))}
            </View>
          </View>

          <Modal
            visible={showEditShiftModal}
            onDismiss={() => setShowEditShiftModal(false)}
          >
            <Pressable
              style={{ padding: 10 }}
              onPress={() => setShowEditShiftModal(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </Pressable>
            <ScrollView
              showsVerticalScrollIndicator={false}
              style={styles.scrollView}
            >
              <EditShiftComponent shift={activeShift} />
            </ScrollView>
          </Modal>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default ManagementCalendar;

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

  modalContainer: {
    padding: 10,
  },

  closeButton: {
    padding: 10,
  },

  scrollView: {
    flex: 1,
    padding: 5,
  },
});
