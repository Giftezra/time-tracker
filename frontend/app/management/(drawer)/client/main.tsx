import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  SafeAreaView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  Modal,
} from "react-native";
import React, { useEffect, useState } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { Dimensions } from "react-native";


import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaProvider } from "react-native-safe-area-context";
import WebClientComponent from "./webFile";
import ClientMobileComponent from "./mobileFile";

const MainClient = () => {
  const [isModalVisible, setIsModalVisible] = useState(false);

  const background = useThemeColor({}, "primaryColor");
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );
  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("screen").width
  );

  const [toggleView, setToggleView] = useState<string>("assigned tasks");
  /**
   * Sets the toggle view to the value of the params
   * @param {string} value
   */
  const handleToggleView = (value: string) => {
    setToggleView(value);
  };

  return (
    <SafeAreaProvider style={[{ flex: 1, }, { backgroundColor: background }]}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        {Platform.OS === "web" ? (
          <View style={[{flex: 1 }]}>
            <WebClientComponent />
          </View>
        ) : (
          <GestureHandlerRootView
            style={{
              flex: 1,
            }}
          >
            <ClientMobileComponent />
          </GestureHandlerRootView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default MainClient;

const styles = StyleSheet.create({});
