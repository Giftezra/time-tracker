import { SafeAreaView, StyleSheet, Text, View } from "react-native";
import React from "react";
import MessageManager from "./message-manager";

import MessageProvider from "@/app/context/staff/staffMessageProvider";

const MainStaffMessages = () => {
  return (
    <MessageProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <View style={{ flex: 1 }}>
          <MessageManager />
        </View>
      </SafeAreaView>
    </MessageProvider>
  );
};

export default MainStaffMessages;

const styles = StyleSheet.create({});
