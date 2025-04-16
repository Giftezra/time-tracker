import {
  KeyboardAvoidingView,
  Modal,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import AvailabilityPageComponent from "@/app/component/staff/availability/availabilityPage";
import AvailabilityDetailsComponent from "@/app/component/staff/availability/availabitityDetails";
import { useAvailability } from "@/app/context/staff/availabilityProvider";

const StaffAvailability = () => {
  const { fetchAvailabilityDates } = useAvailability();
  const [isLoading, setIsLoading] = useState(false);
  const [isAvailabiltyClicked, setIsAvailabiltyClicked] = useState(false);

  const openAvailability = async () => {
    setIsLoading(true);
    try{
      await fetchAvailabilityDates();
      setIsAvailabiltyClicked(true);
    } catch (error) {
      console.error("Error fetching availability dates:", error);
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <SafeAreaProvider style={styles.container}>
      <GestureHandlerRootView style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior="padding">
          <ScrollView style={styles.container}>
            <AvailabilityPageComponent onPress={openAvailability} />
          </ScrollView>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>

      {/* Render the availability details in a modal when clicked */}
      <Modal visible={isAvailabiltyClicked} animationType="slide">
        <View style={styles.modalContainer}>
          <AvailabilityDetailsComponent onPress={() => setIsAvailabiltyClicked(false)} />
        </View>
      </Modal>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  modalContainer: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
});

export default StaffAvailability;
