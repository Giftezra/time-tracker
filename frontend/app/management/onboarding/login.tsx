import {
  ImageBackground,
  SafeAreaView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import LoginComponent from "@/app/component/helper/login";
import { Gesture, GestureHandlerRootView } from "react-native-gesture-handler";

import AuthProvider from "@/app/authentication";

const image = require("../../../assets/images/login_background_image.jpg");

const login = () => {
  return (
    <AuthProvider>
      <SafeAreaView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1, justifyContent: "center" }}>
          <ImageBackground style={{ flex: 1 }} source={image}>
            <LoginComponent />
          </ImageBackground>
        </GestureHandlerRootView>
      </SafeAreaView>
    </AuthProvider>
  );
};

export default login;

const styles = StyleSheet.create({});
