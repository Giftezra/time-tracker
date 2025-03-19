/**
 * This component is used to display the details of the event a staff member is assigned to
 */
import {
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Alert,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { EventDetailsInterface } from "@/app/types/staff/event";
import PopupButton from "@/app/component/helper/popupButton";
import { useEventContext } from "@/app/context/staff/staffEventProvider";

const EventDetailsComponent: React.FC<{ props?: EventDetailsInterface }> = ({
  props,
}) => {
  // Import the context for the event details and the functions to accept and decline the shift
  const { acceptShift, declineShift } = useEventContext();
  const [isAccepting, setIsAccepting] = useState(false);
  const [isDeclining, setIsDeclining] = useState(false);
  const text = useThemeColor({}, "text");
  const background = useThemeColor({}, "innerBackground");
  const activebtn = useThemeColor({}, "activebtn");
  const inactivebtn = useThemeColor({}, "inactivebtn");

  /* Handles the acceptance of the shift to give the user a message that confirms acceptance of the shift, or an error message if the shift is not accepted */
  const handleAcceptShift = async () => {
    if (!props?.id) return;
    setIsAccepting(true);
    try {
      await acceptShift(props.id);
    } catch (error) {
      Alert.alert("Error", "Failed to accept shift. Please try again.");
    } finally {
      setIsAccepting(false);
    }
  };

  /* Handles the decline of the shift to give the user a message that confirms cancellation of the shift, or an error message if the shift is not declined */
  const handleDeclineShift = async () => {
    if (!props?.id) return;
    setIsDeclining(true);
    try {
      await declineShift(props.id);
    } catch (error) {
      Alert.alert("Error", "Failed to decline shift. Please try again.");
    } finally {
      setIsDeclining(false);
    }
  };

  if (!props) {
    return null;
  }

  return (
    <ScrollView style={[styles.mainContainer, { backgroundColor: background }]}>
      <Text style={[styles.mainHeaderText, { color: text }]}>
        Shift Details
      </Text>

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>Client</Text>
        <Text style={[styles.text, { color: text }]}>{props?.client}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>Site</Text>
        <Text style={[styles.text, { color: text }]}>{props?.site_name}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>Address</Text>
        <Text style={[styles.text, { color: text }]}>
          {props?.site_address}
        </Text>
        <Text style={[styles.text, { color: text }]}>
          {props?.site_postcode}
        </Text>
      </View>

      <View style={styles.divider} />

      <View style={[styles.rowContainer, styles.timeContainer]}>
        <View style={styles.timeBlock}>
          <Text style={[styles.headerText, { color: text }]}>Start Time</Text>
          <Text style={[styles.text, { color: text }]}>
            {props?.start_time}
          </Text>
        </View>
        <View style={styles.timeBlock}>
          <Text style={[styles.headerText, { color: text }]}>End Time</Text>
          <Text style={[styles.text, { color: text }]}>{props?.end_time}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>Information</Text>
        <Text style={[styles.text, { color: text }]}>{props?.information}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>Pay</Text>
        <Text style={[styles.text, { color: text }]}>{`£${props?.pay} per hour`}</Text>
      </View>

      <View style={styles.divider} />

      <View style={styles.container}>
        <Text style={[styles.headerText, { color: text }]}>Colleagues</Text>
        {props.colleagues && props.colleagues.length > 0 ? (
          <View style={styles.colleagueContainer}>
            {props.colleagues.map((colleague, index) => (
              <Pressable
                key={index}
                style={[
                  styles.colleagueButtons,
                  { backgroundColor: inactivebtn },
                ]}
              >
                <Text style={[styles.colleagueText, { color: text }]}>
                  {colleague.name}
                </Text>
              </Pressable>
            ))}
          </View>
        ) : (
          <Text style={[styles.text, { color: text }]}>
            No colleagues assigned
          </Text>
        )}
      </View>

      {/* Display the buttons given the status of the shift.
      If the shift has been assigned, only the cancel button is displayed.
      If the shift is pending, both the confirm and cancel buttons are displayed.
      If the shift is completed or cancelled the confirm and cancel buttons are not displayed.
     */}
      <View style={[styles.buttonContainer, { marginBottom: 10 }]}>
        {props.status === "pending" ? (
          <>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: activebtn },
                isAccepting && styles.disabledButton,
              ]}
              onPress={handleAcceptShift}
              disabled={isAccepting}
            >
              <Text style={styles.buttonText}>
                {isAccepting ? "Confirming..." : "Confirm"}
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                { backgroundColor: activebtn },
                isDeclining && styles.disabledButton,
              ]}
              onPress={handleDeclineShift}
              disabled={isDeclining}
            >
              <Text style={styles.buttonText}>
                {isDeclining ? "Cancelling..." : "Cancel"}
              </Text>
            </TouchableOpacity>
          </>
        ) : props.status === "assigned" ? (
          <TouchableOpacity
            style={[
              styles.button,
              { backgroundColor: activebtn },
              isDeclining && styles.disabledButton,
            ]}
            onPress={handleDeclineShift}
            disabled={isDeclining}
          >
            <Text style={styles.buttonText}>
              {isDeclining ? "Cancelling..." : "Cancel"}
            </Text>
          </TouchableOpacity>
        ) : (
          <></>
        )}
      </View>
    </ScrollView>
  );
};

export default EventDetailsComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    borderTopLeftRadius: 10,
    borderTopRightRadius: 10,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.25,
    padding: 5,
  },

  container: {
    padding: 8,
    width: "100%",
  },

  mainHeaderText: {
    fontSize: 24,
    fontWeight: "bold",
    fontFamily: "BarlowLight",
    marginBottom: 16,
    textAlign: "center",
  },

  text: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    marginTop: 4,
  },

  headerText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    marginBottom: 4,
  },

  rowContainer: {
    padding: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  timeContainer: {
    backgroundColor: "rgba(0,0,0,0.03)",
    borderRadius: 10,
    padding: 12,
  },

  timeBlock: {
    alignItems: "center",
    flex: 1,
  },

  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingHorizontal: 8,
    marginTop: 16,
    gap: 16,
  },

  button: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 3,
    shadowOpacity: 0.25,
    borderRadius: 10,
  },

  buttonText: {
    fontSize: 16,
    fontWeight: "bold",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    color: "#FFFFFF",
  },

  colleagueContainer: {
    gap: 8,
    marginTop: 8,
  },

  colleagueButtons: {
    padding: 12,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowRadius: 2,
    shadowOpacity: 0.2,
    borderRadius: 12,
  },

  colleagueText: {
    fontSize: 14,
    fontWeight: "600",
    textAlign: "center",
  },

  divider: {
    height: 1,
    backgroundColor: "rgba(0,0,0,0.1)",
    marginVertical: 4,
  },

  disabledButton: {
    opacity: 0.6,
  },
});
