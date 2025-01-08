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
import EditUserDetailsComponent from "@/app/component/management/profile/edit_company_details";
import { useThemeColor } from "@/hooks/useThemeColor";
import ProfileProvider from "@/app/context/management/profile/profileContext";
import { useAuth } from "@/app/context/management/authentication";
import SideComponent from "@/app/component/helper/sideComponent";

const MainAdminProfile = () => {
  const { windowWidth } = useAuth();

  const [modalVisible, setModalVisible] = React.useState(false);
  const secondary = useThemeColor({}, "secondaryColor");

  /**
   * Set the modal visible to false. Method is passed as props to trigger the modal visibility
   */
  const onModalVisible = () => {
    setModalVisible(!modalVisible);
  };

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
                <UserDetailsComponent onModalVisible={onModalVisible} />
              </View>
              <View style={{ flex: 2 }}>
                <EditUserDetailsComponent onModalVisible={onModalVisible} />
              </View>
            </View>
          </View>
        ) : (
          <View
            style={{
              width: windowWidth,
            }}
          >
            <UserDetailsComponent onModalVisible={onModalVisible} />
          </View>
        )}

        <Modal animationType="slide" visible={modalVisible}>
          <GestureHandlerRootView style={{ flex: 1 }}>
            <EditUserDetailsComponent onModalVisible={onModalVisible} />
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
