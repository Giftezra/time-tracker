import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { Stack } from 'expo-router' 
import MessageProvider from '@/app/context/staff/staffMessageProvider'

const StaffMessagesLayout = () => {
  return (
    <MessageProvider>  
        <Stack screenOptions={{headerShown: false}}/>
    </MessageProvider>
  )
}

export default StaffMessagesLayout;

const styles = StyleSheet.create({})