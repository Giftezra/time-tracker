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

import ConversationComponent from "@/app/component/management/messsges/conversations";
import MessageComponent from "@/app/component/management/messsges/messages";
import {
  GestureHandlerRootView,
  TouchableOpacity,
} from "react-native-gesture-handler";
import SideComponent from "@/app/component/helper/sideComponent";
import { useAuth } from "@/app/context/management/authentication";
import { useMessageContext } from "@/app/context/management/messages/messageContext";

type ConversationProps = {
  conversation_id: string;
  reciepient: string;
};

const MainAdminMessages = () => {
  const { windowWidth } = useAuth();
  const { deleteMessage } = useMessageContext();

  const [conversationId, setConversationId] = useState<ConversationProps>({
    conversation_id: "",
    reciepient: "",
  });
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

  /**
   * Set the conversation id
   */
  const handleConversationId = (id: string, reciepient: string) => {
    setConversationId({ conversation_id: id, reciepient: reciepient });
  };

  /**
   * Handle message deletion when swiped
   */
  const handleMessageDelete = async (messageId: string) => {
    try {
      await deleteMessage(messageId);
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <SafeAreaView style={{ flex: 1 }}>
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
                <ConversationComponent
                  onConversationSelect={handleConversationId}
                  onHandleModalVisibility={handleModalVisibility}
                />
              </View>
              {/* Display inactivity page when the user is yet to click on any conversation.
        Display the message component when the user clicks on the conversation to chat with */}
              <View style={{ flex: 2 }}>
                {conversationId === null ? (
                  <View style={styles.emptyMessagecontainer}>
                    <Text>Click on any conversation to view the messages</Text>
                  </View>
                ) : (
                  <View style={styles.messageComponentContainer}>
                    <MessageComponent
                      conversation_id={conversationId.conversation_id}
                      reciepient={conversationId.reciepient}
                      closeModal={handleCloseModal}
                      onMessageDelete={handleMessageDelete}
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
            <View style={{ flex: 1, width: "100%" }}>
              <ConversationComponent
                onConversationSelect={handleConversationId}
                onHandleModalVisibility={handleModalVisibility}
              />
            </View>

            <Modal
              visible={isModalVisible}
              style={styles.messageComponentContainer}
            >
              <View style={{ flex: 1, width: "100%" }}>
                <MessageComponent
                  conversation_id={conversationId?.conversation_id}
                  reciepient={conversationId?.reciepient}
                  closeModal={handleCloseModal}
                  onMessageDelete={handleMessageDelete}
                />
              </View>
            </Modal>
          </View>
        )}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MainAdminMessages;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
  },

  rowContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 1,
  },

  conversationComponentContainer: {
    flex: 1,
    minWidth: 200,
    marginEnd: 5,
  },

  messageComponentContainer: {
    flex: 2,
    borderWidth: 0.5,
  },

  emptyMessagecontainer: {
    justifyContent: "center",
    alignItems: "center",
  },
});
