import { Pressable, StyleSheet, Text, TextInput, View } from "react-native";
import React, { useState } from "react";
import { MessageComponentProps } from "@/app/types/staff/messages";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

const MessageComponent = ({ props }: { props: MessageComponentProps }) => {
  const background = useThemeColor({}, "primaryColor");
  const inputContainer = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");

  return (
    <View style={[styles.container, { backgroundColor: background }]}>
      {/* Contains the message header */}
      <View style={styles.header}>
        <Text style={styles.headerText}>{props.name}</Text>
        <Pressable>
          <MaterialCommunityIcons
            name="dots-vertical"
            size={24}
            color="black"
          />
        </Pressable>
      </View>

      {/* Contains the message body */}
      <View style={styles.messagebody}></View>

      <View
        style={[styles.inputContainer, { backgroundColor: inputContainer }]}
      >
        <TextInput
          placeholder="enter message"
          style={[styles.input, { color: text }]}
          multiline={true}
          numberOfLines={2}
          inputMode="text"
        />
        <Pressable style={styles.sendButton}>
          <MaterialIcons name="send" size={24} color="black" />
        </Pressable>
      </View>
    </View>
  );
};

export default MessageComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    width: "100%",
  },

  header: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  messagebody: {
    width: "100%",
    flex: 1,
    padding: 5,
  },

  inputContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 20,
    elevation: 5,
    shadowRadius: 5,
    marginVertical: 10,
  },

  input: {
    flexGrow: 1,
    padding: 8,
    fontFamily: "RobotoRegular",
    fontSize: 16,
    fontWeight: "500",
  },

  sendButton: {
    padding: 5,
  },

  headerText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },
});
