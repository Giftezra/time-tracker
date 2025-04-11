import {
  Modal,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { FlatList } from "react-native-gesture-handler";
import ClientDetailsComponent from "@/app/component/management/client/clients";
import { useClientContext } from "@/app/context/management/client/clientContext";
import JobDetailsComponent from "@/app/component/management/client/jobDetails";
import SearchInputContainer from "@/app/component/helper/SearchInput";
import SubtitleThemedText from "@/app/component/helper/SubtitleThemedText";
const ClientMobileComponent = () => {
  const {
    jobDetailsData,
    clientDetailsData,
    isCreateContractModalVisible,
    toggleCreateContractModal,
    setIsCreateClientModalVisible,
  } = useClientContext();
  const [toggleView, setToggleView] = useState("clients");

  const secondaryColor = useThemeColor({}, "secondaryColor");
  const text = useThemeColor({}, "text");

  const handleToggleView = (header: string) => {
    setToggleView(header);
  };

  // Subheader for the mobile view
  const subHeader = ["clients", "assigned tasks"];

  return (
    <KeyboardAvoidingView
      style={[styles.mobileContainer, { backgroundColor: secondaryColor }]}
    >
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
            <SubtitleThemedText text={header} />
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

          <FlatList
            data={clientDetailsData}
            keyExtractor={(item, index) => `client-${item.client_id}-${index}`}
            renderItem={({ item }) => <ClientDetailsComponent props={item} />}
          />
        </View>
      )}

      {/* Conditionally render the client view */}
      {toggleView === "assigned tasks" && (
        <View style={{ flex: 1, width: "100%" }}>
          {/* Add the search bar component to filter the client details */}
          <View>
            <SearchInputContainer />
          </View>

          <FlatList
            data={jobDetailsData}
            keyExtractor={(item, index) => `job-${item.client_id}-${index}`}
            renderItem={({ item }) => <JobDetailsComponent {...item} />}
          />
        </View>
      )}
    </KeyboardAvoidingView>
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
