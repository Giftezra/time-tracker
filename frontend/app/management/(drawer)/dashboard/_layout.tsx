import { StyleSheet, Text, View } from 'react-native'
import React from 'react'
import DashboardProvider from '@/app/context/management/dashboard/dashboardContext'
import { Stack } from 'expo-router'

const DashboardLayout = () => {
  return (
    <DashboardProvider>
        <Stack screenOptions={{headerShown: false}}/>
    </DashboardProvider>
  )
}

export default DashboardLayout;

const styles = StyleSheet.create({})