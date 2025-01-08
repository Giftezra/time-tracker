import { StyleSheet, Text, View } from "react-native";
import React from "react";
import ClientProvider from "@/app/context/management/client/clientContext";
import {Stack} from "expo-router";

const ClientLayout = () => {
    return (
        <ClientProvider>
            <Stack screenOptions={{headerShown:false}} />
      </ClientProvider>
  );
};

export default ClientLayout;

const styles = StyleSheet.create({});
