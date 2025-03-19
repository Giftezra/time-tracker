import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { NotificationType } from "@/app/types/staff/notifications";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNotificationContext } from "@/app/context/management/notificationProvider";

const NotificationDetailsComponent: React.FC<NotificationType> = (props) => {
  const { toggleReadStatus } = useNotificationContext();
  const highlight = useThemeColor({}, "highlight");

  return (
    <Pressable
      onPress={() => toggleReadStatus(props.id)}
      style={[
        styles.maincontainer,
        props.isRead
          ? { backgroundColor: "#f8f9fa" }
          : {
              backgroundColor: "#fff",
              borderLeftColor: highlight,
              borderLeftWidth: 4,
            },
      ]}
    >
      <View style={styles.contentContainer}>
        <View style={styles.headerRow}>
          <Text style={styles.title}>{props.title}</Text>
          <Text style={styles.timeText}>{props.time}</Text>
        </View>
        <Text style={styles.detailsText}>{props.description}</Text>
        <View
          style={[
            styles.buttonContainer,
            props.isRead ? styles.buttonRead : styles.buttonUnread,
          ]}
        >
          <Text
            style={[
              styles.buttonText,
              props.isRead ? styles.buttonTextRead : styles.buttonTextUnread,
            ]}
          >
            {props.isRead ? "Read" : "Mark as read"}
          </Text>
          <MaterialCommunityIcons
            name="check-circle"
            size={16}
            color={props.isRead ? "#6c757d" : highlight}
          />
        </View>
      </View>
    </Pressable>
  );
};

export default NotificationDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    marginVertical: 4,
    marginHorizontal: 12,
    borderRadius: 8,
    elevation: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
  },
  contentContainer: {
    padding: 16,
  },
  headerRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  title: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "#1a1a1a",
  },
  detailsText: {
    fontSize: 14,
    fontFamily: "BarlowLight",
    color: "#4a4a4a",
    marginBottom: 12,
    lineHeight: 20,
  },
  timeText: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    color: "#6c757d",
  },
  buttonContainer: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "flex-start",
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    gap: 6,
  },
  buttonUnread: {
    backgroundColor: "#f8f9fa",
  },
  buttonRead: {
    backgroundColor: "#e9ecef",
  },
  buttonText: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  },
  buttonTextUnread: {
    color: "#1a1a1a",
  },
  buttonTextRead: {
    color: "#6c757d",
  },
});
