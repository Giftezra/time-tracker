import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { LiveEventInterface } from "@/app/types/staff/eventType";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useSideComponentContext } from "@/app/context/staff/sideComponentProvider";

const LiveEventComponent = () => {
  const { events } = useSideComponentContext();

  /**
   * Set the colors for the component based on the user mobile theme.
   * Use the `useThemeColor` hook with no parameters to get the theme colors.
   * This sets the color based on the users theme
   */
  const backgroundColor = useThemeColor({}, "background");
  const primaryColor = useThemeColor({}, "primaryColor");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const text = useThemeColor({}, "text");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const whiteBackground = useThemeColor({}, "whiteBackground");
  const highlight = useThemeColor({}, "highlight");
  const icon = useThemeColor({}, "icon");
  const innerBackground = useThemeColor({}, "innerBackground");

  return (
    <View style={[styles.mainContainer, { backgroundColor: innerBackground }]}>
      <View
        style={[styles.rowContainers, { borderBottomWidth: 0.3, padding: 10 }]}
      >
        {/* Calender*/}
        <View
          style={[
            styles.calenderContainer,
            { backgroundColor: whiteBackground },
          ]}
        >
          <Text
            style={[
              styles.calenderText,
              { backgroundColor: highlight, color: text },
            ]}
          >
            {events.month}
          </Text>
          <Text style={styles.calenderText}>{events.date}</Text>
        </View>

        {/* Event */}
        <View style={[styles.rowContainers, { flex: 1 }]}>
          <View>
            <Text style={[styles.eventText, { color: text }]}>live event</Text>
            <Text
              style={{
                padding: 5,
                fontSize: 16,
                fontFamily: "RobotoRegular",
                color: text,
                textTransform: "uppercase",
              }}
            >
              {events.event}
            </Text>
          </View>

          {/* Icon */}
          <View
            style={[styles.iconContainer, { backgroundColor: primaryColor }]}
          >
            <MaterialIcons
              name="open-in-full"
              size={20}
              style={{ color: icon }}
            />
          </View>
        </View>
      </View>

      {/*  */}
      <View>
        <View style={styles.rowContainers}>
          {/* Event start and end time */}
          <View>
            <Text style={[styles.eventTimeText, { color: text }]}>
              {events.start_time}
            </Text>
            <Text style={[styles.eventText, { color: text }]}>am</Text>
          </View>
          <View>
            <Text style={[styles.eventTimeText, { color: text }]}>
              {events.start_time}
            </Text>
            <Text style={[styles.eventText, { color: text }]}>pm</Text>
          </View>
        </View>

        {/* Team members */}
        <View>
          {/* Map the employees on the same task */}
          <TouchableOpacity
            style={[
              styles.myTeamMembercontainer,
              { backgroundColor: primaryColor },
            ]}
          >
            <Text style={[styles.myteamMembesText, { color: text }]}>
              team members
            </Text>
            <Text style={[styles.myteamMembesText, { color: text }]}>
              {events.team_member.length}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Button */}
      <View style={styles.rowContainers}>
        <TouchableOpacity
          style={[styles.buttons, { backgroundColor: inactivebtn }]}
        >
          <Text
            style={[styles.buttonText, { textShadowRadius: 5, color: text }]}
          >
            start
          </Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.buttons, { backgroundColor: inactivebtn }]}
        >
          <Text
            style={[styles.buttonText, { textShadowRadius: 5, color: text }]}
          >
            end
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default LiveEventComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    justifyContent: "space-between",
    padding: 5,
    borderRadius: 30,
    shadowRadius: 10,
    elevation: 10,
  },

  rowContainers: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },

  calenderContainer: {
    borderRadius: 10,
    marginTop: 10,
  },

  calenderText: {
    minWidth: 70,
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "uppercase",
    padding: 5,
    textAlign: "center",
  },

  eventText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    padding: 5,
  },

  eventContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
  },

  iconContainer: {
    borderRadius: 50,
    padding: 5,
    alignItems: "center",
    shadowRadius: 5,
    elevation: 5,
  },

  eventTimeText: {
    fontSize: 25,
    fontWeight: "bold",
    fontFamily: "RobotoRegular",
    textTransform: "uppercase",
    padding: 2,
  },

  myteamMembesText: {
    fontSize: 17,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
  },

  myTeamMembercontainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    padding: 10,
    borderRadius: 10,
    maxWidth: 200,
    marginTop: 10,
    elevation: 5,
    shadowRadius: 5,
    shadowOpacity: 0.5,
  },

  buttons: {
    padding: 10,
    borderRadius: 30,
    margin: 5,
    flex: 1,
    marginHorizontal: 10,
    alignItems: "center",
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.6,
  },

  buttonText: {
    fontSize: 15,
    fontWeight: "400",
    fontFamily: "OswaldRegular",
    textTransform: "uppercase",
    textShadowRadius: 5,
  },
});
