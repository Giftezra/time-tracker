import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  View,
  Pressable,
} from "react-native";
import React, { useState } from "react";
import {
  Gesture,
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";

import EventDetailsComponent from "@/app/component/staff/events/eventDetails";

import {
  EventDisplayInterface,
  EventDetailsInterface,
} from "@/app/types/staff/event";
import CustomModal from "@/app/component/helper/customModal";

import { useEventContext } from "@/app/context/staff/staffEventProvider";
import CalendarAgendaComponent from "@/app/component/staff/events/calendarAgenda";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const StaffEvent = () => {
  const { isModalOpen, shiftDetails, isLoading, setIsModalOpen } =
    useEventContext();

  /**
   * Method is used to handle the event click and does a few things.
   * First, it retrieves the shift details from the server.
   * Second, it opens the modal to display the event details.
   */

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <CalendarAgendaComponent />

      <Modal visible={isModalOpen} animationType="slide">
        <View style={{ flex: 1 }}>
          <Pressable
            onPress={() => setIsModalOpen(false)}
            style={styles.overlayCloseButton}
          >
            <MaterialCommunityIcons name="close" size={24} color="black" />
          </Pressable>

          {isLoading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#0000ff" />
            </View>
          ) : (
            shiftDetails && <EventDetailsComponent props={shiftDetails} />
          )}
        </View>
      </Modal>
    </GestureHandlerRootView>
  );
};

const styles = StyleSheet.create({
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  overlayCloseButton: {
    position: "absolute",
    top: 5,
    right: 5,
    zIndex: 1000,
    padding: 10,
    borderRadius: 10,
  },
});

export default StaffEvent;
