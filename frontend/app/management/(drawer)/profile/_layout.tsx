import { View, Text } from 'react-native'
import React from 'react'
import { Stack } from 'expo-router'
import ProfileProvider from '@/app/context/management/profile/profileContext'

const MainProfileLayout = () => {
  return (
    <ProfileProvider>
      <Stack screenOptions={{ headerShown: false }} />
    </ProfileProvider>
  )
}

export default MainProfileLayout