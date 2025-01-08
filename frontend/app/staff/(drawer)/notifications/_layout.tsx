import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import NotificationProvider from '@/app/context/staff/notificationProvider'

const MainStaffNotificationLayout = () => {
  return (
    <NotificationProvider>
      <Stack screenOptions={{ headerShown: false }}/>
    </NotificationProvider>
  );
}

export default MainStaffNotificationLayout

const styles = StyleSheet.create({})