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
import { ClientDetail, JobDetailsType } from "@/app/types/management/client";
import { ContractListType } from "@/app/types/management/task";
import { FlatList } from "react-native-gesture-handler";

/**
 * This component is used to display the client detials associated with the company. it uses a prop to display the client details and the contracts associated with the client object.
 * @props {ClientDetails} - this is the client object that contains the client details
 * @returns
 */
const ClientAndContractDetails: React.FC<ContractListType> = (props) => {
  const primary = useThemeColor({}, "primaryColor");
  const innerbackground = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");
  const otherText = useThemeColor({}, "otherText");
  const [toggleContract, setToggleContract] = useState(false);
  return (
    <Pressable
      style={[styles.maincontainer, { backgroundColor: innerbackground }]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Text style={[styles.headerText, { color: otherText }]}>
          client: {props.client_name}
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
          {`${props.contract_address}, ${props.contract_postcode}`}
        </Text>
        <Text style={[styles.text, { color: text }]}>
          {props.contract_postcode}
        </Text>
      </View>
    </Pressable>
  );
};


const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    borderRadius: 5,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.5,
    marginVertical: 2,
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

export default ClientAndContractDetails;