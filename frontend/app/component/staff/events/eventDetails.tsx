/**
 * This component is used to display the details of the event a staff member is assigned to
 */
import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { EventProps } from "@/app/types/staff/eventType";
import PopupButton from "@/app/component/helper/popupButton";

const EventDetailsComponent = ({ props }: { props: EventProps }) => {
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "innerBackground");
  const activebtn = useThemeColor({}, "activebtn");
  const inactivebtn = useThemeColor({}, "inactivebtn");

  return (
    <View style={[styles.mainContainer, { backgroundColor: background }]}>
      <Text style={styles.headerText}>Shift details</Text>
      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>client</Text>
        <Text style={[styles.text, { color: text }]}>{props.client}</Text>
      </View>
      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>site</Text>
        <Text style={[styles.text, { color: text }]}>{props.site_name}</Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>department</Text>
        <Text style={[styles.text, { color: text }]}>{props.department}</Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>adress</Text>
        <Text style={[styles.text, { color: text }]}>{props.site_address}</Text>
        <Text style={[styles.text, { color: text }]}>
          {props.site_postcode}
        </Text>
      </View>

      {/* Contains the start and end time. displays in row */}
      <View style={styles.rowContainer}>
        <View>
          <Text style={[styles.headerText, { color: text }]}>Start Time</Text>
          <Text style={[styles.text, { color: text }]}>{props.start_time}</Text>
        </View>
        <View>
          <Text style={[styles.headerText, { color: text }]}>End Time</Text>
          <Text style={[styles.text, { color: text }]}>{props.end_time}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>Information</Text>
        <Text style={[styles.text, { color: text }]}>{props.information}</Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>Pay</Text>
        <Text style={[styles.text, { color: text }]}>{props.paylevel}</Text>
        <Text style={[styles.text, { color: text }]}>{props.pay}</Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>Colleagues</Text>
        {props.colleague.map((colleague, index) => (
          <Pressable
            key={index}
            style={[styles.colleagueButtons, { backgroundColor: inactivebtn }]}
            /**
             * Call the handlePress function to set the colleague id and name. this will set the details in the context.
             */
          >
            <Text style={[styles.text, { color: text }]}>{colleague.name}</Text>
          </Pressable>
        ))}
      </View>

      <View style={styles.rowContainer}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: activebtn }]}
        >
          <Text style={styles.buttonText}>confirm</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: activebtn }]}
        >
          <Text style={styles.buttonText}>cancel</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default EventDetailsComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    width: "100%",
    elevation: 5,
    shadowRadius: 5,
    shadowOpacity: 0.5,
    padding: 5,
  },

  container: {
    padding: 5,
    width: "100%",
  },

  text: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },

  headerText: {
    fontSize: 14,
    fontWeight: "bold",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },

  rowContainer: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  button: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    shadowRadius: 5,
    elevation: 5,
    shadowOpacity: 0.5,
    marginHorizontal: 10,
    borderRadius: 20,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },

  colleagueButtons: {
    padding: 5,
    elevation: 5,
    shadowRadius: 5,
    borderWidth: 1,
    marginVertical: 1,
    borderRadius: 20,
  },
});
