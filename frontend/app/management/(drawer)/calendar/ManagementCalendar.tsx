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
  const { schedule, showEditShiftModal, setShowEditShiftModal, activeShift } =
    useCalendar();

    const getColor = (status: string) => {
      switch (status) {
        case "completed":
          return "green";
        case "pending":
          return "yellow";
        case "started":
          return "lightblue";
        case "cancelled":
          return "red";
        case "assigned":
          return "lightgreen";
        default:
          return "black";
      }
    };

    const renderDot = (status: string) => {
      return (
        <View style={[styles.dot, { backgroundColor: getColor(status) }]} />
      );
    };

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
                <View style={styles.colorContainer}>
                  <Text style={styles.colorText}>{`completed`} {renderDot("completed")}</Text>
                  <Text style={styles.colorText}>{`pending`} {renderDot("pending")}</Text>
                  <Text style={styles.colorText}>{`started`} {renderDot("started")}</Text>
                  <Text style={styles.colorText}>{`cancelled`} {renderDot("cancelled")}</Text>
                  <Text style={styles.colorText}>{`assigned`} {renderDot("assigned")}</Text>
                </View>
              </View>
              {schedule === "shifts" && (
                <ScrollView
                  style={{ flex: 1 }}
                  horizontal={true}
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={{ flexGrow: 1 }}
                  >
                    <CalendarShiftComponent />
                </ScrollView>
              )}  
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

  colorContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 10,
    gap: 5,
    overflow: 'scroll',
    marginHorizontal: 10,
  },
  colorText: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "BarlowMedium",
    color: "black",
    textTransform: "lowercase",
  },
  dot: {
    width: 8,
    height: 8,
    borderRadius: 5,
  },
});
