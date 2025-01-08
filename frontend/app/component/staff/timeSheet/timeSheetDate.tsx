import { StyleSheet, Text, View } from "react-native";
import React from "react";

const TimeSheetDatecomponent = ({
  month,
  day,
}: {
  month: string;
  day: number;
}) => {
  return (
    <View style={styles.maincontainer}>
      <Text>{month}</Text>
      <Text>{day}</Text>
    </View>
  );
};

export default TimeSheetDatecomponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: "column",
    padding: 2,
    alignItems: "center",
    justifyContent: "center",
    alignContent: "center",
  },
});
