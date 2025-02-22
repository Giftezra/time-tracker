import { StyleSheet, Text, View } from "react-native";
import React from "react";

import CustomModal from "@/app/component/helper/customModal";
import MessageComponent from "@/app/component/staff/messages/messages";
import ConversationComponent from "@/app/component/staff/messages/conversation-details";

import { ChatRoomType } from "@/app/types/staff/messages";
import { useMessageContext } from "@/app/context/staff/staffMessageProvider";

const conversationDetails: ChatRoomType[] = [
  {
    id: "1",
    lastMessage: "Hello",
    name: "John Doe",
    time: "12:00",
  },
  {
    id: "2",
    lastMessage: "Hi",
    name: "Jane Doe",
    time: "12:01",
  },
];

const MessageManager = () => {
  const { isModalVisible, handleModalVisibility, details } =
    useMessageContext();

  return (
    <View style={{ flex: 1 }}>
      {conversationDetails.map((conversation, index) => (
        <ConversationComponent props={conversation} key={index} />
      ))}

      <CustomModal
        isModalOpen={isModalVisible}
        closeModal={handleModalVisibility}
      >
        <MessageComponent props={details} />
      </CustomModal>
    </View>
  );
};

export default MessageManager;

const styles = StyleSheet.create({});
