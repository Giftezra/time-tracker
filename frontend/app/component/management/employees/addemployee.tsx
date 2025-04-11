import {
  _Text,
  ActivityIndicator,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { Employee } from "@/app/types/management/employee";
import TextInputComponent from "@/app/component/helper/textInput";
import CustomCalendar from "@/app/component/helper/customCalendar";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SubmitButtonComponent from "@/app/component/helper/submitButton";
import { useEmployeeContext } from "@/app/context/management/employee/employeeContext";

const idType = [
  "National ID",
  "Passport",
  "Voter's card",
  "Driver's license",
  "Visa",
  "Residence permit",
];

const titled = ["admin", "staff"];

const AddEmployeeComponent = () => {
  const { employees, handleAddEmployeeInput, submitEmployee, error } =
    useEmployeeContext();

  const [showCalendar, setShowCalendar] = useState<boolean>(false);
  const toggleCalendar = () => {
    setShowCalendar(!showCalendar);
  };

  const [confirmPassword, setConfirmPassword] = useState("");
  const [toggle, setToggle] = useState<string>();

  /* Handles the toggle for the user id type selection and the role */
  const handleIdTypeToggle = (value: string) => {
    if (toggle !== value) {
      setToggle(value);
    } else {
      setToggle("");
    }
  };

  const secondaryColor = useThemeColor({}, "secondaryColor");
  const highlight = useThemeColor({}, "highlight");
  const text = useThemeColor({}, "text");
  const innerBackground = useThemeColor({}, "innerBackground");
  const textinput = useThemeColor({}, "textinput");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const icon = useThemeColor({}, "icon");

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView
        style={[styles.mainContainer, { backgroundColor: secondaryColor }]}
      >
        {/* View contains the contents to create and manage adding a new employee */}
        <View style={styles.addEmployeeContainer}>
          <Text>Onboard new employee</Text>
          {/* Contains the employees first and last name */}
          <ScrollView style={styles.container}>
            <View
              style={{
                flexDirection: "column",
              }}
            >
              <Text style={[styles.subheaderTexts, { color: text }]}>
                Employee details
              </Text>
              <TextInputComponent
                placeholder="First name"
                text="first_name"
                value={employees?.first_name}
                setValue={(value) =>
                  handleAddEmployeeInput("first_name", value)
                }
              />
              <TextInputComponent
                placeholder="last name"
                text="last_name"
                value={employees?.last_name}
                setValue={(value) => handleAddEmployeeInput("last_name", value)}
              />
              <TextInputComponent
                placeholder="Email"
                text="email"
                value={employees?.email}
                setValue={(value) => handleAddEmployeeInput("email", value)}
              />
              <TextInputComponent
                placeholder="Phone number"
                text="phoneNumber"
                value={employees?.phoneNumber}
                setValue={(value) =>
                  handleAddEmployeeInput("phoneNumber", value)
                }
              />

              {/* Contains the view for the date of birth.
                When clicked, the view will display a popup of the calender */}
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={{ flexGrow: 1 }}>
                  <TextInputComponent
                    placeholder="  YYYY-MM-DD"
                    text="date of birth"
                    value={employees?.dob}
                    setValue={(value) => handleAddEmployeeInput("dob", value)}
                  />
                </View>

                <Pressable
                  style={{
                    padding: 2,
                    borderRadius: 5,
                    marginTop: 5,
                  }}
                  onPress={toggleCalendar}
                >
                  <AntDesign name="calendar" size={24} color={textinput} />
                </Pressable>
              </View>
            </View>

            {/* Conditonally render the calender display when the button is clicked */}
            {showCalendar && (
              <View style={{ width: 150, zIndex: 100 }}>
                <CustomCalendar onSelectDate={toggleCalendar} />
              </View>
            )}

            {/* View renders the  dropdowns used to manage the selection of 
              The new employees id choice, and the role the employee would be playing.
              
              */}
            <View>
              {/* These views contains the buttons to toggle a dropdown which will h=be held in the same view component */}
              <View
                style={[
                  styles.buttonContainer,
                  { backgroundColor: innerBackground },
                ]}
              >
                <Pressable
                  style={[styles.buttons, { backgroundColor: inactivebtn }]}
                  onPress={() => handleIdTypeToggle("idType")}
                >
                  <AntDesign name="idcard" size={24} color={icon} />
                  <Text style={[styles.buttonText, { color: text }]}>
                    {employees?.id_type ? employees.id_type : "choose id"}
                  </Text>
                  <AntDesign
                    name={toggle === "idType" ? "up" : "down"}
                    size={18}
                    color="black"
                  />
                </Pressable>

                {/* Conditionally render the id types provided when the user toggles the button */}
                {toggle === "idType" && (
                  <View style={styles.dropdownContainer}>
                    {idType.map((id, index) => (
                      <Pressable
                        key={index}
                        onPress={() => {
                          handleAddEmployeeInput("id_type", id);
                        }}
                        style={[
                          styles.dropdownbuttons,
                          { backgroundColor: inactivebtn },
                        ]}
                      >
                        <Text style={[styles.dropdownText, { color: text }]}>
                          {id}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>

              {/* Contains the roles */}
              <View
                style={[
                  styles.buttonContainer,
                  { backgroundColor: innerBackground },
                ]}
              >
                <Pressable
                  style={[styles.buttons, { backgroundColor: inactivebtn }]}
                  onPress={() => handleIdTypeToggle("job title")}
                >
                  <MaterialIcons name="work" size={24} color={icon} />
                  <Text style={styles.buttonText}>
                    {employees ? employees.role : "role"}
                  </Text>
                  <AntDesign name="down" size={18} color="black" />
                </Pressable>

                {/* Conditionally render the roles when the boolean is true which means the user has toggled the button */}
                {toggle === "job title" && (
                  <View style={styles.dropdownContainer}>
                    {titled.map((title, index) => (
                      <Pressable
                        key={index}
                        onPress={() => {
                          handleAddEmployeeInput("role", title);
                        }}
                        style={[
                          styles.dropdownbuttons,
                          { backgroundColor: inactivebtn },
                        ]}
                      >
                        <Text style={[styles.dropdownText, { color: text }]}>
                          {title}
                        </Text>
                      </Pressable>
                    ))}
                  </View>
                )}
              </View>
            </View>

            <View style={{ width: "100%" }}>
              <View>
                <TextInputComponent
                  placeholder="Password"
                  text="password"
                  value={employees?.password}
                  setValue={(value) =>
                    handleAddEmployeeInput("password", value)
                  }
                />
              </View>
              <View>
                <TextInputComponent
                  placeholder="Confirm password"
                  text="confirm password"
                  value={confirmPassword}
                />
              </View>
            </View>

            {employees?.password !== confirmPassword && (
              <Text style={{ fontSize: 10, color: "red" }}>
                password does not match
              </Text>
            )}

            {error && (
              <View>
                <Text>{error.email}</Text>
              </View>
            )}

            <SubmitButtonComponent
              title="create new staff"
              onPress={submitEmployee}
            />
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default AddEmployeeComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
  },

  addEmployeeContainer: {
    flex: 2,
    padding: 5,
    alignItems: "center",
  },

  container: {
    width: "100%",
    padding: 10,
    flex: 1,
    marginVertical: 10,
  },

  namesContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  input: {
    flex: 1,
    padding: 8,
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    borderWidth: 1,
    borderRadius: 5,
    marginHorizontal: 5,
    marginVertical: 5,
    elevation: 10,
    shadowRadius: 10,
  },

  buttons: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#0e609a",
  },

  buttonContainer: {
    borderRadius: 5,
    borderWidth: 1,
    marginVertical: 10,
    alignItems: "center",
  },

  buttonText: {
    color: "white",
    textTransform: "capitalize",
    fontFamily: "RobotoRegular",
    fontWeight: "bold",
    fontSize: 13,
  },

  dropdownContainer: {
    width: "100%",
    alignItems: "center",
    padding: 10,
  },

  dropdownbuttons: {
    padding: 10,
    width: "100%",
    borderWidth: 0.3,
    marginVertical: 2,
  },

  dropdownText: {
    textTransform: "capitalize",
    fontFamily: "RobotoRegular",
    fontWeight: "bold",
    fontSize: 13,
  },

  subheaderTexts: {
    fontSize: 15,
    fontWeight: "light",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    padding: 5,
    marginVertical: 10,
    alignSelf: "center",
  },

  createButton: {
    width: "100%",
    padding: Platform.OS === "web" ? 10 : 14,
    borderRadius: 5,
    marginVertical: 10,
    alignItems: "center",
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.5,
    borderWidth: 2,
    marginTop: 20,
  },

  createButtonText: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    color: "white",
  },
});
