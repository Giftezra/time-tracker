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
  const { chatroomDetails, deleteConversation } = useMessageContext();

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
      <ScrollView
        style={styles.messageContainer}
        showsVerticalScrollIndicator={false}
      >
        {chatroomDetails.map((chat, index) => (
          <Swipeable key={index} containerStyle={styles.swipeable}>
            <Pressable
              style={[styles.messageRow, { backgroundColor: innerbackground }]}
              onPress={() =>
                onConversationSelect(chat.id, chat.name, chat.time)
              }
              onPressIn={() => onHandleModalVisibility(chat.id)}
            >
              <Image source={user_image} style={styles.image} />
              <View style={styles.messageDetailsContainer}>
                <Text style={styles.reciepientText}>{chat.name}</Text>
                <Text style={styles.text}>{chat.lastMessage}</Text>
              </View>
              <Text style={styles.timeText}>{chat.time}</Text>
            </Pressable>
          </Swipeable>
        ))}
      </ScrollView>
    </View>
  );
};

export default ChatRoomComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    overflow: "hidden",
  },

  searchContainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    backgroundColor: "#ffffff",
  },

  searchInput: {
    flex: 1,
    padding: Platform.OS === "web" ? 8 : 12,
    fontSize: 14,
    fontFamily: "BarlowRegular",
    backgroundColor: "#f8f9fa",
    borderRadius: 20,
    marginRight: 8,
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
    borderBottomColor: "rgba(0,0,0,0.05)",
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
    color: "#1a1a1a",
  },

  timeText: {
    fontSize: 12,
    color: "#999999",
    marginLeft: 8,
  },

  swipeable: {
    width: "100%",
  },
});
