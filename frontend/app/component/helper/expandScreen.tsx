import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { userData } from "@/app/utils/loadData";

const ExpandScreenComponent = () => {
  const user = userData();
  return (
    <View
      style={{
        flex: 1,
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <View
        style={{
          padding: 10,
        }}
      >
        <Text
          style={{
            fontSize: 20,
            fontFamily: "OswaldVariable",
            fontWeight: "500",
          }}
        >
          hello {user?.first_name} to enjoy the best expierience on time trackr,
          you need to expoand your screen
        </Text>
      </View>
    </View>
  );
};

export default ExpandScreenComponent;

const styles = StyleSheet.create({});
