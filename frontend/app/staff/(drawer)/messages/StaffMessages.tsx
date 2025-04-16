import { Modal, SafeAreaView, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import ChatRoomComponent from "@/app/component/management/messsges/chatRoom";
import { useMessageContext } from "@/app/context/management/messages/messageContext";
import MessageComponent from "@/app/component/management/messsges/messages";
  import { ChatRoomType } from "@/app/types/management/messages";

const StaffMessages = () => {
  const { activeChatRoom } = useMessageContext();
  const [isModalVisible, setIsModalVisible] = useState(false);

  const handleModalVisibility = (id: string | null) => {
    if (id !== null) {
      setIsModalVisible(true);
    }
  };

  const handleCloseModal = () => {
    setIsModalVisible(false);
  };

  return (
    <View style={{ flex: 1, width: "100%" }}>
      <View style={{ flex: 1, width: "100%" }}>
        <ChatRoomComponent
          onConversationSelect={handleModalVisibility}
          onHandleModalVisibility={handleModalVisibility}
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
    </View>
  );
};

export default StaffMessages;

const styles = StyleSheet.create({});
