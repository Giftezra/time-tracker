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
} from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";

import { MessageProps } from "@/app/types/management/messgaes";
import { user_image } from "@/app/utils/images";


const MessageComponent = ({
  conversation_id,
  reciepient,
  closeModal,
}: {
  conversation_id: string | null;
  reciepient: string;
  closeModal: () => void;
}) => {
  const [messages, setMessages] = useState<MessageProps>({
    sender_messages: [],
    reciepient_messages: [],
  });

  const [text, setText] = useState<string>("");

  /**
   * Method is used to set to set the messages between the sender and the reciepient
   * The messages are fetched from the server using the conversation id and displayed in the message container using the array of messages.
   *Method uses the temporary text to set the message from the sender and is added to the messages array.
   */
  const handleMessages = () => {
    if (text.trim()) {
      // Avoid adding empty messages
      setMessages((prevMessages) => ({
        sender_messages: [...prevMessages.sender_messages, text],
        reciepient_messages: [...prevMessages.reciepient_messages],
      }));
      setText(""); // Clear the input field after sending
    }
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
          <Pressable style = {styles.sendButton}>
            <MaterialIcons name="call" size={26} color={'green'} />
          </Pressable>
        </View>
      </View>

      {/* Contains the messages between both senders */}
      <ScrollView
        style={{ flex: 1, width: "100%" }}
        showsVerticalScrollIndicator={false}
      >
        <View>
          <Text>{messages?.sender_messages}</Text>
        </View>
      </ScrollView>

      {/* The view contains the message inputs to be sent */}
      <View style={[styles.sendMessageContainer, { backgroundColor:textinput}]}>
        <TextInput
          placeholder="Type a message"
          value={text}
          onChangeText={(text) => setText(text)}
          onSubmitEditing={handleMessages}
          style={styles.messageInput}
          autoCorrect={true}
          multiline={true}
        />
        <Pressable onPress={handleMessages} style={styles.sendButton}>
          <AntDesign name="arrowright" size={24} color={text} />
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
});
