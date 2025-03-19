import { Dimensions, Platform, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import {
  FlatList,
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import SearchInputContainer from "@/app/component/helper/searchInput";
import { useClientContext } from "@/app/context/management/client/clientContext";
import ClientDetailsComponent from "@/app/component/management/client/clients";
import JobDetailsComponent from "@/app/component/management/client/jobDetails";
import { useThemeColor } from "@/hooks/useThemeColor";
import CustomModal from "@/app/component/helper/customModal";
import SideComponent from "@/app/component/helper/sideComponent";
import { useAuth } from "@/app/context/authentication";
import AddContractComponent from "@/app/component/management/client/addcontract";

const WebClientComponent = () => {
  const { windowWidth } = useAuth();
  const { clientDetailsData, jobDetailsData } = useClientContext();

  const [isModalVisible, setIsModalVisible] = useState(false);

  const onModalVisible = () => {
    setIsModalVisible(!isModalVisible);
  };

  return (
    <GestureHandlerRootView
      style={[styles.mainContainer, { width: windowWidth }]}
    >
      <View style={{ width: windowWidth * 0.2, flex: 1 }}>
        <SideComponent />
      </View>

      <View style={[styles.container, { width: windowWidth * 0.8 }]}>
        <View style={{ width: "40%" }}>
          <View style={{ padding: 5 }}>
            <SearchInputContainer />
          </View>

          <FlatList
            data={clientDetailsData}
            keyExtractor={(item, index) => `client-${item.client_id}-${index}`}
            renderItem={({ item }) => <ClientDetailsComponent props={item} />}
          />
        </View>

        {/* This view contains the component that displays the employee and the site they are meant to be. It also contains an option to assign employee a task. */}
        <View style={[styles.taskContainer, { width: "60%" }]}>
          <SearchInputContainer />
          {/* View for the list ofassigned tasks */}
          <FlatList
            data={jobDetailsData}
            keyExtractor={(item, index) => `job-${item.client_id}-${index}`}
            renderItem={({ item }) => <JobDetailsComponent {...item} />}
          />
        </View>
      </View>

      <CustomModal isModalOpen={isModalVisible} closeModal={onModalVisible}>
        <AddContractComponent />
      </CustomModal>
    </GestureHandlerRootView>
  );
};

export default WebClientComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flex: 1,
  },

  container: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  clientContainer: {
    borderRadius: 2,
    padding: 2,
  },

  client: {
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.7,
  },

  employee: {
    marginVertical: 5,
  },

  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
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

  buttonText: {
    color: "white",
    fontWeight: "bold",
    fontFamily: "RobotoRegular",
    fontSize: 12,
    textTransform: "uppercase",
  },

  taskContainer: {
    flex: 1,
    padding: 2,
  },

  siteSearchInputContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 2,
    elevation: 5,
    shadowRadius: 5,
    shadowOpacity: 0.4,
  },

  icon: {
    borderRadius: 50,
    padding: 10,
    shadowRadius: 5,
    shadowOpacity: 0.3,
    backgroundColor: "gray",
    marginHorizontal: 10,
    marginVertical: 2,
    borderWidth: 0.5,
  },
});
