import { Image, Pressable, StyleSheet, Text, View } from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

const image = require("@/assets/images/user image.jpg");

const LeaderBoardCardComponent = ({
  name,
  role,
  totalTasks,
}: {
  name: string;
  role: string;
  totalTasks: number;
}) => {
    const text = useThemeColor({}, "text");
    const othertext = useThemeColor({}, "otherText");
    const innerBackground = useThemeColor({}, "innerBackground");

  return (
    <View style={[styles.maincontainer, { backgroundColor: innerBackground }]}>
      <View style={styles.innercontainera}>
        <Image
          source={image}
          style={{ width: 40, height: 40, borderRadius: 40 }}
        />
        <Text style={[styles.nameText, { color: text }]}>{name}</Text>
        <Text style={[styles.text, { color: othertext }]}>{role}</Text>
      </View>

      <View style={styles.innercontainera}>
        <Text style={[styles.taskText, { color: text }]}>{totalTasks}</Text>
        <Text
          style={[styles.taskText, { textTransform: "lowercase", color: text }]}
        >
          tasks completed
        </Text>
      </View>

      <View style={styles.rowContainer}>
        <Pressable style={styles.buttons}>
          <Text style={[styles.buttonText, { color: othertext }]}>profile</Text>
        </Pressable>

        <View>|</View>

        <Pressable style={styles.buttons}>
          <Text style={[styles.buttonText, { color: othertext }]}>message</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default LeaderBoardCardComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 5,
    elevation: 5,
    shadowRadius: 5,
    borderRadius: 5,
    shadowOpacity: 0.5,
    marginHorizontal: 5,
    marginVertical: 5,
  },

  nameText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    textShadowOffset: { width: 0.2, height: 0.3 },
  },

  text: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    textShadowOffset: { width: 0.2, height: 0.3 },
  },

  rowContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },

  innercontainera: {
    flexDirection: "column",
    alignItems: "center",
    padding: 2,
  },

  buttons: {
    flex: 1,
    padding: 5,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 13,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    fontWeight: "400",
  },

  taskText: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    fontWeight: "400",
  },
});
