/**
 * The component handles all the users messages in real time between the server and the client using socket.io to create a real time connection.
 * @param param0 Conversation id is the conversation id sent from the parent component
 * The Conversation id is used to get the messages from that conversation from the server.
 * The messages are displayed in a column view.
 * @returns {JSX.Element} The component returns a JSX element
 */

import {
  ActivityIndicator,
  Image,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
  FlatList,
  RefreshControl,
} from "react-native";
import React, { useState, useEffect, useCallback } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useMessageContext } from "@/app/context/management/messages/messageContext";
import { useAuth } from "@/app/authentication";

import { Message, ChatRoomType } from "@/app/types/management/messages";
import { user_image } from "@/app/utils/images";

/**
 * This method is used to render messages sent between users and reciepient in the chat component.
 * The messages are rendered in a column view with the reciepient on the left and the user on the right.
 * @param item
 * @returns
 */
const renderMessage = ({
  item,
  sentByMe,
}: {
  item: Message;
  sentByMe: boolean;
}) => {
  return (
    <Pressable style={styles.messageWrapper}>
      <View
        style={[
          styles.messageItem,
          sentByMe ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text
          style={[
            styles.messageText,
            { color: sentByMe ? "#FFFFFF" : "#000000" },
          ]}
        >
          {item.content}
        </Text>
        <View style={styles.messageFooter}>
          <Text
            style={[
              styles.timestamp,
              { color: sentByMe ? "rgba(255,255,255,0.7)" : "#666666" },
            ]}
          >
            {item.timestamp.split("T")[1].slice(0, 5)}
          </Text>
          {item.is_read && (
            <MaterialIcons
              name="done-all"
              size={16}
              color={sentByMe ? "rgba(255,255,255,0.9)" : "#34B7F1"}
              style={{ marginLeft: 5 }}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const MessageComponent = ({
  messgaeInterface,
  closeModal,
}: {
  messgaeInterface: ChatRoomType;
  closeModal: () => void;
}) => {
  const [text, setText] = useState("");
  const { messages, isSentByMe, sendMessage, fetchChatHistory } =
    useMessageContext();

  const secondaryColor = useThemeColor({}, "secondaryColor");
  const innerBackgroundColor = useThemeColor({}, "innerBackground");
  const textcolor = useThemeColor({}, "text");
  const highlightColor = useThemeColor({}, "highlight");
  const textinput = useThemeColor({}, "textinput");

  const [refreshing, setRefreshing] = useState(false);
  /* Trigger the refresh and get the chat history from the server given the user id */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchChatHistory(messgaeInterface.userId);
    setRefreshing(false);
  }, [messgaeInterface.userId, fetchChatHistory]);

  const handleSendMessage = async () => {
    if (text.trim()) {
      // Use the userId from props when sending the message
      await sendMessage(messgaeInterface.userId, text.trim());
      setText(""); // Clear input after sending
    }
  };

  return (
    <GestureHandlerRootView
      style={[styles.mainContainer, { backgroundColor: secondaryColor }]}
    >
      {/* Header row with back button, image and recipient info */}
      <View
        style={[styles.rowContainer, { backgroundColor: innerBackgroundColor }]}
      >
        <TouchableOpacity style={styles.headerBackButton} onPress={closeModal}>
          <AntDesign name="arrowleft" size={24} color={textcolor} />
        </TouchableOpacity>

        <Image source={user_image} style={styles.image} />
        <View style={styles.reciepientandCallcontainer}>
          <Text style={[styles.reciepientText, { color: highlightColor }]}>
            {messgaeInterface.name}
          </Text>
        </View>
      </View>

      {/* This view contains the messages sent betweeen the user and the reciepient */}
      <FlatList
        data={messages}
        renderItem={({ item }) => renderMessage({ item, sentByMe: isSentByMe })}
        keyExtractor={(item, index) => item.id?.toString() ?? index.toString()}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10 }}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
      />

      {/* The view contains the message inputs to be sent */}
      <View
        style={[styles.sendMessageContainer, { backgroundColor: textinput }]}
      >
        <TextInput
          placeholder="Enter your message here....."
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleSendMessage}
          style={styles.messageInput}
          autoCorrect={true}
          multiline={true}
          numberOfLines={2}
        />
        <Pressable style={styles.sendButton} onPress={handleSendMessage}>
          <AntDesign name="arrowright" size={24} color={textcolor} />
        </Pressable>
      </View>
    </GestureHandlerRootView>
  );
};

export default MessageComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
  },

  rowContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#FFFFFF",
  },

  headerBackButton: {
    padding: 8,
    marginRight: 8,
    borderRadius: 20,
    justifyContent: "center",
    alignItems: "center",
  },

  reciepientandCallcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    marginLeft: 12,
  },

  image: {
    width: 45,
    height: 45,
    borderRadius: 23,
  },

  reciepientText: {
    fontSize: Platform.OS === "web" ? 16 : 18,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  sendMessageContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 8,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#FFFFFF",
  },

  messageInput: {
    flex: 1,
    padding: Platform.OS === "web" ? 8 : 10,
    fontSize: 16,
    backgroundColor: "#F0F2F5",
    borderRadius: 20,
    marginRight: 8,
    minHeight: 40,
    maxHeight: 100,
  },

  sendButton: {
    padding: 10,
    borderRadius: 25,
    backgroundColor: "#0084FF",
    justifyContent: "center",
    alignItems: "center",
    width: 45,
    height: 45,
  },

  messageWrapper: {
    flexDirection: "column",
    marginVertical: 4,
    paddingHorizontal: 8,
  },

  messageItem: {
    minWidth: "25%",
    maxWidth: "75%",
    padding: 12,
    borderRadius: 20,
  },

  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0084FF",
    borderBottomRightRadius: 4,
    marginLeft: "auto",
  },

  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#FFFFFF",
    borderBottomLeftRadius: 4,
    marginRight: "auto",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 1,
    },
    shadowOpacity: 0.15,
    shadowRadius: 1,
    elevation: 1,
  },

  messageText: {
    fontSize: 15,
    lineHeight: 20,
    marginBottom: 4,
  },

  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
    marginTop: 2,
  },

  timestamp: {
    fontSize: 11,
  },
});
