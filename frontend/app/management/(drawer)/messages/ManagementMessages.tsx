/**
 * This is the main component for the admin messages page which enables the user to communicate with the and other members of the company.
 * The component
 */
import {
  Platform,
  StyleSheet,
  View,
  Text,
  SafeAreaView,
  KeyboardAvoidingView,
  Modal,
  ScrollView,
  RefreshControl,
} from "react-native";
import React, { useState, useCallback } from "react";
import { useLoadedFonts } from "@/hooks/useLoadedFonts";

import ChatRoomComponent from "@/app/component/management/messsges/chatRoom";
import MessageComponent from "@/app/component/management/messsges/messages";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import SideComponent from "@/app/component/helper/sideComponent";
import { useAuth } from "@/app/authentication";
import { useMessageContext } from "@/app/context/management/messages/messageContext";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ChatRoomType } from "@/app/types/management/messages";
const ManagementMessages = () => {
  const { windowWidth } = useAuth();
  const { activeChatRoom, setActiveChatRoom, connectWebSocket } =
    useMessageContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Handle when a conversation is selected from the chat list
  const handleModalVisibility = (id: string | null) => {
    if (id !== null) {
      setIsModalVisible(true);
    }
  };

  // Handle direct message requests (e.g., from Leaderboard)
  const handleDirectMessage = async (userId: string, userName: string) => {
    try {
      await connectWebSocket(userId);

      setActiveChatRoom({
        userId,
        name: userName,
        id: `temp-${userId}`,
        lastMessage: null,
        time: null,
      });

      // Open the message modal/view
      setIsModalVisible(true);
    } catch (error) {
      console.error("Error starting conversation:", error);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        {Platform.OS === "web" ? (
          <GestureHandlerRootView
            style={[styles.mainContainer, { width: windowWidth }]}
          >
            <View style={{ width: windowWidth * 0.2 }}>
              <SideComponent />
            </View>
            <View style={[styles.rowContainer, { width: windowWidth * 0.8 }]}>
              <View style={styles.conversationComponentContainer}>
                <ChatRoomComponent
                  onConversationSelect={handleModalVisibility}
                  onHandleModalVisibility={handleModalVisibility}
                  onDirectMessage={handleDirectMessage} // Pass the handler down
                />
              </View>
              <View style={{ flex: 2 }}>
                {activeChatRoom === null ? (
                  <View style={styles.emptyMessagecontainer}>
                    <Text>Click on any conversation to view the messages</Text>
                  </View>
                ) : (
                  <View style={styles.messageComponentContainer}>
                    <MessageComponent
                      messgaeInterface={activeChatRoom as ChatRoomType}
                      closeModal={handleCloseModal}
                    />
                  </View>
                )}
              </View>
            </View>
          </GestureHandlerRootView>
        ) : (
          <View style={{ flex: 1, width: "100%" }}>
            <ChatRoomComponent
              onConversationSelect={handleModalVisibility}
              onHandleModalVisibility={handleModalVisibility}
              onDirectMessage={handleDirectMessage} // Pass the handler down
            />
            <Modal
              visible={isModalVisible}
              animationType="slide"
              onRequestClose={handleCloseModal}
            >
              <MessageComponent
                messgaeInterface={activeChatRoom as ChatRoomType}
                closeModal={handleCloseModal}
              />
            </Modal>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default ManagementMessages;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
  },

  rowContainer: {
    flex: 1,
    flexDirection: "row",
    padding: 16,
    gap: 16,
  },

  conversationComponentContainer: {
    flex: 1,
    minWidth: 280,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },

  messageComponentContainer: {
    flex: 2,
    backgroundColor: "#ffffff",
    borderRadius: 8,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    overflow: "hidden",
  },

  emptyMessagecontainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#ffffff",
    borderRadius: 8,
  },
});
