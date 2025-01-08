import {
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";

import EventDetailsComponent from "@/app/component/staff/events/eventDetails";

import { EventDisplayProps, EventProps } from "@/app/types/staff/eventType";
import CustomModal from "@/app/component/helper/customModal";

import { useEventContext } from "@/app/context/staff/staffEventProvider";
import { useAuth } from "@/app/context/management/authentication";
import CalendarAgendaComponent from "@/app/component/staff/helper/calendarAgenda";
import { SafeAreaProvider } from "react-native-safe-area-context";

const eventDisplay: EventDisplayProps = {
  id: "1",
  site_name: "melstone",
  site_address: "54 king aberdeen",
  site_postcode: "ky12 4sa",
  start_time: "12:00",
  end_time: "23:00",
  information: "information",
};

const shiftDetails: EventProps = {
  client: "amberstone",
  site_name: "melstone",
  site_address: "54 king aberdeen",
  site_postcode: "ky12 4sa",
  start_time: "12:00",
  end_time: "23:00",
  information: "information",
  pay: "10",
  paylevel: "staff",
  department: "department",
  colleague: [
    { name: "enigma", staff_id: "staff_id" },
    { name: "nowhere", staff_id: "staff_id" },
  ],
};

const MainEventComponent = () => {
  const { isModalOpen, handleModal, retrieveShiftDetails } = useEventContext();
  const { token } = useAuth();

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView>
        <KeyboardAvoidingView style={{ flex: 1 }}>
          <CalendarAgendaComponent onPress={() => console.log("hello")} />
        </KeyboardAvoidingView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default MainEventComponent;

const styles = StyleSheet.create({});
