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
} from "react-native";
import React, { useState } from "react";
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

const MainAdminMessages = () => {
  const { windowWidth } = useAuth();
  const { handleChatDisplay, chatDisplay } = useMessageContext();

  const [isModalVisible, setIsModalVisible] = useState(false);

  /**
   * Set the modal visibility to true if the user clicks on any conversation
   * @param id
   */
  const handleModalVisibility = (id: string | null) => {
    if (id !== null) {
      setIsModalVisible(true);
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
                  onConversationSelect={handleChatDisplay}
                  onHandleModalVisibility={handleModalVisibility}
                />
              </View>
              {/* Display inactivity page when the user is yet to click on any conversation.
        Display the message component when the user clicks on the conversation to chat with */}
              <View style={{ flex: 2 }}>
                {chatDisplay === null ? (
                  <View style={styles.emptyMessagecontainer}>
                    <Text>Click on any conversation to view the messages</Text>
                  </View>
                ) : (
                  <View style={styles.messageComponentContainer}>
                    <MessageComponent
                      conversation_id={chatDisplay.chatroomId}
                      reciepient={chatDisplay.reciepient}
                      closeModal={handleCloseModal}
                    />
                  </View>
                )}
              </View>
            </View>
          </GestureHandlerRootView>
        ) : (
          /**
           * The mobile view for the message component displays the conversation component and the message component.
           *
           * When the user clicks on any conversation, the message component is displayed using  a modal
           */

          <View style={{ flex: 1, width: "100%" }}>
            <ChatRoomComponent
              onConversationSelect={handleChatDisplay}
              onHandleModalVisibility={handleModalVisibility}
            />

            <Modal
              visible={isModalVisible}
              animationType="slide"
              onRequestClose={handleCloseModal}
            >
              <MessageComponent
                conversation_id={chatDisplay?.chatroomId}
                reciepient={chatDisplay?.reciepient}
                closeModal={handleCloseModal}
              />
            </Modal>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default MainAdminMessages;

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
