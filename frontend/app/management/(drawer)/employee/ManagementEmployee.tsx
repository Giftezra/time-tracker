import {
  View,
  Text,
  TextInput,
  Pressable,
  StyleSheet,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  Modal,
} from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaView } from "react-native-safe-area-context";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import EmployeeDisplayComponent from "@/app/component/management/employees/EmployeeDataDisplay";
import { EmployeeDetailsInterface } from "@/app/types/management/employee";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useEmployeeContext } from "@/app/context/management/employee/employeeContext";
import { useAuth } from "@/app/authentication";
import SideComponent from "@/app/component/helper/sideComponent";
import AddEmployeeComponent from "@/app/component/management/employees/AddEmployee";
import EmployeeAnalyticsComponent from "@/app/component/management/employees/EmployeeAnalytics";

const ManagementEmployeee = () => {
  // Import and use tbhe context methods
  const {
    employeelist,
    isModalVisible,
    setIsModalVisible,
    isLoading,
    clearData,
    employeeData,
    workLog,
    taskDetails,
  } = useEmployeeContext();

  const { windowWidth } = useAuth();
  const text = useThemeColor({}, "text");
  const textinput = useThemeColor({}, "textinput");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);
  const [search, setSearch] = useState<string>("");
  const [filteredList, setFilteredList] =
    useState<EmployeeDetailsInterface[]>();
  const checkUndefined = () => {
    if (employeelist === undefined) {
      return 0;
    }
    return employeelist.length;
  };
  const list = checkUndefined();
  /* Handle the activity modal close. Call the clear data method to clear the data from the state and set the is modal visible to false */
  const handleModalClose = () => {
    clearData();
    setIsModalVisible(false);
  };

  const handleSearch = () => {
    if (!employeelist) return;

    const filtered = employeelist.filter(
      (employee) =>
        employee.name.toLowerCase().includes(search.toLowerCase()) ||
        employee.email.toLowerCase().includes(search.toLowerCase()) ||
        employee.phone.toLowerCase().includes(search.toLowerCase())
    );

    setFilteredList(filtered);
  };

  return (
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
          width: Platform.OS === "web" ? windowWidth * 0.8 : windowWidth * 1,
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
              placeholder="Enter employee name, email or phone number"
              value={search}
              onChangeText={(text) => {
                setSearch(text);
                if (text === "") {
                  setFilteredList(undefined);
                } else {
                  handleSearch();
                }
              }}
              style={styles.input}
            />
          </View>
          {/* Route the user to the  add employee page when pressed */}
          <Pressable
            style={[styles.iconContainer, { backgroundColor: inactivebtn }]}
            onPress={() => setIsModalOpen(true)}
          >
            <AntDesign name="plus" size={24} color="black" />
          </Pressable>
        </View>

        <ScrollView style={{ flexGrow: 1 }}>
          {/* This is only view for the add button and the total numbe rof emplayees */}

          <Text style={[styles.employeeText, { color: inactivebtn }]}>
            {`you have ${list} employees working with your company`}
          </Text>

          <View style={styles.employeeContatiner}>
            {/* Map the filtered results if they exist, otherwise show all employees */}
            {(filteredList || employeelist)?.map((employee, index) => (
              <View key={index} style={styles.employee}>
                <EmployeeDisplayComponent {...employee} />
              </View>
            ))}
          </View>
        </ScrollView>
      </View>

      {/* Display the modal for the add employee component */}
      <Modal visible={isModalOpen} onRequestClose={() => setIsModalOpen(false)}>
        <View style={styles.modalContainer}>
          <Pressable
            onPress={() => setIsModalOpen(false)}
            style={styles.modalCloseButton}
          >
            <MaterialIcons name="close" size={20} color="black" />
          </Pressable>

          <AddEmployeeComponent setIsModalOpen={setIsModalOpen} />
        </View>
      </Modal>

      {/* Display the modal for the employee analytics component to display major data about the employee */}
      {!isLoading && (
        <Modal visible={isModalVisible} onRequestClose={handleModalClose}>
          <View style={styles.modalContainer}>
            <Pressable
              onPress={handleModalClose}
              style={styles.modalCloseButton}
            >
              <MaterialIcons name="close" size={22} color="red" />
            </Pressable>

            <EmployeeAnalyticsComponent
              employeeData={employeeData}
              workLog={workLog}
              taskDetails={taskDetails}
            />
          </View>
        </Modal>
      )}
    </GestureHandlerRootView>
  );
};

export default ManagementEmployeee;

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
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    marginStart: 20,
    padding: 5,
  },

  input: {
    padding: 8,
    fontSize: 12,
    fontFamily: "BarlowMedium",
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
    marginVertical: 5,
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
  },

  modalCloseButton: {
    position: "absolute",
    top: 0,
    right: 5,
    padding: 5,
    zIndex:100
  },

  modalContainer: {
    flex: 1,
    gap:10,
  },
});
