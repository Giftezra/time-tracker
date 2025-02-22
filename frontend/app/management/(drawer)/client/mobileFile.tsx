import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Pressable, ScrollView, TextInput } from "react-native-gesture-handler";
import ClientDetailsComponent from "@/app/component/management/client/clients";
import { ClientDetailsType } from "@/app/types/management/client";
import { AntDesign } from "@expo/vector-icons";
import { useClientContext } from "@/app/context/management/client/clientContext";
import JobDetailsComponent from "@/app/component/management/client/jobDetails";
import CustomModal from "@/app/component/helper/customModal";
import AddContractComponent from "@/app/component/management/client/add-contract";
import SearchInputContainer from "@/app/component/helper/searchInput";

const ClientMobileComponent = () => {
  const { jobDetailsData, clientDetailsData } = useClientContext();
  const [toggleView, setToggleView] = useState("clients");
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [searchClient, setSearchClient] = useState("");

  const handleToggleView = (header: string) => {
    setToggleView(header);
  };

  const primary = useThemeColor({}, "primaryColor");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const activebtn = useThemeColor({}, "activebtn");
  const text = useThemeColor({}, "text");
  const highlight = useThemeColor({}, "highlight");
  const textinput = useThemeColor({}, "textinput");

  const subHeader = ["clients", "assigned tasks"];

  const onModalVisible = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <View style={[styles.mobileContainer, { backgroundColor: secondaryColor }]}>
      <View>
        <Text>enter</Text>
      </View>

      {/* Map the header in a row.
                Check the active button and change the color */}
      <View style={styles.mobileSelectButtonContainer}>
        {subHeader.map((header, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.mobileselectButton,
              header === toggleView
                ? { borderBottomWidth: 2 }
                : { borderBottomWidth: 0 },
            ]}
            onPress={() => handleToggleView(header)}
          >
            <Text style={[styles.mobileSelectButtonText, { color: text }]}>
              {header}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      {/* Conditionally render the client view */}
      {toggleView === "clients" && (
        <View
          style={[
            { flex: 1, width: "100%" },
            { backgroundColor: secondaryColor },
          ]}
        >
          {/* Add the search bar component to filter the client details */}
          <View>
            <SearchInputContainer />
          </View>
          <ScrollView style={styles.mobileScrollView}>
            {clientDetailsData?.map((client, index) => (
              <View
                key={index}
                style={[
                  { flex: 1, width: "100%" },
                  { backgroundColor: primary },
                ]}
              >
                <ClientDetailsComponent
                  props={client}
                  onModalVisible={onModalVisible}
                />
              </View>
            ))}
          </ScrollView>
        </View>
      )}

      {/* Conditionally render the client view */}
      {toggleView === "assigned tasks" && (
        <View style={{ flex: 1, width: "100%" }}>
          {/* Add the search bar component to filter the client details */}
          <View>
            <SearchInputContainer />
          </View>
          <ScrollView style={styles.mobileScrollView}>
            {jobDetailsData.map((job, index) => (
              <View key={index} style={{ flex: 1, width: "100%" }}>
                <JobDetailsComponent {...job} />
              </View>
            ))}
          </ScrollView>
        </View>
      )}
      <CustomModal isModalOpen={isModalVisible} closeModal={onModalVisible}>
        <AddContractComponent />
      </CustomModal>
    </View>
  );
};

export default ClientMobileComponent;

const styles = StyleSheet.create({
  mobileContainer: {
    flex: 1,
    width: "100%",
  },

  mobileSelectButtonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },

  mobileselectButton: {
    padding: 10,
    alignItems: "center",
    borderRadius: 10,
    marginHorizontal: 10,
    flex: 1,
    marginBottom: 5,
  },

  mobileSelectButtonText: {
    color: "black",
    fontWeight: "700",
    fontFamily: "RobotoRegular",
    fontSize: 14,
    textTransform: "uppercase",
  },

  mobileScrollView: {
    flex: 1,
    width: "100%",
    borderTopWidth: 1,
    borderColor: "gray",
  },

  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    borderWidth: 1,
    marginBottom: 10,
    borderRadius: 10,
  },

  input: {
    padding: Platform.OS === "web" ? 8 : 10,
    flex: 1,
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 14 : 18,
    fontWeight: "normal",
  },

  searchbutton: {
    padding: Platform.OS === "web" ? 8 : 15,
    borderRadius: 40,
    alignItems: "center",
    marginVertical: 0.5,
    marginHorizontal: 0.5,
    borderWidth: 0.4,
  },
});
