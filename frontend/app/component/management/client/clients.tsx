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
  Alert,
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

import { ClientDetailsType } from "@/app/types/management/client";
import { ScrollView } from "react-native-gesture-handler";
import { useClientContext } from "@/app/context/management/client/clientContext";
import iconSet from "@expo/vector-icons/build/Fontisto";
import ThemedHeaderText from "../../helper/ThemedHeaderText";
import ButtonText from "../../helper/ButtonText";
import InnerThemedText from "../../helper/InnerThemedText";
import SubtitleThemedText from "../../helper/SubtitleThemedText";
/* This displays a client view which defines the total client a superadmin has on his contract list */
const ClientDetailsComponent: React.FC<{
  props: ClientDetailsType;
}> = ({ props }) => {
  const {
    handlePhone,
    toggleCreateContractModal,
    editContract: handleEditContract,
    deleteContract,
    isLoading,
    editClient,
    deleteClient,
  } = useClientContext();

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

  const handleDeleteClient = async () => {
    Alert.alert("Delete Client", `Are you sure you want to delete ${props.name} with the id ${props.client_id} and all associated contracts?`, [
      { text: "Cancel", style: "cancel" },
      { text: "Delete", style: "destructive", onPress: async () => {
        try {
          await deleteClient(props.client_id);
        } catch (error) {
          console.error("Error deleting client:", error);
        }
      } },
    ]);
  };

  return (
    <View
      style={[
        styles.maincontainer,
        {
          backgroundColor: text,
          shadowColor: primary,
        },
      ]}
    >
      <View style={styles.headerSection}>
        <View style={styles.titleRow}>
          <TouchableOpacity
            onPress={handleDeleteClient}
          >
            <MaterialIcons name="delete" size={24} color={primary} />
          </TouchableOpacity>
          <ThemedHeaderText text={props.name} />
          <Pressable
            onPress={() => handlePhone(props.phone)}
            style={[styles.callButton, { borderColor: highlight }]}
          >
            <MaterialIcons name="call" size={24} color={primary} />
          </Pressable>
        </View>

        <View style={styles.actionButtons}>
          <TouchableOpacity
            style={[styles.actionButton, { backgroundColor: primary }]}
            onPress={() => editClient(props)}
          >
            <MaterialIcons name="edit" size={18} color={innerbackground} />
            <ButtonText text="Edit Client" />
          </TouchableOpacity>

          <TouchableOpacity
            onPress={() => toggleCreateContractModal(props.client_id)}
            style={[styles.actionButton, { backgroundColor: primary }]}
          >
            <MaterialIcons name="add" size={18} color={innerbackground} />
            <ButtonText text="New Contract" />
          </TouchableOpacity>
        </View>
      </View>

      <Pressable onPress={handleSiteToggle} style={styles.contentSection}>
        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <MaterialIcons name="location-on" size={16} color={'#000'} />
            <InnerThemedText text={props.address} />
          </View>
          <InnerThemedText text={props.postcode} />

          <View style={[styles.infoRow, { marginTop: 12 }]}>
            <MaterialIcons name="email" size={16} color={'#000'} />
            <InnerThemedText text={props.email} />
          </View>

          <View style={styles.infoRow}>
            <MaterialIcons name="phone" size={16} color={'#000'} />
            <InnerThemedText text={props.phone} />
          </View>
        </View>
      </Pressable>

      {siteToggle && (
        <View style={styles.dropdowncontainer}>
          <SubtitleThemedText text={props.name} />
          <ScrollView
            style={{ flexGrow: 1, width: "100%", maxHeight: 200 }}
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
                <View style={styles.contractHeaderRow}>
                  <InnerThemedText text={contract.name} />

                  <TouchableOpacity
                    style={styles.editButton}
                    onPress={() => handleEditContract(contract)}
                  >
                    <MaterialIcons name="edit" size={20} color={primary} />
                  </TouchableOpacity>

                  {isLoading ? (
                    <ActivityIndicator size="small" color={primary} />
                  ) : (
                    <TouchableOpacity
                      style={styles.editButton}
                      onPress={() => deleteContract(contract)}
                    >
                      <MaterialIcons name="delete" size={20} color={primary} />
                    </TouchableOpacity>
                  )}
                </View>

                <InnerThemedText text={contract.address} />
                <InnerThemedText text={contract.postcode} />
                <InnerThemedText text={contract.city} />
                <InnerThemedText text={`start date: ${contract.start_date}`} />
                <InnerThemedText text={`end date: ${contract.end_date}`} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

export default ClientDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    marginVertical: 3,
    borderRadius: 5,
    marginHorizontal: 4,
    shadowRadius: 8,
    elevation: 4,
    overflow: "hidden",
  },

  headerSection: {
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
  },

  titleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 18 : 20,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  callButton: {
    padding: 8,
    borderRadius: 25,
    borderWidth: 1,
    backgroundColor: "rgba(255, 255, 255, 0.1)",
  },

  actionButtons: {
    flexDirection: "row",
    gap: 12,
  },

  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
    gap: 6,
  },

  actionButtonText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "BarlowRegular",
  },

  contentSection: {
    padding: 10,
  },

  infoSection: {
    gap: 8,
  },

  infoRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  clientText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    lineHeight: 20,
  },

  dropdowncontainer: {
    flex: 1,
    flexDirection: "column",
    marginVertical: 5,
    padding: 5,
    width: "100%",
  },

  droopdownDetails: {
    padding: 10,
    marginBottom: 8,
    borderWidth: 0.5,
    borderRadius: 8,
  },

  siteText: {
    fontSize: 13,
    lineHeight: 20,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  contractHeaderRow: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginBottom: 8,
  },

  editButton: {
    padding: 8,
    marginLeft: 8,
  },
});
