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
    <View style={[styles.maincontainer, { backgroundColor: innerbackground }]}>
      {/* The main component displays the client details so that when clicked, the tasks associated with the client are displayed. */}
      <Pressable onPress={toggleContractDisplay}>
        <View style={styles.clientHeader}>
          <Text style={[styles.headerText, { color: text }]}>
            {props.client_name}
          </Text>
          <AntDesign
            name={toggleContract ? "caretup" : "caretdown"}
            size={16}
            color={text}
          />
        </View>

        <View style={styles.contractContainer}>
          <View style={styles.contractInfoRow}>
            <Text style={[styles.contractLabel, { color: otherText }]}>
              Contract Name:
            </Text>
            <Text style={[styles.contractValue, { color: text }]}>
              {props.contract_name}
            </Text>
          </View>
          <View style={styles.contractInfoRow}>
            <Text style={[styles.contractLabel, { color: otherText }]}>
              Address:
            </Text>
            <Text style={[styles.contractValue, { color: text }]}>
              {props.contract_address}
            </Text>
          </View>
          <View style={styles.contractInfoRow}>
            <Text style={[styles.contractLabel, { color: otherText }]}>
              Postcode:
            </Text>
            <Text style={[styles.contractValue, { color: text }]}>
              {props.contract_postcode}
            </Text>
          </View>
          <View style={styles.contractInfoRow}>
            <Text style={[styles.contractLabel, { color: otherText }]}>
              Serial:
            </Text>
            <Text style={[styles.contractValue, { color: text }]}>
              {props.task_serial}
            </Text>
          </View>
          <View style={styles.timeFrameContainer}>
            <Text style={[styles.contractLabel, { color: otherText }]}>
              Task time frame
            </Text>
            <View style={styles.timeFrameContent}>
              <View style={styles.timeFrameItem}>
                <Text style={[styles.timeFrameLabel, { color: otherText }]}>
                  start date
                </Text>
                <Text style={[styles.timeFrameValue, { color: text }]}>
                  {props.task_start_date?.split("T")[0]}
                </Text>
              </View>

              <View style={styles.timeFrameItem}>
                <Text style={[styles.timeFrameLabel, { color: otherText }]}>
                  start time
                </Text>
                <Text style={[styles.timeFrameValue, { color: text }]}>
                  {props.task_start_time}
                </Text>
              </View>

              <View style={styles.timeFrameItem}>
                <Text style={[styles.timeFrameLabel, { color: otherText }]}>
                  finish time
                </Text>
                <Text style={[styles.timeFrameValue, { color: text }]}>
                  {props.task_end_time}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </Pressable>

      {toggleContract && (
        <View style={styles.detailsContainer}>
          <View style={styles.staffSection}>
            <Text style={[styles.sectionHeader, { color: otherText }]}>
              Staff Assigned
            </Text>
            {props.employee.map((employee, index) => (
              <View key={index} style={styles.employeeContainer}>
                <View>
                  <Text style={[styles.text, { color: text }]}>
                    {employee.name}
                  </Text>
                  <Text style={[styles.text, { color: text }]}>
                    {employee.email}
                  </Text>
                  <Text style={[styles.text, { color: text }]}>
                    {employee.id}
                  </Text>
                  <Text style={[styles.text, { color: text }]}>
                    {employee.phone}
                  </Text>
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
              <Text style={[styles.infoLabel, { color: text }]}>Rate</Text>
              <Text style={[styles.infoValue, { color: text }]}>
                {props.pay}
              </Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={[styles.infoLabel, { color: text }]}>
                Start Date
              </Text>
              <Text style={[styles.infoValue, { color: text }]}>
                {props.task_start_date?.split("T")[0]}
              </Text>
            </View>
            {countDown === null ? (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: text }]}>
                  Time Elapsed
                </Text>
                <Text style={[styles.infoValue, { color: text }]}>
                  {timeElapsed}
                </Text>
              </View>
            ) : (
              <View style={styles.infoRow}>
                <Text style={[styles.infoLabel, { color: text }]}>
                  Shift Starts In
                </Text>
                <Text
                  style={[styles.infoValue, { color: text }]}
                >{`${countDown} minutes`}</Text>
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
    marginVertical: 8,
    borderRadius: 8,
    overflow: "hidden",
    marginHorizontal: 4,
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
