import { KeyboardAvoidingView, Modal, StyleSheet, Text, View } from 'react-native'
import React, { useState } from 'react'
import { SafeAreaProvider } from 'react-native-safe-area-context'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
import AvailabilityPageComponent from '@/app/component/staff/availability/availabilityPage'
import AvailabilityDetailsComponent from '@/app/component/staff/availability/availabitityDetails'

const MainAvailabilityComponent = () => {
  const [isAvailabiltyClicked, setIsAvailabiltyClicked] = useState(false)

  const toggleAvailability = () => setIsAvailabiltyClicked(!isAvailabiltyClicked)

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <KeyboardAvoidingView style={{ flex: 1 }} behavior="padding">
          <View style={{ flex: 1 }}>
            <AvailabilityPageComponent onPress={toggleAvailability} />
          </View>
        </KeyboardAvoidingView>
      </GestureHandlerRootView>

      {/* Render the availability details in a modal when clicked */}
      <Modal visible={isAvailabiltyClicked} animationType="slide">
        <AvailabilityDetailsComponent onPress={toggleAvailability} />
      </Modal>
    </SafeAreaProvider>
  )
}

export default MainAvailabilityComponent

const styles = StyleSheet.create({})