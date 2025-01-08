import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import NotificationDetailsComponent from "@/app/component/staff/notification/notification";
import { useNotificationContext } from "@/app/context/staff/notificationProvider";
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
  const { notifications, clearAllNotifications, handleReadPress, handleUnreadPress, handleAllPress } = useNotificationContext();

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>Notifications</Text>
          <Pressable onPress={clearAllNotifications}>
            <Text style={styles.clearText}>clear all</Text>
          </Pressable>
        </View>

        <View style={styles.rowContainer}>
          <Pressable style={styles.pressableButtons} onPress={handleAllPress}>
            <Text style={styles.pressableButtonsText}>all</Text>
          </Pressable>
          <Pressable style={styles.pressableButtons} onPress={handleReadPress}>
            <Text style={styles.pressableButtonsText}>read</Text>
          </Pressable>
          <Pressable style={styles.pressableButtons} onPress={handleUnreadPress}>
            <Text style={styles.pressableButtonsText}>unread</Text>
          </Pressable>
        </View>

        <FlatList
          data={notifications}
          renderItem={({ item }) => <NotificationDetailsComponent {...item} />}
          keyExtractor={(item) => item.id.toString()}
        />
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default MainStaffNotificationComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 5,
  },

  headerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    marginVertical: 10,
  },

  headerText: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  clearText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },

  rowContainer: {
    flexDirection: "row",
    columnGap: 10,
    alignItems: "center",
    padding: 10,
  },

  pressableButtons: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 0.3,
    width: 100,
    alignItems: "center",
  },

  pressableButtonsText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  }
});
