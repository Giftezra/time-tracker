/**
 * The Component is designed to handle the display of the event details.
 * the details are mostly used with the Agenda component to display events occuring on a particular day.
 *
 * @param props - The props passed to the component
 * @param onPress - The function to be called when the component is pressed.
 * @returns - The EventDisplay component
 */

import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React from "react";
import { EventDisplayInterface } from "@/app/types/staff/eventType";
import { useThemeColor } from "@/hooks/useThemeColor";

const EventDisplay = ({ props }: { props: EventDisplayInterface }) => {
  /**
   * Use the hook to get the current theme , setting the colors based on the theme.
   */
  const text = useThemeColor({}, "text");
  const highlight = useThemeColor({}, "highlight");
  const otherText = useThemeColor({}, "otherText");
  const innerBackground = useThemeColor({}, "innerBackground");

  return (
    <View style={[styles.mainContainer, { backgroundColor: innerBackground }]}>
      <Text style={[styles.siteName, { color: text }]}>{props.site_name}</Text>
      {/* Start details */}
      <View style={styles.timeContainer}>
        <View style={styles.innertimeContainer}>
          <Text style={[styles.text, { color: highlight }]}>start time</Text>
          <Text style={[styles.text, { color: otherText }]}>
            {props.start_time}
          </Text>
        </View>
        <View style={styles.innertimeContainer}>
          <Text style={[styles.text, { color: highlight }]}>end time</Text>
          <Text style={[styles.text, { color: otherText }]}>
            {props.end_time}
          </Text>
        </View>
      </View>
      <View style={styles.container}>
        <Text style={[styles.text, { color: text }]}>{props.information}</Text>
      </View>
      <View style={styles.container}>
        <Text style={[styles.text, { color: text }]}>{props.site_address}</Text>
        <Text style={[styles.text, { color: text }]}>
          {props.site_postcode}
        </Text>
      </View>
    </View>
  );
};

export default EventDisplay;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    padding: 5,
    borderRadius: 5,
    shadowOffset: { width: 1, height: 3 },
  },

  container: {
    padding: 5,
    width: "100%",
  },

  timeContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },

  siteName: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    padding: 2,
  },

  text: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },

  innertimeContainer: {
    rowGap: 5,
    padding: 5,
  },
});
