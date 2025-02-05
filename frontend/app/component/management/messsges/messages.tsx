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
} from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import {
  GestureHandlerRootView,
  Swipeable,
} from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useMessageContext } from "@/app/context/management/messages/messageContext";

import { MessageProps } from "@/app/types/management/messgaes";
import { user_image } from "@/app/utils/images";

interface MessageComponentProps {
  conversation_id: string;
  reciepient: string;
  closeModal: () => void;
  onMessageDelete: (messageId: string) => void;
}

const MessageComponent: React.FC<MessageComponentProps> = ({
  conversation_id,
  reciepient,
  closeModal,
  onMessageDelete,
}) => {
  const { messages, sendMessage, fetchMessages } = useMessageContext();
  const [text, setText] = useState("");

  useEffect(() => {
    if (conversation_id) {
      fetchMessages(conversation_id);
    }
  }, [conversation_id]);

  const handleMessages = async () => {
    if (!text.trim()) return;

    try {
      await sendMessage(conversation_id, text);
      setText("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const renderRightActions = (messageId: string) => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => onMessageDelete(messageId)}
      >
        <Text style={styles.deleteActionText}>Delete</Text>
      </TouchableOpacity>
    );
  };

  const secondaryColor = useThemeColor({}, "secondaryColor");
  const innerBackgroundColor = useThemeColor({}, "innerBackground");
  const textcolor = useThemeColor({}, "text");
  const highlightColor = useThemeColor({}, "highlight");
  const textinput = useThemeColor({}, "textinput");

  return (
    <GestureHandlerRootView
      style={[styles.mainContainer, { backgroundColor: secondaryColor }]}
    >
      {/* Conditionally display a back button on mobile to enable the user close the modal */}
      {Platform.OS !== "web" && (
        <TouchableOpacity style={{ padding: 10 }} onPress={closeModal}>
          <AntDesign name="arrowleft" size={24} color={textcolor} />
        </TouchableOpacity>
      )}

      {/* Use the passed props to set the header for the conversation */}
      <View
        style={[styles.rowContainer, { backgroundColor: innerBackgroundColor }]}
      >
        <Image source={user_image} style={styles.image} />
        <View style={styles.reciepientandCallcontainer}>
          <Text style={[styles.reciepientText, { color: highlightColor }]}>
            {reciepient}
          </Text>
          <Pressable style={styles.sendButton}>
            <MaterialIcons name="call" size={26} color={"green"} />
          </Pressable>
        </View>
      </View>

      {/* Contains the messages between both senders */}
      <FlatList
        data={messages}
        renderItem={({ item }) => (
          <Swipeable
            renderRightActions={() => renderRightActions(item.id)}
            overshootRight={false}
          >
            <View style={styles.messageItem}>
              <Text>{item.content}</Text>
              <Text style={styles.timestamp}>{item.timestamp}</Text>
            </View>
          </Swipeable>
        )}
        keyExtractor={(item) => item.id}
      />

      {/* The view contains the message inputs to be sent */}
      <View
        style={[styles.sendMessageContainer, { backgroundColor: textinput }]}
      >
        <TextInput
          placeholder="Type a message"
          value={text}
          onChangeText={setText}
          onSubmitEditing={handleMessages}
          style={styles.messageInput}
          autoCorrect={true}
          multiline={true}
        />
        <Pressable onPress={handleMessages} style={styles.sendButton}>
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
    backgroundColor: "#31a7cb",
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
  },

  reciepientandCallcontainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
    alignItems: "center",
    padding: 5,
  },

  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
    marginHorizontal: 5,
    marginVertical: 5,
  },

  reciepientText: {
    fontSize: Platform.OS === "web" ? 15 : 20,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  sendMessageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    borderRadius: 3,
    marginBottom: 5,
    padding: 3,
  },

  messageInput: {
    flex: 1,
    fontFamily: "BarlowRegular",
    fontSize: 14,
    fontWeight: "600",
  },

  sendButton: {
    padding: Platform.OS === "web" ? 8 : 10,
    borderRadius: 20,
    backgroundColor: "#063970",
    marginEnd: 10,
  },

  messageItem: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "#eee",
  },

  timestamp: {
    fontSize: 12,
    color: "#666",
  },

  deleteAction: {
    backgroundColor: "red",
    justifyContent: "center",
    alignItems: "center",
    width: 80,
    height: "100%",
  },

  deleteActionText: {
    color: "white",
    fontWeight: "bold",
  },
});
