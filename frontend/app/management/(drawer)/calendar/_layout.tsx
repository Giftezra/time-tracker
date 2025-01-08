import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import {Stack} from 'expo-router'
import CalendarContextProvider from '@/app/context/management/calendar/calendarContext'

const CalendarLayout = () => {
    return (
      <CalendarContextProvider>
        <Stack screenOptions={{headerShown:false}} />
      </CalendarContextProvider>
    );
}

export default CalendarLayout

const styles = StyleSheet.create({})