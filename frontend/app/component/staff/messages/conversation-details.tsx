import { StyleSheet, Text, View } from "react-native";
import React, { useEffect, useMemo } from "react";

import { ConversationDetailsProps } from "@/app/types/staff/messages";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useLocalSearchParams } from "expo-router";
import { useMessageContext } from "@/app/context/staff/staffMessageProvider";

const ConversationComponent = ({
  props,
}: {
  props: ConversationDetailsProps;
}) => {
  const { handlePress, handleModalVisibility } = useMessageContext();

  const text = useThemeColor({}, "text");
  const innerBackground = useThemeColor({}, "innerBackground");

  /**
   * Get the local search params.
   * Use the search params to trigger a useEffect hook that toggles the modal visibility.
   * The id and name is used by the context to retrieve the conversation details.
   */
  const { id: paramId, name: paramName }: { id: string; name: string } =
    useLocalSearchParams();

  const id = paramId || props.id;
  const name = paramName || props.name;

  useEffect(() => {
    if (id && name) {
      handlePress(id, name);
      handleModalVisibility();
    }
  }, [id, name]);

  /**
   * Determine the available id and name between the local search params and the props.
   *
   */
  return (
    <TouchableOpacity
      style={[styles.maincontianer, { backgroundColor: innerBackground }]}
      onPress={() => {
        handlePress(props.id, props.name);
      }}
    >
      <View style={styles.container}>
        <Text style={[styles.name, { color: text }]}>{props.name}</Text>
        <Text style={[styles.name, { color: text, fontSize: 10, padding: 5 }]}>
          {props.lastMessage}
        </Text>
      </View>
      <View style={styles.container}>
        <Text style={styles.timeText}>{props.time}</Text>
      </View>
    </TouchableOpacity>
  );
};

export default ConversationComponent;

const styles = StyleSheet.create({
  maincontianer: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginVertical: 1,
    padding: 5,
  },

  container: {
    padding: 5,
  },

  name: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "RobotoREgular",
    textTransform: "capitalize",
  },

  timeText: {
    fontSize: 11,
    fontWeight: "600",
    fontFamily: "BarlowLight",
    textTransform: "lowercase",
    color: "gray",
  },
});
