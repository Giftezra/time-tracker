/***
 * This component defined the client view.The client view is the client object that deals deriectly with the company.
 *
 * The view renders the details of the client and a list of all the contracts associated with the client object.
 *
 * The view also renders a modal that allows the super admin or the admin to create a new contract associated with the client object.
 *
 * The view also renders an edit icon that displays another modal that would allow the super admin or the admin to edit the client object.
 */
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  Modal,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";

import { ClientDetail, ClientDetailsType } from "@/app/types/management/client";
import { ScrollView } from "react-native-gesture-handler";
import { useClientContext } from "@/app/context/management/client/clientContext";


/* This displays a client view which defines the total client a superadmin has on his contract list */
const ClientDetailsComponent: React.FC<{
  props: ClientDetailsType;
  onModalVisible: () => void;
}> = ({ props, onModalVisible }) => {
  const { handlePhone} = useClientContext();

  const [siteToggle, setSiteToggle] = useState(false);

  /**
   * Load the colors based on the devices color scheme
   */
  const primary = useThemeColor({}, "primaryColor");
  const otherText = useThemeColor({}, "otherText");
  const innerbackground = useThemeColor({}, "innerBackground");
  const highlight = useThemeColor({}, "highlight");
  const icon = useThemeColor({}, "icon");
  const text = useThemeColor({}, "text");

  /* Handle the toggle for the sit clicks to display the site details */
  const handleSiteToggle = () => {
    setSiteToggle(!siteToggle);
  };

  return (
    <View
      style={[
        styles.maincontainer,
        {
          backgroundColor: innerbackground,
          shadowColor: primary,
        },
      ]}
    >
      <Pressable
        onPress={() => handlePhone(props.clients.phone)}
        style={{
          padding: 5,
          paddingHorizontal: 10,
          alignItems: "center",
          width: 30,
          marginStart: 5,
          marginTop: 5,
        }}
      >
        <MaterialIcons name="call" size={24} color="green" />
      </Pressable>
      <Pressable onPress={handleSiteToggle} style={styles.button}>
        {/* This view renders the edit button and the create contract icon */}
        <View style={styles.headerContainers}>
          <Text style={[styles.headerText, { color: otherText }]}>
            {props.clients.name}
          </Text>
          <View
            style={{ flexDirection: "row", justifyContent: "space-between" }}
          >
            <TouchableOpacity
              style={[
                styles.icons,
                {
                  backgroundColor: primary,
                  shadowColor: primary,
                  borderBlockColor: highlight,
                  borderWidth: 1.5,
                },
              ]}
            >
              <MaterialIcons name="edit" size={20} color={icon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={onModalVisible}
              style={[
                styles.icons,
                {
                  backgroundColor: primary,
                  shadowColor: primary,
                  borderBlockColor: highlight,
                  borderWidth: 1.5,
                },
              ]}
            >
              <MaterialIcons name="add" size={20} color={icon} />
            </TouchableOpacity>
          </View>
        </View>

        <Text style={[styles.clientText, { color: text }]}>
          {props.clients.address}
        </Text>
        <Text style={[styles.clientText, { color: text }]}>
          {props.clients.postcode}
        </Text>
        <Text style={[styles.clientText, { color: text }]}>
          {props.clients.email}
        </Text>
        <Text style={[styles.clientText, { color: text }]}>
          {props.clients.phone}
        </Text>
      </Pressable>

      {siteToggle && (
        <View style={{ flex: 1, width: "100%" }}>
          <View style={styles.dropdowncontainer}>
            <Text
              style={[
                styles.headerText,
                { color: otherText, fontSize: 12, marginBottom: 5 },
              ]}
            >
              {props.clients.name} contract details
            </Text>
            <ScrollView
              style={{ flexGrow: 1, width: "100%" }}
              nestedScrollEnabled={true}
            >
              {props.contracts.map((contract, index) => (
                <View
                  key={index}
                  style={[
                    styles.droopdownDetails,
                    {
                      shadowColor: innerbackground,
                      borderBlockColor: highlight,
                    },
                  ]}
                >
                  <Text style={[styles.siteText, { color: text }]}>
                    {contract.name}
                  </Text>
                  <Text style={[styles.siteText, { color: text }]}>
                    {contract.address}
                  </Text>
                  <Text style={[styles.siteText, { color: text }]}>
                    {contract.postcode}
                  </Text>
                  <Text style={[styles.siteText, { color: text }]}>
                    {contract.city}
                  </Text>
                  <Text style={[styles.siteText, { color: text }]}>
                    {contract.description}
                  </Text>
                  <Text style={[styles.siteText, { color: text }]}>
                    {`start date: ${contract.start_date}`}
                  </Text>
                  <Text style={[styles.siteText, { color: text }]}>
                    {`end date: ${contract.end_date}`}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>
        </View>
      )}
    </View>
  );
};

export default ClientDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-evenly",
    marginVertical: 2,
    borderRadius: 5,
    marginHorizontal: 2,
    shadowRadius: 10,
    elevation: 10,
  },

  button: {
    alignItems: "center",
    padding: 10,
  },

  dropdowncontainer: {
    flexDirection: "column",
    marginVertical: 5,
    padding: 5,
    width: "100%",
  },

  droopdownDetails: {
    flex: 1,
    padding: 10,
    marginBottom: 10,
    borderWidth: 0.5,
    borderRadius: 5,
  },

  headerContainers: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
    alignItems: "center",
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 13 : 16,
    fontWeight: "normal",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  clientText: {
    fontSize: 14,
    fontWeight: "normal",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  siteText: {
    fontSize: 12,
    fontWeight: "normal",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  icons: {
    shadowRadius: 5,
    elevation: 5,
    padding: 5,
    borderRadius: 50,
    borderWidth: 1,
    opacity: 0.8,
    shadowOpacity: 0.4,
    marginHorizontal: 5,
  },
});
