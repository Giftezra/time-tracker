import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import NotificationDetailsComponent from "@/app/component/staff/notification/notification";
import { useNotificationContext } from "@/app/context/management/notificationProvider";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";

/**
 * The main notification component enables the staff to view all of ther notifitcations in on place. When the use clicks the
 * @returns
 */

const MainStaffNotificationComponent = () => {
  const { notifications, handleReadPress, handleUnreadPress, handleAllPress } =
    useNotificationContext();

  return (
    <SafeAreaProvider style={styles.container}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Notifications</Text>
          <Pressable style={styles.clearButton} onPress={handleAllPress}>
            <Text style={styles.clearText}>Clear all</Text>
          </Pressable>
        </View>

        <View style={styles.filterContainer}>
          <Pressable style={styles.filterButton} onPress={handleAllPress}>
            <Text style={styles.filterButtonText}>All</Text>
          </Pressable>
          <Pressable style={styles.filterButton} onPress={handleReadPress}>
            <Text style={styles.filterButtonText}>Read</Text>
          </Pressable>
          <Pressable style={styles.filterButton} onPress={handleUnreadPress}>
            <Text style={styles.filterButtonText}>Unread</Text>
          </Pressable>
        </View>

        <FlatList
          data={notifications}
          renderItem={({ item }) => <NotificationDetailsComponent {...item} />}
          keyExtractor={(item) => item.id.toString()}
          contentContainerStyle={styles.listContainer}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default MainStaffNotificationComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f8f9fa",
  },
  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  headerText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "RobotoRegular",
    color: "#1a1a1a",
  },
  clearButton: {
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 16,
    backgroundColor: "#f8f9fa",
  },
  clearText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    color: "#dc3545",
  },
  filterContainer: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    backgroundColor: "#fff",
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
  },
  filterButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 20,
    backgroundColor: "#f8f9fa",
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  filterButtonText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    color: "#4a4a4a",
  },
  listContainer: {
    paddingVertical: 8,
  },
});
