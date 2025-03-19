import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useState, useEffect } from "react";
import { AntDesign } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { EventItem } from "@/app/types/management/dashboard";

// Update the props type to accept array of EventItem
const TodayEventsComponent = ({ event }: { event: EventItem[] }) => {
  const [eventTotal, setEventTotal] = useState(0);
  const [firstEvent, setFirstEvent] = useState("");

  const background = useThemeColor({}, "innerBackground");
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
    <View style={[styles.mainContainer, { backgroundColor: background }]}>
      <View style={styles.container}>
        <Text style={[styles.titleText, { color: text }]}>
          Employees birthday
        </Text>

        <Text style={[styles.contentText, { color: text }]}>
          <Text style = {styles.contentText}>{firstEvent}</Text>
          {eventTotal > 0 && (
            <Text style = {styles.contentText}>{` and ${eventTotal} other${
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
    padding: 16,
    alignItems: "center",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(0, 0, 0, 0.1)",
    width: "100%",
    marginVertical: 8,
    // Subtle shadow for light elevation
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  container: {
    flex: 1,
    justifyContent: "center",
    paddingRight: 16,
  },
  titleText: {
    fontSize: 13,
    fontWeight: "600",
    fontFamily: "BarlowLight",
    textTransform: "uppercase",
    marginBottom: 4,
    letterSpacing: 0.5,
  },
  contentText: {
    fontSize: 14,
    fontFamily: "BarlowLight",
    lineHeight: 20,
    textTransform: "capitalize",
  },
  arrowContainer: {
    padding: 4,
    alignItems: "center",
    justifyContent: "center",
  },
});
