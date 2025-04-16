import { StyleSheet, Text, View, FlatList } from "react-native";
import React from "react";
import NotificationComponent from "../../../component/management/notifications/notification";
import { useNotifications } from "../../../context/management/notifications/notificationContext";

const ManagementNotification = () => {
  const { notifications } = useNotifications();

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Notifications</Text>
      <FlatList
        data={notifications}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <NotificationComponent notification={item} />}
        contentContainerStyle={styles.listContainer}
      />
    </View>
  );
};

export default ManagementNotification;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    padding: 16,
    color: "#333333",
  },
  listContainer: {
    paddingBottom: 16,
  },
});
