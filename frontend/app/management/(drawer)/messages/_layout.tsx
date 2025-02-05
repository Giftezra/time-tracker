import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import MessageProvider from '@/app/context/management/messages/messageContext'
import { Stack } from 'expo-router'

const MessagesLayout = () => {
  return (
    <MessageProvider>
        <Stack screenOptions={{headerShown: false}}/>
    </MessageProvider>
  )
}

export default MessagesLayout

const styles = StyleSheet.create({})