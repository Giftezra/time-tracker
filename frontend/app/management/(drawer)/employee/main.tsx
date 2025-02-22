import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";

import EmployeeContainerComponent from "@/app/component/management/employees/employee_display";

import { EmployeeDetailsType } from "@/app/types/management/employee";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEmployeeContext } from "@/app/context/management/employee/employeeContext";
import { useAuth } from "@/app/context/authentication";
import SideComponent from "@/app/component/helper/sideComponent";

const MainEmployeePanel = () => {
  // Import and use tbhe context methods
  const {
    employeelist,
    search,
    setSearch,
    filterEmployeeList,
    filteredEmployeeList,
  } = useEmployeeContext();

  const { windowWidth } = useAuth();

  const secondarycolor = useThemeColor({}, "secondaryColor");
  const primarycolor = useThemeColor({}, "primaryColor");
  const text = useThemeColor({}, "text");
  const hightlight = useThemeColor({}, "highlight");
  const innerBackground = useThemeColor({}, "innerBackground");
  const textinput = useThemeColor({}, "textinput");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const otherText = useThemeColor({}, "otherText");

  const [isPressed, setIsPressed] = useState<boolean>(false);

  const checkUndefined = () => {
    if (employeelist === undefined) {
      return 0;
    }
    return employeelist.length;
  };

  const list = checkUndefined();

  return (
    <SafeAreaView style={[{ flex: 1 }, { backgroundColor: secondarycolor }]}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <GestureHandlerRootView
          style={[styles.maincontainer, { width: windowWidth }]}
        >
          {/* Conditionally render the side component for the web interface */}
          {Platform.OS === "web" && (
            <View style={{ width: windowWidth * 0.2 }}>
              <SideComponent />
            </View>
          )}

          <View
            style={{
              width:
                Platform.OS === "web" ? windowWidth * 0.8 : windowWidth * 1,
            }}
          >
            {/* Contains a search input bar that can be used by the admin to search for a particular staff */}

            <View style={styles.searchContainer}>
              {/* Contains the search input */}
              <View
                style={[
                  styles.searchInputContainer,
                  { backgroundColor: textinput },
                ]}
              >
                <AntDesign
                  name="search1"
                  size={15}
                  color="black"
                  style={{ margin: 10 }}
                />
                <TextInput
                  placeholder="search"
                  value={search}
                  onChangeText={setSearch}
                  onSubmitEditing={() => console.log("searching")}
                  style={styles.input}
                />
              </View>
              <Pressable
                style={[styles.iconContainer, { backgroundColor: inactivebtn }]}
                onPress={filterEmployeeList}
                onPressIn={() => setIsPressed(true)}
              >
                <AntDesign name="search1" size={24} color={text} />
              </Pressable>

              {/* Route the user to the  add employee page when pressed */}
              <Pressable
                style={[styles.iconContainer, { backgroundColor: inactivebtn }]}
                onPress={() =>
                  router.navigate("/management/(drawer)/employee/addemployee")
                }
              >
                <AntDesign name="plus" size={24} color="black" />
              </Pressable>
            </View>

            <ScrollView style={{ flex: 1 }}>
              {/* This is only view for the add button and the total numbe rof emplayees */}

              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                }}
              >
                <Text style={[styles.employeeText, { color: otherText }]}>
                  {`you have ${list} employees working with your company`}
                </Text>
              </View>

              <View style={styles.employeeContatiner}>
                {/* Map the number of employes in a row pattern and implements pagination when the view contains more than 25 employees per page */}
                {employeelist?.map((employee, index) => (
                  <Pressable key={index} style={styles.employee}>
                    <EmployeeContainerComponent {...employee} />
                  </Pressable>
                ))}
              </View>
            </ScrollView>
          </View>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default MainEmployeePanel;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },

  searchContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    borderBottomWidth: 1,
    marginBottom: 30,
  },

  searchInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    flex: 1,
    borderWidth: 1,
    borderRadius: 5,
    marginEnd: 5,
  },

  employeeText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "OswaldVariable",
    textTransform: "capitalize",
    marginStart: 20,
    padding: 5,
    color: "#f28a48",
  },

  input: {
    padding: 8,
    fontSize: 15,
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
  },

  iconContainer: {
    justifyContent: "space-between",
    alignItems: "center",
    padding: 8,
    borderWidth: 1,
    borderRadius: 30,
    marginEnd: 10,
  },

  addEmployeeText: {
    fontSize: 15,
    fontFamily: "OswaldVariable",
    textTransform: "capitalize",
    color: "white",
  },

  employeeContatiner: {
    flexDirection: "row",
    flexWrap: "wrap",
    flex: 1,
    padding: 5,
  },

  employee: {
    flexGrow: 1,
    minWidth: 300,
    marginVertical: 20,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
  },
});
