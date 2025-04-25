/**
 * The component renders a view that displays the list of all assigned tasks within a 24 hour period.
 * the input is used to send a request to the server with the client name. the response which will be an array object will be rendered in the view.
 */
import {
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useClientContext } from "@/app/context/management/client/clientContext";
import { JobDetailsType } from "@/app/types/management/client";
import ThemedHeaderText from "../../helper/ThemedHeaderText";
import SubtitleThemedText from "../../helper/SubtitleThemedText";
import InnerThemedText from "../../helper/InnerThemedText";
/* The component displays the job details and which employee was assigned to a shift.

Each shift has a pay range , and other data to simulate a site.*/
const JobDetailsComponent: React.FC<JobDetailsType> = (props) => {
  const { handlePhone, handleMessage, countDown, timeElapsed, isLoading } =
    useClientContext();

  /**
   * Use the useThemeColor hook to get the color of the theme based on the device color scheme
   *
   */
  const primary = useThemeColor({}, "primaryColor");
  const innerbackground = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");
  const otherText = useThemeColor({}, "otherText");
  const [toggleContract, setToggleContract] = useState(false);

  const toggleContractDisplay = () => setToggleContract(!toggleContract);

  return (
    <View style={[styles.maincontainer]}>
      <Text
        style={{
          textAlign: "center",
          fontSize: 12,
          fontFamily: "BarlowRegular",
          fontWeight: "500",
          color: "blue",
        }}
      >
        click to drop down
      </Text>
      {/* The main component displays the client details so that when clicked, the tasks associated with the client are displayed. */}
      <Pressable onPress={toggleContractDisplay}>
        <View style={styles.clientHeader}>
          <ThemedHeaderText text={props.client_name || ""} />
          <AntDesign
            name={toggleContract ? "caretup" : "caretdown"}
            size={16}
            color={'#000'}
          />
        </View>

        <View style={styles.contractContainer}>
          <View style={styles.contractInfoRow}>
            <SubtitleThemedText text="Contract Name:" />
            <InnerThemedText text={props.contract_name} />
          </View>
          <View style={styles.contractInfoRow}>
            <SubtitleThemedText text="Address:" />
            <InnerThemedText text={props.contract_address} />
          </View>
          <View style={styles.contractInfoRow}>
            <SubtitleThemedText text="Postcode:" />
            <InnerThemedText text={props.contract_postcode} />
          </View>
          <View style={styles.contractInfoRow}>
            <SubtitleThemedText text="Serial:" />
            <InnerThemedText text={props.task_serial} />
          </View>
          <View style={styles.timeFrameContainer}>
            <SubtitleThemedText text="Task time frame" />
            <View style={styles.timeFrameContent}>
              <View style={styles.timeFrameItem}>
                <SubtitleThemedText text="start date" />
                <InnerThemedText text={props.task_start_date?.split("T")[0]} />
              </View>

              <View style={styles.timeFrameItem}>
                <SubtitleThemedText text="start time" />
                <InnerThemedText text={props.task_start_time} />
              </View>

              <View style={styles.timeFrameItem}>
                <SubtitleThemedText text="finish time" />
                <InnerThemedText text={props.task_end_time} />
              </View>
            </View>
          </View>
        </View>
      </Pressable>

      {toggleContract && (
        <View style={styles.detailsContainer}>
          <View style={styles.staffSection}>
            <ThemedHeaderText text="Staff Assigned" />
            {props.employee.map((employee, index) => (
              <View key={index} style={styles.employeeContainer}>
                <View>
                  <SubtitleThemedText text={employee.name} />
                  <InnerThemedText text={employee.email} />
                  <InnerThemedText text={employee.id} />
                  <InnerThemedText text={employee.phone} />
                </View>
                <TouchableOpacity onPress={() => handlePhone(employee.phone)}>
                  <AntDesign name="phone" size={24} color={primary} />
                </TouchableOpacity>
                <TouchableOpacity
                  onPress={() => handleMessage(employee.id, employee.name)}
                >
                  <MaterialIcons name="message" size={24} color={primary} />
                </TouchableOpacity>
              </View>
            ))}
          </View>

          <View style={styles.infoSection}>
            <View style={styles.infoRow}>
              <SubtitleThemedText text="Rate" />
              <InnerThemedText text={props.pay?.toString() || ""} />
            </View>
            <View style={styles.infoRow}>
              <SubtitleThemedText text="Start Date" />
              <InnerThemedText text={props.task_start_date?.split("T")[0]} />
            </View>
            {countDown === null ? (
              <View style={styles.infoRow}>
                <SubtitleThemedText text="Time Elapsed" />
                <InnerThemedText text={timeElapsed?.toString() || ""} />
              </View>
            ) : (
              <View style={styles.infoRow}>
                <SubtitleThemedText text="Shift Starts In" />
                <InnerThemedText text={`${countDown} minutes`} />
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );
};

export default JobDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    marginVertical: 5,
    borderRadius: 4,
    overflow: "hidden",
    marginHorizontal: 4,
    borderWidth: 1,
  },

  clientHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },

  detailsContainer: {
    padding: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(0,0,0,0.1)",
  },

  staffSection: {
    marginBottom: 10,
  },

  sectionHeader: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    marginBottom: 5,
    textTransform: "capitalize",
    letterSpacing: 0.7,
  },

  employeeContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 10,
    paddingHorizontal: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.05)",
    marginBottom: 5,
  },

  infoSection: {
    gap: 5,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingVertical: 6,
  },

  infoLabel: {
    fontFamily: "BarlowRegular",
    fontSize: 15,
    fontWeight: "500",
    textTransform: "capitalize",
    letterSpacing: 0.3,
  },

  infoValue: {
    fontFamily: "BarlowLight",
    fontSize: 15,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 18 : 20,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
    letterSpacing: 0.5,
  },

  text: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    textTransform: "capitalize",
    marginBottom: 1,
  },

  contractContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },

  contractInfoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 1,
  },

  contractLabel: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    letterSpacing: 0.2,
  },

  contractValue: {
    fontSize: 14,
    fontFamily: "BarlowLight",
    flex: 1,
    textAlign: "right",
  },

  timeFrameContainer: {
    marginTop: 16,
    backgroundColor: "rgba(0,0,0,0.02)",
    padding: 12,
    borderRadius: 6,
  },

  timeFrameContent: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 8,
  },

  timeFrameItem: {
    alignItems: "center",
    flex: 1,
    paddingHorizontal: 8,
  },

  timeFrameLabel: {
    fontSize: 13,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    marginBottom: 4,
    textTransform: "capitalize",
    letterSpacing: 0.2,
  },

  timeFrameValue: {
    fontSize: 13,
    fontFamily: "BarlowLight",
  },
});
