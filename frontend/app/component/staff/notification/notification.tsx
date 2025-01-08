import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import { NotificationType } from "@/app/types/staff/notifications";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  AntDesign,
  Ionicons,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import { useNotificationContext } from "@/app/context/staff/notificationProvider";

const NotificationDetailsComponent: React.FC<NotificationType> = (props) => {
  const { toggleReadStatus} = useNotificationContext();

  const highlight = useThemeColor({}, "highlight");

  return (
    <View
      style={[
        styles.maincontainer,
        props.isRead ? { borderColor: "blue" } : { borderColor: highlight },
      ]}
    >
      <Text
        style={[
          styles.title,
          props.isRead ? { color: "blue" } : { color: highlight },
        ]}
      >
        {props.title}
      </Text>
      <Text style={styles.detailsText}>{props.description}</Text>
      <View style={styles.rowContainer}>
        <Text style={styles.timeText}>{props.time}</Text>
        <Pressable style={styles.buttonContainer} onPress={() => toggleReadStatus(props.id)}>
          <Text style={styles.timeText}>
            {props.isRead ? "read" : "mark as read"}
          </Text>
          <MaterialCommunityIcons
            name="check"
            size={15}
            color={props.isRead ? "blue" : highlight}
          />
        </Pressable>
      </View>
    </View>
  );
};

export default NotificationDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    padding: 10,
    marginVertical: 5,
    marginHorizontal: 5,
    flex: 1,
    rowGap: 5,
    borderRadius: 5,
    borderWidth: 0.3,
  },

  title: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  detailsText: {
    fontSize: 16,
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    fontWeight: "400",
  },

  timeText: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    fontWeight: "400",
    textTransform: "capitalize",
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
});
