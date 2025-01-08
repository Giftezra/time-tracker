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
  Swipeable,
  TouchableOpacity,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { user_image } from "@/app/utils/images";



/**
 * Type props for the message containers
 */
type MessageContainerProps = {
  conversation_id: string;
  last_message: string;
  time: string;
  reciepient: string;
  sender_id: string;
};

/**
 * Contains the fetched message details from the server
 *
 */
const conversationDetails: MessageContainerProps[] = [
  {
    conversation_id: "1234",
    last_message: "Hello, how are you doing today?",
    time: "12:00",
    reciepient: "Admin",
    sender_id: "1234",
  },
  {
    conversation_id: "123",
    last_message: "I am doing great, how about you?",
    time: "12:01",
    reciepient: "User",
    sender_id: "1234",
  },
  {
    conversation_id: "12354",
    last_message: "I am doing great, how about you?",
    time: "12:01",
    reciepient: "User",
    sender_id: "1234",
  },
];

/**
 * Fires the fetch request to delete the given messge from the conversation database given the message id
 * @returns {JSX.Element} Deletes the conversation when swiped
 */
const deleteConversation = () => {
  return (
    <Pressable
      onPress={() => console.log("message deleted")}
      style={{ justifyContent: "center", padding: 5 }}
    >
      <AntDesign name="delete" size={15} color="red" />
    </Pressable>
  );
};

/**
 *
 * @param param0
 * @returns
 */
const ConversationComponent = ({
  onConversationSelect,
  onHandleModalVisibility,
}: {
  onConversationSelect: (id: string, reciepient: string) => void;
  onHandleModalVisibility: (id:string | null) => void;
}) => {
  const [search, setSearch] = useState("");


  const secondaryColor = useThemeColor({}, "secondaryColor");
  const text = useThemeColor({}, "text");
  const textinput = useThemeColor({}, "textinput");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const innerbackground = useThemeColor({}, "innerBackground");


  return (
    /**
        Main container */

    <View style={[styles.maincontainer, { backgroundColor: secondaryColor }]}>
      {/* Row container contains the search container and the new message icon to open a new conversation */}
      <View style={[styles.searchContainer, { backgroundColor: textinput }]}>
        {/* Search container */}
        <TextInput
          placeholder="search messages"
          inputMode="search"
          value={search}
          onChangeText={(text) => setSearch(text)}
          style={[styles.searchInput]}
        />
        <TouchableOpacity style={styles.iconButtons}>
          <AntDesign name="search1" size={20} color={text} />
        </TouchableOpacity>

        <TouchableOpacity style={styles.iconButtons}>
          <AntDesign name="plus" size={20} color={text} />
        </TouchableOpacity>
      </View>

      {/* Renders all of the users conversations.
          All components are wrapped in a scroll view to enable scrolling.
          The swipeable component is used to delete a conversation when swiped left to present the delete icon
       */}
      <ScrollView style={styles.messageContainer}>
        {conversationDetails.map((conversation, index) => (
          <Swipeable
            key={index}
            containerStyle={styles.swipeable}
            renderRightActions={deleteConversation}
          >
            {/* Pass the method to get the conversation id */}
            <Pressable
              style={[styles.messageRow, { backgroundColor: innerbackground }]}
              onPress={() =>
                onConversationSelect(
                  conversation.conversation_id,
                  conversation.reciepient
                )
              }
              onPressIn={() =>
                onHandleModalVisibility(conversation?.conversation_id)
              }
            >
              <Image source={user_image} style={styles.image} />
              <View style={styles.messageDetailsContainer}>
                <Text style={styles.reciepientText}>
                  {conversation.reciepient}
                </Text>
                <Text style={styles.text}>{conversation.last_message}</Text>
              </View>
              <Text style={styles.timeText}>{conversation.time}</Text>
            </Pressable>
          </Swipeable>
        ))}
      </ScrollView>
    </View>
  );
};

export default ConversationComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#154c79",
  },

  searchContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-around",
    alignItems: "center",
    width: "100%",
    borderWidth:0.4,
    borderRadius: 5,
  },

  searchInput: {
    flex: 1,
    padding: Platform.OS === "web" ? 5 : 10,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },

  iconButtons: {
    padding: Platform.OS === "web" ? 5 : 10,
    marginHorizontal: 5,
    marginVertical: 5,
    borderRadius: 30,
    backgroundColor: "#063970",
  },

  messageContainer: {
    width: "100%",
    flexDirection: "column",
    flex: 1,
  },

  messageRow: {
    flexDirection: "row",
    width: "100%",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 1,
  },

  image: {
    width: 35,
    height: 35,
    borderRadius: 20,
  },

  messageDetailsContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "flex-start",
    marginHorizontal: 10,
  },

  text: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "lowercase",
    color: "white",
  },

  reciepientText: {
    fontSize: 13,
    fontFamily: "RobotoRegular",
    fontWeight: "600",
    textTransform: "uppercase",
  },

  timeText: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "lowercase",
    color: "red",
  },

  swipeable: {
    width: "100%",
    flex: 1,
  },
});
