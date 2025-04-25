import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { EventItem } from "@/app/types/management/dashboard";

// Update the props type to accept array of EventItem
const TodayEventsComponent = ({ event }: { event: EventItem[] }) => {
  const [eventTotal, setEventTotal] = useState(0);
  const [firstEvent, setFirstEvent] = useState("");
  const text = useThemeColor({}, "text");

  useEffect(() => {
    const calcEvents = () => {
      if (event.length > 1) {
        setEventTotal(event.length - 1);
        return event[0].name; // Access the name property
      } else if (event.length === 1) {
        setEventTotal(0);
        return event[0].name; // Access the name property
      } else {
        setEventTotal(0);
        return "No events for today";
      }
    };

    setFirstEvent(calcEvents());
  }, [event]);

  return (
    <View style={[styles.mainContainer]}>
      <View style={styles.container}>
        <Text style={[styles.titleText, { color: text }]}>
          Employees birthday
        </Text>

        <Text style={[styles.contentText, { color: text }]}>
          <Text style={styles.contentText}>{firstEvent}</Text>
          {eventTotal > 0 && (
            <Text style={styles.contentText}>{` and ${eventTotal} other${
              eventTotal > 1 ? "s" : ""
            }`}</Text>
          )}
        </Text>
      </View>

      <Pressable style={styles.arrowContainer}>
        <AntDesign name="right" size={14} color={text} />
      </Pressable>
    </View>
  );
};

export default TodayEventsComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 12,
    alignItems: "center",
    borderRadius: 12,
    borderWidth: 0.3,
    width: "100%",
    marginVertical: 8,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 16,
  },
  titleText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "BarlowLight",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.8,
    opacity: 0.8,
  },
  contentText: {
    fontSize: 15,
    fontFamily: "BarlowLight",
    lineHeight: 20,
    textTransform: "capitalize",
  },
  arrowContainer: {
    padding: 8,
    alignItems: "center",
    justifyContent: "center",
  },
});
