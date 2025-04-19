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
import TextInputComponent from "@/app/component/helper/textInput";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import SubmitButtonComponent from "@/app/component/helper/submitButton";
import { useEmployeeContext } from "@/app/context/management/employee/employeeContext";
import validateDateInput from "@/app/utils/helpers/dateValidation";

const titled = ["admin", "staff"];

const AddEmployeeComponent = ({setIsModalOpen}:{setIsModalOpen: (isModalOpen: boolean) => void}) => {
  const {
    newEmployee,
    handleAddEmployeeInput,
    error,
    onboardNemEmployee,
    setAlertConfig,
    setIsAlertVisible,
  } = useEmployeeContext();
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [toggle, setToggle] = useState<string>("");

  /* Handles the toggle for the user id type selection and the role */
  const handleIdTypeToggle = (value: string) => {
    if (toggle !== value) {
      setToggle(value);
    } else {
      setToggle("");
    }
  };

  /* Handle the submit button to ensure all the fields are filled.
   * Validate the names, email, phone number, password and confirm password.
   * Ensure these fields are not empty and display an array of error if any of the fields are empty.
   */
  const handleSubmit = async () => {
    const errors = [];
    if (!newEmployee?.first_name) {
      errors.push("First name is required");
    }
    if (!newEmployee?.last_name) {
      errors.push("Last name is required");
    }
    if (!newEmployee?.email) {
      errors.push("Email is required");
    }
    if (!newEmployee?.phone || !newEmployee?.phone.includes("+")) {
      errors.push("Phone number is required and must include a country code");
    }
    if (!newEmployee?.password) {
      errors.push("Password is required");
    }
    if (!newEmployee?.dob) {
      errors.push("Date of birth is required");
    }
    if (!newEmployee?.address) {
      errors.push("Address is required");
    }
    if (!newEmployee?.city) {
      errors.push("City is required");
    }
    if (!newEmployee?.postcode) {
      errors.push("Postcode is required");
    }
    if (!newEmployee?.country) {
      errors.push("Country is required");
    }
    // Display the errors in an alert if any of the fields are empty
    // If there are validation errors, show them in the alert
    if (errors.length > 0) {
      setAlertConfig({
        title: "Validation Error",
        message: errors.join("\n"),
        onConfirm: () => {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
      setIsAlertVisible(true);
      return;
    }
    // If validation passes, show confirmation dialog
    setAlertConfig({
      title: "Registration Information",
      message: `You are about to register ${newEmployee?.first_name} ${newEmployee?.last_name}. Please ensure the details are correct before submitting. \n Email: ${newEmployee?.email} \n Phone: ${newEmployee?.phone} \n Role: ${newEmployee?.role} \n `,
      onConfirm: async () => {
        await onboardNemEmployee();
        setIsAlertVisible(false);
        setIsModalOpen(false);
      },
      isVisible: true,
    });
    setIsAlertVisible(true);
  };

  const text = useThemeColor({}, "text");
  const innerBackground = useThemeColor({}, "innerBackground");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const icon = useThemeColor({}, "icon");

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={styles.mainContainer}>
        <View style={styles.addEmployeeContainer}>
          <Text style={styles.headerText}>Onboard New Employee</Text>
          <ScrollView
            style={styles.container}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formSection}>
              <Text style={[styles.sectionHeader, { color: text }]}>
                Employee Details
              </Text>
              <View style={styles.inputGroup}>
                <View style={styles.row}>
                  <View style={styles.column}>
                    <TextInputComponent
                      placeholder="First name"
                      text="first_name"
                      value={newEmployee?.first_name}
                      setValue={(value) =>
                        handleAddEmployeeInput("first_name", value)
                      }
                    />
                  </View>
                  <View style={styles.column}>
                    <TextInputComponent
                      placeholder="Last name"
                      text="last_name"
                      value={newEmployee?.last_name}
                      setValue={(value) =>
                        handleAddEmployeeInput("last_name", value)
                      }
                    />
                  </View>
                </View>

                <TextInputComponent
                  placeholder="Email"
                  text="email"
                  value={newEmployee?.email}
                  setValue={(value) => handleAddEmployeeInput("email", value)}
                />
                <TextInputComponent
                  placeholder="+44"
                  text="phone"
                  value={newEmployee?.phone}
                  setValue={(value) => handleAddEmployeeInput("phone", value)}
                />
                <TextInputComponent
                  placeholder="YYYY-MM-DD"
                  text="date of birth"
                  value={newEmployee?.dob}
                  setValue={(value) => {
                    const formattedDate = validateDateInput(value);
                    handleAddEmployeeInput("dob", formattedDate);
                  }}
                />
              </View>
            </View>

            {/* Replace the Role & Employment Type section with just Role */}
            <View style={styles.formSection}>
              <Text style={[styles.sectionHeader, { color: "#000" }]}>
                Role
              </Text>
              <View style={styles.inputGroup}>
                {/* Contains the dropdown for the role  */}
                <View
                  style={[
                    styles.selectContainer,
                    { backgroundColor: innerBackground },
                  ]}
                >
                  <Pressable
                    style={[
                      styles.selectButton,
                      { backgroundColor: inactivebtn },
                    ]}
                    onPress={() => handleIdTypeToggle("job title")}
                  >
                    <View style={styles.selectButtonContent}>
                      <MaterialIcons name="work" size={20} color={text} />
                      <Text style={[styles.selectButtonText, { color: text }]}>
                        {newEmployee?.role ? newEmployee.role : "Select Role"}
                      </Text>
                    </View>
                  </Pressable>

                  {toggle === "job title" && (
                    <View style={styles.dropdownContainer}>
                      {titled.map((title, index) => (
                        <Pressable
                          key={index}
                          onPress={() => {
                            handleAddEmployeeInput("role", title);
                            handleIdTypeToggle("job title");
                          }}
                          style={[
                            styles.dropdownItem,
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
            </View>

            {/* Add new Address section */}
            <View style={styles.formSection}>
              <Text style={[styles.sectionHeader, { color: "#000" }]}>
                Address
              </Text>
              <View style={styles.inputGroup}>
                <TextInputComponent
                  placeholder="Address"
                  text="address"
                  value={newEmployee?.address}
                  setValue={(value) => handleAddEmployeeInput("address", value)}
                />
                <View style={styles.row}>
                  <View style={styles.column}>
                    <TextInputComponent
                      placeholder="City"
                      text="city"
                      value={newEmployee?.city}
                      setValue={(value) =>
                        handleAddEmployeeInput("city", value)
                      }
                    />
                  </View>
                  <View style={styles.column}>
                    <TextInputComponent
                      placeholder="Postcode"
                      text="postcode"
                      value={newEmployee?.postcode}
                      setValue={(value) =>
                        handleAddEmployeeInput("postcode", value)
                      }
                      uppercase={true}
                    />
                  </View>
                </View>
                <TextInputComponent
                  placeholder="Country"
                  text="country"
                  value={newEmployee?.country}
                  setValue={(value) => handleAddEmployeeInput("country", value)}
                />
              </View>
            </View>

            <View style={styles.formSection}>
              <Text style={[styles.sectionHeader, { color: "#000" }]}>
                Security
              </Text>
              <View style={styles.inputGroup}>
                <TextInputComponent
                  placeholder="Password"
                  text="password"
                  value={newEmployee?.password}
                  setValue={(value) =>
                    handleAddEmployeeInput("password", value)
                  }
                />
                <TextInputComponent
                  placeholder="Confirm password"
                  text="confirm password"
                  value={confirmPassword}
                  setValue={setConfirmPassword}
                />

                {newEmployee?.password !== confirmPassword && (
                  <Text style={styles.errorText}>Passwords do not match</Text>
                )}

                {error && (
                  <View style={styles.errorContainer}>
                    <Text style={styles.errorText}>{error.email}</Text>
                  </View>
                )}
              </View>
            </View>

            <View style={styles.submitContainer}>
              <SubmitButtonComponent
                title="Create New Employee"
                onPress={handleSubmit}
              />
            </View>
          </ScrollView>
        </View>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },

  addEmployeeContainer: {
    flex: 1,
    padding: 20,
    maxWidth: 800,
    width: "100%",
    alignSelf: "center",
  },

  container: {
    flex: 1,
  },

  headerText: {
    fontSize: 20,
    fontFamily: "BarlowMedium",
    marginBottom: 24,
    color: "#1a1a1a",
    textAlign: "center",
    letterSpacing: 0.5,
    fontWeight: "600",
    textTransform: "uppercase",
  },

  formSection: {
    marginBottom: 32,
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },

  sectionHeader: {
    fontSize: 15,
    fontFamily: "BarlowMedium",
    marginBottom: 20,
    fontWeight: "600",
    letterSpacing: 0.5,
  },

  inputGroup: {
    gap: 10,
  },

  row: {
    flexDirection: "row",
    gap: 16,
  },

  column: {
    flex: 1,
  },

  selectContainer: {
    borderRadius: 8,
    overflow: "hidden",
  },

  selectButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },

  selectButtonContent: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },

  selectButtonText: {
    fontSize: 15,
    fontFamily: "RobotoRegular",
    flex: 1,
  },

  dropdownContainer: {
    width: "100%",
    borderTopWidth: 1,
    borderTopColor: "#e1e1e1",
  },

  dropdownItem: {
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
  },

  dropdownText: {
    fontSize: 14,
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  errorContainer: {
    padding: 12,
    backgroundColor: "#fff1f0",
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#ffccc7",
  },

  errorText: {
    color: "#ff4d4f",
    fontSize: 14,
    fontFamily: "RobotoRegular",
  },

  submitContainer: {
    marginTop: 24,
    marginBottom: 40,
  },
});

export default AddEmployeeComponent;
