import { StyleSheet, Text, View } from 'react-native'
import React from 'react'

import { Stack } from 'expo-router'
import MessageProvider from '@/app/context/management/messages/messageContext'
import { GestureHandlerRootView } from 'react-native-gesture-handler'
const StaffMessagesLayout = () => {
  return (
    <GestureHandlerRootView style={{flex: 1}}>
    <MessageProvider>  
        <Stack screenOptions={{headerShown: false}}/>
    </MessageProvider>
    </GestureHandlerRootView>
  )
}

export default StaffMessagesLayout;

const styles = StyleSheet.create({})