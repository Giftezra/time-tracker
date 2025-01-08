/** This component is used to display the shifts or tasks for admins. 
 * Since the admins will not be making use ofd the staff app, they need a way to see shifts they have been assigned to and also manipulate those shifts.
 * The admins can cancel a shift, approve a shift, and perform other managements on the shift status.
 * 
 * Note: owners are not expected to be assigned to a shift but they can have a schedule managed on the app. this will include all schedules designed by them given the time, type and location where the appointments will be.
 *These schedules will throw an alert when they are about to happen
 */
import {StyleSheet, Text, View} from 'react-native'
import React from 'react'

const MyTasksComponent = () => {
  return (
    <View>
      <Text>MyTasksComponent</Text>
    </View>
  )
}

export default MyTasksComponent

const styles = StyleSheet.create({})