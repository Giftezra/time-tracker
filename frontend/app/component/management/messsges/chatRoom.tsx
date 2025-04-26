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
  FlatList,
} from "react-native";
import React, { useCallback, useState } from "react";
import {
  ScrollView,
  GestureDetector,
  Gesture,
} from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { user_image } from "@/app/utils/images";
import { useMessageContext } from "@/app/context/management/messages/messageContext";
import { FontAwesome } from "@expo/vector-icons";

const ChatRoomComponent = ({
  onConversationSelect,
  onHandleModalVisibility,
  onDirectMessage,
}: {
  onConversationSelect: (
    chatRoomId: string,
    reciepient: string,
    time: string
  ) => void;
  onHandleModalVisibility: (id: string | null) => void;
  onDirectMessage: (userId: string, userName: string) => void;
}) => {
  const { chatRooms, deleteConversation, connectWebSocket, setActiveChatRoom, fetchChatRooms } =
    useMessageContext();
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const text = useThemeColor({}, "text");
  const textinput = useThemeColor({}, "textinput");
  const [refreshing, setRefreshing] = useState(false);

  /* Trigger the refresh and get the chat history from the server given the user id */
  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    await fetchChatRooms();
    setRefreshing(false);
  }, [fetchChatRooms]);

  /* Swipe to delete the conversation */
  const swipeGesture = Gesture.Pan()
    .activeOffsetX(-20)
    .onEnd((event) => {
      if (event.translationX < -50) {
      }
    });

  /* Return a message when there is no conversation */
  if (chatRooms.length === 0) {
    return (
      <View style={styles.noConversationContainer}>
        <Text style={styles.noConversationText}>
          Click on an employee to start data and start a conversation
        </Text>
        <FontAwesome name="commenting" size={50} color="gray" />
      </View>
    );
  }

  const handleDirectMessagePress = (userId: string, userName: string) => {
    onDirectMessage(userId, userName);
  };

  /* Render the chat room */
  const renderChatRoom = ({ item: chat, index }: { item: any; index: number }) => (
    <GestureDetector gesture={swipeGesture}>
      <Pressable
        style={[styles.messageRow,]}
        onPress={() => {
          onConversationSelect(chat.id, chat.name, chat.time || "");
          onHandleModalVisibility(chat.id);
          connectWebSocket(chat.userId);
          setActiveChatRoom({
            ...chat,
          });
        }}
      >
        <Image source={user_image} style={styles.image} />
        <View style={styles.messageDetailsContainer}>
          <Text style={styles.reciepientText}>{chat.name}</Text>
          {chat.lastMessage && (
            <Text style={styles.text}>{chat.lastMessage.slice(0, 20)}</Text>
          )}
        </View>
        <Text style={styles.timeText}>{chat.time?.split("T")[0]}</Text>
      </Pressable>
    </GestureDetector>
  );

  return (
    <View style={[styles.maincontainer]}>
      <FlatList
        data={chatRooms}
        renderItem={renderChatRoom}
        keyExtractor={(item, index) => item.id || index.toString()}
        style={styles.messageContainer}
        showsVerticalScrollIndicator={false}
        refreshing={refreshing}
        onRefresh={onRefresh}
        ItemSeparatorComponent={() => <View style={{ height: 5, backgroundColor: textinput }} />}
      />
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
    gap: 10,
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

  noConversationContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

  noConversationText: {
    fontSize: 16,
    fontFamily: "RobotoRegular",
    color: "#666666",
    marginBottom: 10,
    letterSpacing: 0.5,
  },
});
