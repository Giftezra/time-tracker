import { StyleSheet, Text, View, TouchableOpacity } from "react-native";
import React from "react";
import { NotificationItem } from "../../../types/management/notification";
import { useNotifications } from "../../../context/management/notifications/notificationContext";

interface NotificationComponentProps {
  notification: NotificationItem;
}

const NotificationComponent = ({
  notification,
}: NotificationComponentProps) => {
  const { markAsRead } = useNotifications();

  // Format the timestamp
  const formatTime = (date: Date) => {
    return new Date(date).toLocaleString();
  };

  // Get color based on notification type
  const getTypeColor = (type: NotificationItem["type"]) => {
    switch (type) {
      case "shift":
        return "#4CAF50";
      case "billing":
        return "#F44336";
      case "system":
        return "#2196F3";
      case "alert":
        return "#FF9800";
      default:
        return "#757575";
    }
  };

  return (
    <TouchableOpacity
      style={[styles.container, notification.isRead && styles.readContainer]}
      onPress={() => markAsRead(notification.id)}
    >
      <View style={styles.header}>
        <View
          style={[
            styles.typeDot,
            { backgroundColor: getTypeColor(notification.type) },
          ]}
        />
        <Text style={styles.title}>{notification.title}</Text>
        <Text style={styles.timestamp}>
          {formatTime(notification.timestamp)}
        </Text>
      </View>
      <Text style={styles.message}>{notification.message}</Text>
    </TouchableOpacity>
  );
};

export default NotificationComponent;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 5,
    marginVertical: 4,
    marginHorizontal: 16,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  readContainer: {
    opacity: 0.7,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 8,
  },
  typeDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 8,
  },
  title: {
    flex: 1,
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    color: "#333333",
  },
  timestamp: {
    fontSize: 12,
    color: "#757575",
  },
  message: {
    fontSize: 14,
    fontFamily: "BarlowLight",
    fontWeight: "500",
    textTransform: "lowercase",
    lineHeight: 20,
  },
});
