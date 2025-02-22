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

import {
  Message,
  MesssageComponentInterface,
} from "@/app/types/management/messgaes";
import { user_image } from "@/app/utils/images";

/**
 * This method is used to render messages sent between users and reciepient in the chat component.
 * The messages are rendered in a column view with the reciepient on the left and the user on the right.
 * @param item
 * @returns
 */
const renderMessage = ({
  item,
  isSentByMe,
}: {
  item: Message;
  isSentByMe: boolean;
}) => {
  return (
    <Pressable style={{ flexDirection: "column", flex: 1 }}>
      <View
        style={[
          styles.messageItem,
          isSentByMe ? styles.sentMessage : styles.receivedMessage,
        ]}
      >
        <Text
          style={[styles.messageText, { color: isSentByMe ? "#fff" : "#000" }]}
        >
          {item.content}
        </Text>
        <View style={styles.messageFooter}>
          <Text
            style={[styles.timestamp, { color: isSentByMe ? "#eee" : "#666" }]}
          >
            {item.timestamp}
          </Text>
          {item.is_read && (
            <MaterialIcons
              name="check"
              size={16}
              color={isSentByMe ? "#fff" : "green"}
              style={{ marginLeft: 5 }}
            />
          )}
        </View>
      </View>
    </Pressable>
  );
};

const MessageComponent: React.FC<MesssageComponentInterface> = (props) => {
  const [text, setText] = useState("");
  const { messages, isSentByMe, sendMessage} = useMessageContext();

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

      {/* Use the passed props to set the header for the conversation */}
      <View
        style={[styles.rowContainer, { backgroundColor: innerBackgroundColor }]}
      >
        <Image source={user_image} style={styles.image} />
        <View style={styles.reciepientandCallcontainer}>
          <Text style={[styles.reciepientText, { color: highlightColor }]}>
            {props.reciepient}
          </Text>
          <Pressable style={styles.sendButton}>
            <MaterialIcons name="call" size={26} color={"green"} />
          </Pressable>
        </View>
      </View>

      {/* This view contains the messages sent betweeen the user and the reciepient */}
      <FlatList
        data={messages}
        renderItem={({ item }) => renderMessage({ item, isSentByMe })}
        keyExtractor={(item) => item.id?.toString() ?? ""}
        style={{ flex: 1 }}
        contentContainerStyle={{ padding: 10 }}
      />

      {/* The view contains the message inputs to be sent */}
      <View
        style={[styles.sendMessageContainer, { backgroundColor: textinput }]}
      >
        <TextInput
          placeholder="Type a message"
          value={text}
          onChangeText={setText}
          style={styles.messageInput}
          autoCorrect={true}
          multiline={true}
        />
        <Pressable style={styles.sendButton} onPress={() => sendMessage(props.conversation_id, text)}>
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
    maxWidth: "80%",
    marginVertical: 4,
    marginHorizontal: 8,
    padding: 10,
    borderRadius: 12,
  },

  sentMessage: {
    alignSelf: "flex-end",
    backgroundColor: "#0084ff", // Facebook Messenger blue
    borderBottomRightRadius: 4,
  },

  receivedMessage: {
    alignSelf: "flex-start",
    backgroundColor: "#e4e6eb", // Light grey
    borderBottomLeftRadius: 4,
  },

  messageText: {
    fontSize: 16,
    marginBottom: 4,
  },

  messageFooter: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "flex-end",
  },

  timestamp: {
    fontSize: 12,
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
