import {
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  StyleSheet,
  Text,
  View,
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
} from "@/app/types/staff/eventType";
import CustomModal from "@/app/component/helper/customModal";

import { useEventContext } from "@/app/context/staff/staffEventProvider";
import { useAuth } from "@/app/context/authentication";
import CalendarAgendaComponent from "@/app/component/staff/events/calendarAgenda";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ca } from "react-native-paper-dates";

const MainEventComponent = () => {
  const { isModalOpen, handleModal, retrieveShiftDetails } = useEventContext();

  // Save the selected event details in state
  const [shiftDetails, setShiftDetails] = useState<
    EventDetailsInterface | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState(false);

  /**
   * Method is used to handle the event click and does a few things.
   * First, it retrieves the shift details from the server.
   * Second, it opens the modal to display the event details.
   */
  const handleEventClicked = async (id: string) => {
    try {
      setIsLoading(true);
      const details = await retrieveShiftDetails(id);
      setShiftDetails(details);
      handleModal();
    } catch (error: any) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <CalendarAgendaComponent onPress={handleEventClicked} />

          {/* Display the event details using a modal which will be open when the item is clicked.
           */}
          <Modal visible={isModalOpen} animationType="slide">
            {/* Display the event details using the EventDetailsComponent */}
            <View style={{ flex: 1 }}>
              <TouchableOpacity onPressIn={handleModal} style={{ padding: 10 }}>
                <Text>Close</Text>
              </TouchableOpacity>
              <EventDetailsComponent props={shiftDetails} />
            </View>
          </Modal>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default MainEventComponent;

const styles = StyleSheet.create({});
