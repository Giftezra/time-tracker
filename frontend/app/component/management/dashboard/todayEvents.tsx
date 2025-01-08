import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

const TodayEventsComponent = ({ event }: { event: string[] }) => {
  const [eventTotal, setEventTotal] = useState(0);
  const [firstEvent, setFirstEvent] = useState("");

  const background = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");

  useEffect(() => {
    const calcEvents = () => {
      if (event.length > 1) {
        setEventTotal(event.length);
        return event[0];
      } else {
        setEventTotal(event.length);
        return event[0];
      }
    };

    setFirstEvent(calcEvents());
  }, [event]);

  return (
    <View style={[styles.mainContainer, { backgroundColor: background }]}>
      <View style={styles.container}>
        <Text
          style={[
            {
              fontSize: 14,
              fontWeight: "600",
              fontFamily: "BarlowLight",
              textTransform: "uppercase",
            },
            { color: text },
          ]}
        >
          Today events
        </Text>

        <Text
          style={[{ fontSize: 12, fontFamily: "BarlowLight" }, { color: text }]}
        >
          {firstEvent}{" "}
          <Text>{`and ${eventTotal} event${eventTotal > 1 ? "s" : ""}`}</Text>
        </Text>
      </View>

      <Pressable
        style={{
          alignItems: "center",
        }}
      >
        <AntDesign name="right" size={15} color={text} />
      </Pressable>
    </View>
  );
};

export default TodayEventsComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    borderWidth: 0.3,
    shadowRadius: 5,
    elevation: 5,
    shadowOpacity: 0.5,
    width: "100%",
    marginVertical: 5,
  },

  container: {
    flex: 1,
    justifyContent: "center",
    paddingHorizontal: 10,
  },
});
