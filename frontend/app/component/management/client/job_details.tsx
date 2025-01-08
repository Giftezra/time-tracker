/**
 * The component renders a view that displays the list of all assigned tasks within a 24 hour period.
 * the input is used to send a request to the server with the client name. the response which will be an array object will be rendered in the view.
 */
import {
  ActivityIndicator,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

import PopupButton from "../../helper/popupButton";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useClientContext } from "@/app/context/management/client/clientContext";
import { JobDetailsType } from "@/app/types/management/client";

/* The component displays the job details and which employee was assigned to a shift.

Each shift has a pay range , and other data to simulate a site.*/
const JobDetailsComponent: React.FC<JobDetailsType> = (props) => {
  const { handlePhone, handleMessage, countDown, timeElapsed } =
    useClientContext();

  /**
   * Use the useThemeColor hook to get the color of the theme based on the device color scheme
   *
   */
  const primary = useThemeColor({}, "primaryColor");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const innerbackground = useThemeColor({}, "innerBackground");
  const highlight = useThemeColor({}, "highlight");
  const text = useThemeColor({}, "text");
  const otherText = useThemeColor({}, "otherText");
  const [toggleContract, setToggleContract] = useState(false);

  const toggleContractDisplay = () => setToggleContract(!toggleContract);

  return (
    <Pressable
      style={[styles.maincontainer, { backgroundColor: innerbackground }]}
      onPress={toggleContractDisplay}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[styles.headerText, { color: otherText }]}>
          client: {props.client}
        </Text>
        <AntDesign
          name={toggleContract ? "down" : "up"}
          size={18}
          color={otherText}
        />
      </View>

      <View style={styles.container}>
        <View></View>
        <Text style={[styles.text, { color: text }]}>
          {props.contract_name}
        </Text>
        <Text style={[styles.text, { color: text }]}>
          {props.contract_address}
        </Text>
        <Text style={[styles.text, { color: text }]}>
          {props.contract_postcode}
        </Text>
      </View>

      {/* Conditionally render the contract details when the contract is toggled.
      This will display the shift details includint the employees assigned to the task */}
      {toggleContract && (
        <View>
          <View>
            <Text
              style={[styles.headerText, { fontSize: 14, color: otherText }]}
            >
              staff assigned
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

          <View style={{ padding: 5 }}>
            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <Text>Rate</Text>
              <Text>{props.pay}</Text>
            </View>
            <View style={{ flexDirection: "row", columnGap: 10 }}>
              <Text
                style={{
                  fontFamily: "BarlowRegular",
                  fontSize: 14,
                  fontWeight: "500",
                  fontVariant: ["tabular-nums"],
                  textTransform: "capitalize",
                  color: text,
                }}
              >
                start date
              </Text>
              <Text style={{ fontFamily: "BarlowLight", fontSize: 13 }}>
                {props.task_start_date?.toDateString()}
              </Text>
            </View>
            {countDown === null ? (
              <Text
                style={{
                  fontFamily: "OswaldVariable",
                  fontSize: 14,
                  fontVariant: ["contextual"],
                  color: text,
                }}
              >
                {timeElapsed}
              </Text>
            ) : (
              <View>
                <Text
                  style={{ fontVariant: ["small-caps"] }}
                >{`Shift starts in ${countDown}`}</Text>
              </View>
            )}
          </View>
        </View>
      )}
    </Pressable>
  );
};

export default JobDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: "100%",
    borderRadius: 5,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },

  containerContainer: {
    flexDirection: "column",
    flexWrap: "wrap",
    width: "100%",
  },

  container: {
    flexDirection: "column",
    justifyContent: "space-around",
    padding: 5,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 14 : 16,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
    marginVertical: 5,
    marginHorizontal: 5,
  },

  text: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    textTransform: "capitalize",
    marginLeft: 2,
    marginVertical: 1,
  },

  employeeContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    borderRadius: 5,
    borderBottomWidth: 1,
    marginVertical: 5,
    padding: 2,
  },
});
