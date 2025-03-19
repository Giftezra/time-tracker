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
          <Text style={[styles.siteNameText, { color: text }]}>
            {props.site_address}
          </Text>
        </View>
        <Text style={[styles.text, { color: text }]}>
          {props.start_time} - {props.end_time}
        </Text>
        <Text style={[styles.text, { color: text }]}>{props.start_date}</Text>
      </View>

      <Pressable
        onPress={onPress}
        style={[styles.viewSiteButton, { shadowColor: background }]}
      >
        <MaterialIcons name="arrow-right-alt" size={20} color={icons} />
        <Text style={[styles.viewmoreText, { color: otherText }]}>
          view more
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
    padding: 10,
    borderRadius: 5,
    marginVertical: 2,
    marginHorizontal: 5,
  },

  detailsContainer: {
    flexDirection: "column",
    flexGrow: 1,
    padding: 2,
    marginStart: 5,
  },

  viewSiteButton: {
    padding: 5,
    borderRadius: 10,
    borderWidth: 0.3,
    alignItems: "center",
    elevation: 5,
    shadowRadius: 5,
    shadowOpacity: 0.7,
  },

  siteNameText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },

  text: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "lowercase",
  },

  viewmoreText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },
  innerContainer: {
    padding: 2,
    rowGap: 2,
    marginBottom: 5,
  },
});
