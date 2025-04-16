import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import NotificationProvider from '@/app/context/management/notifications/notificationContext'

const NotificationLayout = () => {
  return (
    <NotificationProvider>
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="ManagementNotification" />
      </Stack>
    </NotificationProvider>
  )
}


export default NotificationLayout

const styles = StyleSheet.create({})