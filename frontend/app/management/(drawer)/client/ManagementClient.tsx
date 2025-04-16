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
import WebClientComponent from "./WebFile";
import ClientMobileComponent from "./MobileFile";
import { useClientContext } from "@/app/context/management/client/clientContext";
import AddContractComponent from "@/app/component/management/client/addcontract";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import AddClientComponent from "@/app/component/management/client/addClient";
import EditContractComponent from "@/app/component/management/client/editContracts";
import EditClientComponent from "@/app/component/management/client/editClient";
import ButtonText from "@/app/component/helper/ButtonText";
const MainClient = () => {
  const {
    isCreateContractModalVisible,
    toggleCreateContractModal,
    isCreateClientModalVisible,
    setIsCreateClientModalVisible,
    isEditContractModalVisible,
    setIsEditContractModalVisible,
    activeContract,
    isEditClientModalVisible,
    setIsEditClientModalVisible,
    activeClient,
    setIsCreateContractModalVisible,
  } = useClientContext();

  const background = useThemeColor({}, "primaryColor");

  return (
    <SafeAreaProvider style={[{ flex: 1 }, { backgroundColor: background }]}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        {/* Display the add client component which will enable the user enter a new client details */}
        {/* Button creates a new client */}
        <View>
          <TouchableOpacity
            style={styles.newClientButton}
            onPress={() => setIsCreateClientModalVisible(true)}
          >
            <ButtonText text="new client" />
          </TouchableOpacity>
        </View>

        {Platform.OS === "web" ? (
          <View style={[{ flex: 1 }]}>
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

        {/* Display the add contract component which will enable the user enter a new contract  details for the selected client */}
        <Modal
          visible={isCreateContractModalVisible}
          onRequestClose={() => setIsCreateContractModalVisible(false)}
          style={styles.modalContainer}
        >
          <View>
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsCreateContractModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </Pressable>
          </View>
          <AddContractComponent />
        </Modal>

        {/* Display the add client component which will enable the user enter a new client details */}
        {/* Add new client modal is displayed when the user clicks on the new client button */}
        <Modal
          visible={isCreateClientModalVisible}
          onRequestClose={() => setIsCreateClientModalVisible(false)}
          style={styles.modalContainer}
        >
          <View style={styles.modalContainer}>
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsCreateClientModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </Pressable>
            <AddClientComponent />
          </View>
        </Modal>

        <Modal
          visible={isEditContractModalVisible}
          onRequestClose={() => setIsEditContractModalVisible(false)}
          style={styles.modalContainer}
        >
          <View>
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsEditContractModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </Pressable>
          </View>

          <EditContractComponent activeContract={activeContract} />
        </Modal>

        <Modal
          visible={isEditClientModalVisible}
          onRequestClose={() => setIsEditClientModalVisible(false)}
          style={styles.modalContainer}
        >
          <View>
            <Pressable
              style={styles.closeButton}
              onPress={() => setIsEditClientModalVisible(false)}
            >
              <MaterialCommunityIcons name="close" size={24} color="black" />
            </Pressable>
          </View>

          {activeClient && <EditClientComponent client={activeClient} />}
        </Modal>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default MainClient;

const styles = StyleSheet.create({
  modalContainer: {
    flex: 1,
    width: "100%",
  },

  closeButton: {
    justifyContent: "flex-end",
    padding: 5,
    borderRadius: 10,
  },

  newClientButton: {
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    backgroundColor: "white",
    borderWidth: 1,
    borderColor: "gray",
  },

  newClientButtonText: {
    fontFamily: "RobotoRegular",
    fontSize: 14,
    textTransform: "uppercase",
    fontWeight: "700",
  },
});
