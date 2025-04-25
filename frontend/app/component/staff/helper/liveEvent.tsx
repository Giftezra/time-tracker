import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useSideComponentContext } from "@/app/context/staff/sideComponentProvider";

const LiveEventComponent = () => {
  const {
    event,
    currentDate,
    fetchUpcomingShifts,
    handleNextShift,
    handlePreviousShift,
    handleStartShift,
    handleEndShift,
  } = useSideComponentContext();

  const [isStarting, setIsStarting] = useState(false);
  const [isEnding, setIsEnding] = useState(false);

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
  const [currentTime, setCurrentTime] = useState("");

  /* Start the timer when the shift starts */
  useEffect(() => {
    if (event.status === "started" && event.start_time) {
      const timer = setInterval(() => {
        const now = new Date();
        const hours = now.getHours().toString().padStart(2, "0");
        const minutes = now.getMinutes().toString().padStart(2, "0");
        setCurrentTime(`${hours}:${minutes}`);
      }, 1000);

      return () => clearInterval(timer);
    }
  }, [event.status]);

  // Format the time to HH:mm
  const formatTime = (timeString: string) => {
    if (!timeString) return "";
    const [hours, minutes] = timeString.split(":");
    return `${hours}:${minutes}`;
  };

  /* Handle the start shift button press by calling the start shift api and then updating the shifts states by calling the fetchUpcomingShifts function */
  const handleStartPress = async () => {
    if (!event.shift_id) return;
    setIsStarting(true);
    try {
      await handleStartShift(event.shift_id);
      await fetchUpcomingShifts(); // Refresh the shifts after starting
    } catch (error) {
      console.error("Error starting shift:", error);
    } finally {
      setIsStarting(false);
    }
  };

  /* End the shift by calling the end shift api and then updating the shifts states by calling the fetchUpcomingShifts function */
  const handleEndPress = async () => {
    if (!event.shift_id) return;
    setIsEnding(true);
    try {
      await handleEndShift(event.shift_id);
      await fetchUpcomingShifts(); // Refresh the shifts after ending
    } catch (error) {
      console.error("Error ending shift:", error);
    } finally {
      setIsEnding(false);
    }
  };

  return (
    <View style={[styles.mainContainer, { backgroundColor: innerBackground }]}>
      <View style={styles.navigateContainer}>
        <Pressable
          onPress={handlePreviousShift}
          style={[styles.navigateButton, { backgroundColor: primaryColor }]}
        >
          <Text style={[styles.navigateBtnText, { color: text }]}>Now</Text>
        </Pressable>
        <Pressable
          onPress={handleNextShift}
          style={[styles.navigateButton, { backgroundColor: primaryColor }]}
        >
          <Text style={[styles.navigateBtnText, { color: text }]}>Later</Text>
        </Pressable>
      </View>

      <Pressable
        style={[styles.refreshButton, { backgroundColor: primaryColor }]}
        onPress={fetchUpcomingShifts}
      >
        <Text style={[styles.refreshBtnText, { color: text }]}>Refresh</Text>
      </Pressable>

      <View style={[styles.eventHeader, { borderBottomColor: secondaryColor }]}>
        <View
          style={[
            styles.calenderContainer,
            { backgroundColor: whiteBackground },
          ]}
        >
          <Text
            style={[
              styles.calenderMonth,
              { backgroundColor: highlight, color: text },
            ]}
          >
            {currentDate.month}
          </Text>
          <Text style={[styles.calenderDay]}>{currentDate.day}</Text>
        </View>

        <View style={styles.eventTitleContainer}>
          <View>
            <TouchableOpacity
              style={[styles.nowIndicator, { borderBottomColor: primaryColor }]}
            >
              <Text style={[styles.eventText, { color: text }]}>now</Text>
            </TouchableOpacity>
            <Text style={[styles.contractName, { color: text }]}>
              {event.contract_name || "No contract name"}
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.eventDetails}>
        <View style={styles.timeContainer}>
          <View style={styles.timeBlock}>
            <Text style={[styles.eventTimeText, { color: text }]}>
              {event.status === "started"
                ? currentTime
                : formatTime(event.start_time || "")}
            </Text>
            {/* Display the time period if the start and end time are available */}
            {event.start_time && (
              <Text style={[styles.timePeriod, { color: secondaryColor }]}>
                {parseInt(event.start_time?.split(":")[0] || "0") >= 12
                  ? "pm"
                  : "am"}
              </Text>
            )}
          </View>
          <View style={styles.timeBlock}>
            <Text style={[styles.eventTimeText, { color: text }]}>
              {formatTime(event.end_time || "")}
            </Text>
            {/* Display the time period if the start and end time are available */}
            {event.end_time && (
              <Text style={[styles.timePeriod, { color: secondaryColor }]}>
                {parseInt(event.end_time?.split(":")[0] || "0") >= 12
                  ? "pm"
                  : "am"}
              </Text>
            )}
          </View>
        </View>

        {/* Display the team members if the event has team members */}
        {event.team_member.length > 0 && (
          <TouchableOpacity
            style={[
              styles.teamMemberContainer,
              { backgroundColor: primaryColor },
            ]}
          >
            <Text style={[styles.teamMemberText, { color: text }]}>
              team members
            </Text>
            <Text style={[styles.teamMemberCount, { color: text }]}>
              {event.team_member.length}
            </Text>
          </TouchableOpacity>
        )}
      </View>

      <View style={styles.buttonContainer}>
        {/* Display the start shift button if the shift is not started */}
        {event.status !== "started" && (
          <TouchableOpacity
            onPress={handleStartPress}
            disabled={
              isStarting || !event.shift_id || event.status === "started"
            }
            style={[
              styles.actionButton,
              {
                backgroundColor:
                  event.status === "started" ? secondaryColor : inactivebtn,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: text }]}>
              {isStarting
                ? "Starting..."
                : event.status === "started"
                ? "Started"
                : "start"}
            </Text>
          </TouchableOpacity>
        )}

        {/* Display the end shift button if the shift is started */}
        {event.status === "started" && (
          <TouchableOpacity
            onPress={handleEndPress}
            disabled={isEnding || !event.shift_id || event.status !== "started"}
            style={[
              styles.actionButton,
              {
                backgroundColor:
                  event.status !== "started" ? secondaryColor : inactivebtn,
              },
            ]}
          >
            <Text style={[styles.buttonText, { color: text }]}>
              {isEnding
                ? "Ending..."
                : event.status !== "started"
                ? "Ended"
                : "end"}
            </Text>
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default LiveEventComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 12,
    borderRadius: 10,
    gap: 15,
  },
  navigateContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
  },
  navigateButton: {
    paddingVertical: 8,
    paddingHorizontal: 15,
    borderRadius: 20,
    elevation: 2,
  },
  navigateBtnText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
  eventHeader: {
    flexDirection: "row",
    borderBottomWidth: 1,
    paddingBottom: 15,
    gap: 15,
  },
  calenderContainer: {
    borderRadius: 10,
    overflow: "hidden",
    elevation: 2,
  },
  calenderMonth: {
    width: 65,
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "uppercase",
    padding: 5,
    textAlign: "center",
  },
  calenderDay: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    padding: 5,
  },
  eventTitleContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "flex-start",
  },
  nowIndicator: {
    borderBottomWidth: 2,
    alignSelf: "flex-start",
  },
  contractName: {
    fontSize: 16,
    fontFamily: "RobotoRegular",
    textTransform: "uppercase",
    marginTop: 8,
  },
  refreshButton: {
    borderRadius: 10,
    padding: 8,
    elevation: 3,
  },
  refreshBtnText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    textAlign: "center",
  },
  eventDetails: {
    gap: 15,
  },
  timeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 10,
  },
  timeBlock: {
    alignItems: "center",
  },
  eventTimeText: {
    fontSize: 28,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "uppercase",
  },
  timePeriod: {
    fontSize: 14,
    fontFamily: "RobotoRegular",
    textTransform: "uppercase",
  },
  teamMemberContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    elevation: 2,
  },
  teamMemberText: {
    fontSize: 16,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
  teamMemberCount: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 10,
    marginTop: 5,
  },
  actionButton: {
    flex: 1,
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    elevation: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "OswaldRegular",
    textTransform: "capitalize",
  },
  eventText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    padding: 5,
  },
});
