import { StyleSheet, Text, View } from "react-native";
import React from "react";

const TaskDetailsContainerComponent = ({
  title,
  data,
}: {
  title: string;
  data: string;
}) => {
  return (
    <View style={styles.maincontainer}>
      <Text style={styles.titleText}>{title}</Text>
      <Text style={styles.dataText}>{data}</Text>
    </View>
  );
};

export default TaskDetailsContainerComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: "column",
    padding: 5,
    alignItems: "center",
    justifyContent: "center",
  },

  titleText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    marginStart: 5,
    marginBottom: 5,
  },

  dataText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
});
