import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { registerTranslation } from "react-native-paper-dates";
import { Stack } from 'expo-router';
import AvailabilityProvider from '@/app/context/staff/availabilityProvider';
registerTranslation("pl", {
  save: "Save",
  selectSingle: "Select date",
  selectMultiple: "Select dates",
  selectRange: "Select period",
  notAccordingToDateFormat: (inputFormat) =>
    `Date format must be ${inputFormat}`,
  mustBeHigherThan: (date) => `Must be later then ${date}`,
  mustBeLowerThan: (date) => `Must be earlier then ${date}`,
  mustBeBetween: (startDate, endDate) =>
    `Must be between ${startDate} - ${endDate}`,
  dateIsDisabled: "Day is not allowed",
  previous: "Previous",
  next: "Next",
  typeInDate: "Type in date",
  pickDateFromCalendar: "Pick date from calendar",
  close: "Close",
  hour: "Hour",
  minute: "Minute",
});


const MainStaffAvailabitilityLayout = () => {
  return (
    <AvailabilityProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="StaffAvailability" />
      </Stack>
    </AvailabilityProvider>
  );
}

export default MainStaffAvailabitilityLayout

const styles = StyleSheet.create({})