/**
 * The profile main component is used to display the owners details including the company details
 * and options to edit the details.
 *
 * The component does not work for the staffs nor admins but for the owner only.
 */
import {
  Text,
  View,
  Platform,
  Modal,
  StyleSheet,
  KeyboardAvoidingView,
  Dimensions,
} from "react-native";
import React, { useEffect, useState } from "react";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";

import UserDetailsComponent from "@/app/component/management/profile/user details";
import EditUserDetailsComponent from "@/app/component/management/profile/editCompanyDetails";
import { useThemeColor } from "@/hooks/useThemeColor";
import ProfileProvider, {
  useProfileContext,
} from "@/app/context/management/profile/profileContext";
import { useAuth } from "@/app/authentication";
import SideComponent from "@/app/component/helper/sideComponent";

const MainAdminProfile = () => {
  const { windowWidth } = useAuth();
  const { savePreferences, onModalVisible, setOnModalVisible } =
    useProfileContext();
  const secondary = useThemeColor({}, "secondaryColor");

  return (
    <SafeAreaProvider
      style={[{ backgroundColor: secondary, width: windowWidth, flex: 1 }]}
    >
      <KeyboardAvoidingView style={{ width: windowWidth, flex: 1 }}>
        {Platform.OS === "web" ? (
          <View style={[styles.webrowContainer, { width: windowWidth }]}>
            <View style={{ width: windowWidth * 0.2 }}>
              <SideComponent />
            </View>

            <View
              style={{
                width: windowWidth * 0.8,
                flexDirection: "row",
                marginHorizontal: 5,
              }}
            >
              <View style={{ flex: 1 }}>
                <UserDetailsComponent />
              </View>
              <View style={{ flex: 2 }}>
                <EditUserDetailsComponent />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              flex: 1,
              width: windowWidth,
            }}
          >
            <UserDetailsComponent />
          </View>
        )}

        <Modal animationType="slide" visible={onModalVisible}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <EditUserDetailsComponent />
          </GestureHandlerRootView>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default MainAdminProfile;

const styles = StyleSheet.create({
  webrowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
});
