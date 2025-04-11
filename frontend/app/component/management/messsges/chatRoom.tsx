/**
 * The component is used to handle the users conversation page. The component displays conversations between the user and the admin.
 *
 * Messages are displayed in a box like colum view.
 * The new message icon when clicked, displays a list of all employees in the company.
 * Conversations are end to end encrypted.
 */

import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  ScrollView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { user_image } from "@/app/utils/images";
import { useMessageContext } from "@/app/context/management/messages/messageContext";

const ChatRoomComponent = ({
  onConversationSelect,
  onHandleModalVisibility,
}: {
  onConversationSelect: (
    chatRoomId: string,
    reciepient: string,
    time: string
  ) => void;
  onHandleModalVisibility: (id: string | null) => void;
}) => {
  const { chatRooms, deleteConversation, connectWebSocket } = useMessageContext();
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const text = useThemeColor({}, "text");
  const textinput = useThemeColor({}, "textinput");

  const swipeGesture = Gesture.Pan()
    .activeOffsetX(-20)
    .onEnd(() => {
      deleteConversation();
    });

  return (
    /**
        Main container */

    <View style={[styles.maincontainer, { backgroundColor: secondaryColor }]}>
      {/* Renders all of the users conversations.
          All components are wrapped in a scroll view to enable scrolling.
          The swipeable component is used to delete a conversation when swiped left to present the delete icon
       */}
      <ScrollView
        style={styles.messageContainer}
        showsVerticalScrollIndicator={false}
      >
        {chatRooms?.map((chat, index) => {
          return (
            <GestureDetector key={index} gesture={swipeGesture}>
              <Pressable
                style={[styles.messageRow, { backgroundColor: textinput }]}
                onPress={() => {
                  onConversationSelect(chat.id, chat.name, chat.time);
                  onHandleModalVisibility(chat.id);
                  connectWebSocket(chat.userId);
                }}
              >
                <Image source={user_image} style={styles.image} />
                <View style={styles.messageDetailsContainer}>
                  <Text style={styles.reciepientText}>{chat.name}</Text>
                  <Text style={styles.text}>{chat.lastMessage}</Text>
                </View>
                <Text style={styles.timeText}>{chat.time.split("T")[1].split(".")[0]}</Text>
              </Pressable>
            </GestureDetector>
          );
        })}
      </ScrollView>
    </View>
  );
};

export default ChatRoomComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: "100%",
    overflow: "hidden",
  },

  iconButtons: {
    padding: 8,
    marginHorizontal: 4,
    borderRadius: 20,
    backgroundColor: "#007AFF",
  },

  messageContainer: {
    width: "100%",
    flex: 1,
  },

  messageRow: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    alignItems: "center",
    borderBottomWidth: 1,
    paddingHorizontal: 5,
    borderRadius: 5,
  },

  image: {
    width: 48,
    height: 48,
    borderRadius: 24,
  },

  messageDetailsContainer: {
    flex: 1,
    marginLeft: 12,
  },

  text: {
    fontSize: 13,
    fontFamily: "BarlowRegular",
    color: "#666666",
    marginTop: 4,
  },

  reciepientText: {
    fontSize: 15,
    fontFamily: "RobotoRegular",
    fontWeight: "600",
    textTransform: "capitalize",
    color: "#D1E",
  },

  timeText: {
    fontSize: 12,
    color: "#999999",
    marginLeft: 8,
  },
});
