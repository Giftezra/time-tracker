import {
  KeyboardAvoidingView,
  Modal,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useAuth } from "@/app/authentication";
import RegistrationTextInputComponent from "@/app/component/helper/registrationTextinput";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import ArrowButtonComponent from "@/app/component/helper/arrowButton";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";

const RegistrationAddressPage = () => {
  const { ownerData, handleUserInput, onboardOwner, registrationMessage, findAddresses, selectAddress, addresses, isLoading, isAddressVisible, isAddressModalVisible } =
    useAuth();

  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const [isConfirmPasswordVisible, setIsConfirmPasswordVisible] =
    useState(false);
  const [confirmPassword, setConfirmPassword] = useState<string>();
  const [enteraddress, setEnterAddress] = useState<boolean>(false);
  const [error, setError] = useState<string[]>([]);

  const togglePasswordVisibility = () => {
    setIsPasswordVisible(!isPasswordVisible);
  };

  const toggleConfirmPasswordVisibility = () => {
    setIsConfirmPasswordVisible(!isConfirmPasswordVisible);
  };

  /**
   * Handle the input validation for the registration form
   * Ensure there are no errors and the owner data is complete before registering
   * the owner
   */
  const handleInputValidation = () => {
    const newErrors: string[] = [];
    if (!ownerData?.password) {
      newErrors.push("Password is required");
    }
    if (ownerData?.postcode?.trim() === "") {
      newErrors.push("Postcode is required");
    }
    if (ownerData?.address?.trim() === "") {
      newErrors.push("Address is required");
    }
    if (ownerData?.city?.trim() === "") {
      newErrors.push("City is required");
    }

    setError(newErrors);

    if (newErrors.length === 0 && ownerData) {
      onboardOwner(ownerData);
    }
  };

  return (
    <SafeAreaProvider style={styles.safeArea}>
      <KeyboardAvoidingView style={styles.container}>
        <GestureHandlerRootView style={styles.gestureContainer}>
          <ScrollView
            style={styles.scrollView}
            showsHorizontalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.welcomeText}>
                Welcome aboard,{" "}
                <Text style={styles.nameHighlight}>
                  {ownerData?.first_name}
                </Text>
              </Text>
              <Text style={styles.subText}>
                Please provide your address details to continue
              </Text>
            </View>

            <View style={styles.formSection}>
              <View style={styles.inputGroup}>
                <Text style={styles.labelText}>Postcode</Text>
                <View style={styles.postcodeContainer}>
                  <View style={styles.postcodeInput}>
                    <RegistrationTextInputComponent
                      placeholder="Enter your postcode"
                      value={ownerData?.postcode}
                      setValue={(value) => handleUserInput("postcode", value)}
                      autoComplete="postal-code"
                    />
                  </View>
                  <TouchableOpacity style={styles.findAddressButton} onPress={() => findAddresses(ownerData?.postcode ?? "")}>
                    <Text style={styles.findAddressText}>Find Address</Text>
                  </TouchableOpacity>
                </View>
                <Pressable
                  onPress={() => setEnterAddress(!enteraddress)}
                  style={styles.manualEntryButton}
                >
                  <Text style={styles.manualEntryText}>
                    Enter address manually
                  </Text>
                </Pressable>
              </View>

              {enteraddress && (
                <View style={styles.manualAddressContainer}>
                  <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>Address Line 1</Text>
                    <RegistrationTextInputComponent
                      placeholder="Enter your street address"
                      value={ownerData?.address}
                      setValue={(value) => handleUserInput("address1", value)}
                      inputMode="text"
                      autoComplete="address-line1"
                    />
                  </View>

                  <View style={styles.inputGroup}>
                    <Text style={styles.labelText}>City</Text>
                    <RegistrationTextInputComponent
                      placeholder="Enter your city"
                      value={ownerData?.city}
                      setValue={(value) => handleUserInput("city", value)}
                      autoComplete="address-line2"
                      inputMode="text"
                    />
                  </View>
                </View>
              )}

              <View style={styles.inputGroup}>
                <Text style={styles.labelText}>Password</Text>
                <View style={styles.passwordContainer}>
                  <View style={styles.passwordInput}>
                    <RegistrationTextInputComponent
                      placeholder="Create a password"
                      value={ownerData?.password}
                      setValue={(value) => handleUserInput("password", value)}
                      inputMode="text"
                      secureTextEntry={isPasswordVisible}
                    />
                  </View>
                  <Pressable
                    style={styles.eyeIcon}
                    onPress={togglePasswordVisibility}
                  >
                    <MaterialCommunityIcons
                      name={isPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>
              </View>

              <View style={styles.inputGroup}>
                <Text style={styles.labelText}>Confirm Password</Text>
                <View style={styles.passwordContainer}>
                  <View style={styles.passwordInput}>
                    <RegistrationTextInputComponent
                      placeholder="Confirm your password"
                      value={confirmPassword}
                      setValue={(value) => setConfirmPassword(value)}
                      inputMode="text"
                      secureTextEntry={isConfirmPasswordVisible}
                    />
                  </View>
                  <Pressable
                    style={styles.eyeIcon}
                    onPress={toggleConfirmPasswordVisibility}
                  >
                    <MaterialCommunityIcons
                      name={isConfirmPasswordVisible ? "eye-off" : "eye"}
                      size={24}
                      color="#6B7280"
                    />
                  </Pressable>
                </View>

                <View style={styles.passwordRequirements}>
                  <Text
                    style={[
                      styles.requirementText,
                      {
                        color:
                          (ownerData?.password?.length ?? 0) >= 8
                            ? "#059669"
                            : "#DC2626",
                      },
                    ]}
                  >
                    • Must be at least 8 characters long
                  </Text>
                  <Text
                    style={[
                      styles.requirementText,
                      {
                        color:
                          /\d/.test(ownerData?.password ?? "") &&
                          /[a-zA-Z]/.test(ownerData?.password ?? "")
                            ? "#059669"
                            : "#DC2626",
                      },
                    ]}
                  >
                    • Must contain both letters and numbers
                  </Text>
                </View>

                {ownerData?.password !== confirmPassword && (
                  <Text style={styles.passwordMismatch}>
                    Passwords do not match
                  </Text>
                )}
              </View>
            </View>

            {ownerData?.password === confirmPassword && ownerData && (
              <View style={styles.buttonContainer}>
                <ArrowButtonComponent
                  onPress={handleInputValidation}
                  title="Create Account"
                />
              </View>
            )}
          </ScrollView>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default RegistrationAddressPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#FFFFFF",
  },
  container: {
    flex: 1,
  },
  gestureContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  headerContainer: {
    padding: 24,
    backgroundColor: "#F9FAFB",
    borderBottomWidth: 1,
    borderBottomColor: "#E5E7EB",
  },
  welcomeText: {
    fontSize: 24,
    fontFamily: "BarlowRegular",
    color: "#111827",
    marginBottom: 8,
  },
  nameHighlight: {
    fontSize: 24,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
    color: "#2563EB",
  },
  subText: {
    fontSize: 16,
    fontFamily: "BarlowRegular",
    color: "#6B7280",
  },
  formSection: {
    padding: 24,
  },
  inputGroup: {
    marginBottom: 24,
  },
  labelText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    color: "#374151",
    marginBottom: 8,
    textTransform: "capitalize",
  },
  postcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  postcodeInput: {
    flex: 1,
  },
  findAddressButton: {
    backgroundColor: "#2563EB",
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 8,
  },
  findAddressText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  },
  manualEntryButton: {
    marginTop: 12,
  },
  manualEntryText: {
    color: "#2563EB",
    fontSize: 14,
    fontFamily: "BarlowRegular",
  },
  manualAddressContainer: {
    marginTop: 24,
  },
  passwordContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  passwordInput: {
    flex: 1,
  },
  eyeIcon: {
    padding: 12,
  },
  passwordRequirements: {
    marginTop: 12,
  },
  requirementText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    marginBottom: 4,
  },
  passwordMismatch: {
    color: "#DC2626",
    fontSize: 14,
    fontFamily: "BarlowRegular",
    marginTop: 8,
  },
  buttonContainer: {
    padding: 24,
    paddingTop: 0,
  },
});
