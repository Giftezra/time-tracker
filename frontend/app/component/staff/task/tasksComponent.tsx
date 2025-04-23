import { Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";

import { TaskInterface } from "@/app/types/staff/task";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

const TasksComponent = ({
  props,
  onPress,
}: {
  props: TaskInterface;
  onPress: () => void;
}) => {
  const background = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");
  const icons = useThemeColor({}, "icon");
  const otherText = useThemeColor({}, "otherText");

  return (
    <View style={[styles.mainContainer, { backgroundColor: background }]}>
      <View style={styles.detailsContainer}>
        <View style={styles.innerContainer}>
          <Text style={[styles.siteNameText, { color: otherText }]}>
            {props.site_name}
          </Text>
          <Text style={[styles.addressText, { color: text }]}>
            {props.site_address}
          </Text>
        </View>
        <Text style={[styles.timeText, { color: text }]}>
          {props.start_time} - {props.end_time}
        </Text>
        <Text style={[styles.dateText, { color: text }]}>
          {props.start_date}
        </Text>
      </View>

      <Pressable
        onPress={onPress}
        style={({ pressed }) => [
          styles.viewSiteButton,
          { shadowColor: background, opacity: pressed ? 0.8 : 1 },
        ]}
      >
        <MaterialIcons name="arrow-right-alt" size={24} color={icons} />
        <Text style={[styles.viewmoreText, { color: otherText }]}>
          View More
        </Text>
      </Pressable>
    </View>
  );
};

export default TasksComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderRadius: 12,
    marginVertical: 6,
    marginHorizontal: 8,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },

  detailsContainer: {
    flexDirection: "column",
    flexGrow: 1,
    padding: 4,
    marginStart: 8,
  },

  viewSiteButton: {
    padding: 12,
    borderRadius: 8,
    borderWidth: 0,
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 3,
  },

  siteNameText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    marginBottom: 4,
  },

  addressText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    opacity: 0.9,
  },

  timeText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    marginTop: 6,
  },

  dateText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "RobotoRegular",
    opacity: 0.8,
    marginTop: 2,
  },

  viewmoreText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    marginTop: 4,
  },

  innerContainer: {
    padding: 2,
    rowGap: 2,
    marginBottom: 8,
  },
});
