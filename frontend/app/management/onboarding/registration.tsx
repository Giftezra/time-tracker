import {
  Animated,
  KeyboardAvoidingView,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";

import RegistrationTextInputComponent from "@/app/component/helper/registrationTextinput";
import ArrowButtonComponent from "@/app/component/helper/arrowButton";
import { useAuth } from "@/app/authentication";
import { tranY } from "@/app/utils/animations/onboardingAnimation";
import SubtitleThemedText from "@/app/component/helper/SubtitleThemedText";
import AlertModal from "@/app/component/helper/AlertModal";
import validateDateInput from "@/app/utils/helpers/dateValidation";

/**
 * Component for the main admin registration page
 */

const RegistrationComponent = () => {
  const {
    ownerData,
    handleUserInput,
    isAlertModalVisible,
    alertConfig,
  } = useAuth();

  const [error, setError] = useState<string[]>([]);

  // Add validation function
  const isFormValid = () => {
    return (
      ownerData?.first_name?.trim() &&
      ownerData?.last_name?.trim() &&
      ownerData?.email?.trim() &&
      ownerData?.phone?.trim() &&
      ownerData?.dob?.trim() &&
      // Basic email validation
      /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(ownerData?.email)
    );
  };

  const handleInputValidation = () => {
    // Clear previous errors
    const newErrors: string[] = [];

    if (ownerData?.first_name?.trim() === "") {
      newErrors.push("First name is required");
    }
    if (ownerData?.last_name?.trim() === "") {
      newErrors.push("Last name is required");
    }
    if (ownerData?.email?.trim() === "") {
      newErrors.push("Email is required");
    }
    if (
      !ownerData?.phone ||
      ownerData.phone.trim() === "" ||
      !ownerData.phone.trim().includes("+")
    ) {
      newErrors.push("Please enter a valid phone number with country code");
    }
    if (
      !ownerData?.dob ||
      ownerData.dob.trim() === "" ||
      !/^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])$/.test(
        ownerData.dob.trim()
      )
    ) {
      newErrors.push("Please enter date in YYYY-MM-DD format");
    }

    setError(newErrors);

    // Only navigate if there are no errors
    if (newErrors.length === 0) {
      router.push("/management/onboarding/registrationAddressPage");
    }
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#ffffff" }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ScrollView
            style={styles.mainContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.welcomeContainer}>
              <Text style={styles.welcomeText}>Welcome to Time Trackr</Text>
              <SubtitleThemedText text="Let's set up your company account" />
            </View>

            <View style={styles.instructionContainer}>
              <Text style={styles.instructionText}>
                Please fill in your details below
              </Text>
              <Animated.View style={{ transform: [{ translateY: tranY }] }}>
                <AntDesign name="arrowdown" size={16} color="#4B5563" />
              </Animated.View>
            </View>

            {error.length > 0 && (
              <View style={{ padding: 10, marginBottom: 10 }}>
                {error.map((err, index) => (
                  <Text key={index} style={{ color: "red", marginBottom: 5 }}>
                    • {err}
                  </Text>
                ))}
              </View>
            )}

            <View style={styles.formSection}>
              <View style={{ padding: 10, marginTop: 10 }}>
                <Text style={styles.headerText}>First Name</Text>
                <RegistrationTextInputComponent
                  placeholder="first name"
                  value={ownerData?.first_name}
                  setValue={(value) => handleUserInput("first_name", value)}
                  inputMode="text"
                  autoComplete="given-name"
                />
              </View>
              <View style={{ padding: 10, marginBottom: 10 }}>
                <Text style={styles.headerText}>last name</Text>
                <RegistrationTextInputComponent
                  placeholder="last name"
                  value={ownerData?.last_name}
                  setValue={(value) => handleUserInput("last_name", value)}
                  inputMode="text"
                  autoComplete="family-name"
                />
              </View>

              <View style={{ padding: 10, marginBottom: 10 }}>
                <Text style={styles.headerText}>email</Text>
                <RegistrationTextInputComponent
                  placeholder="email"
                  value={ownerData?.email}
                  setValue={(value) => handleUserInput("email", value)}
                  inputMode="email"
                  keyboardType="email-address"
                  autoComplete="email"
                />
              </View>

              <View style={{ padding: 10, marginBottom: 10 }}>
                <Text style={styles.headerText}>phone</Text>
                <RegistrationTextInputComponent
                  placeholder="+44"
                  value={ownerData?.phone}
                  setValue={(value) => handleUserInput("phone", value)}
                  inputMode="numeric"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>

              <View style={{ padding: 10, marginBottom: 10 }}>
                <Text style={styles.headerText}>date of birth</Text>
                <View style={{ flex: 1 }}>
                  <RegistrationTextInputComponent
                    placeholder="YYYY-MM-DD"
                    value={ownerData?.dob}
                    setValue={(value) => {
                      const formattedDate = validateDateInput(value);
                      handleUserInput("dob", formattedDate);
                    }}
                    inputMode="numeric"
                    keyboardType="numeric"
                    autoComplete="birthdate-full"
                  />
                </View>
              </View>
            </View>

            <ArrowButtonComponent
              onPress={handleInputValidation}
              title="Continue"
              disabled={!isFormValid()}
            />
          </ScrollView>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
      <AlertModal
        isVisible={isAlertModalVisible}
        onConfirm={alertConfig.onConfirm}
        title={alertConfig.title}
        message={alertConfig.message}
      />
    </SafeAreaView>
  );
};

export default RegistrationComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 16,
    backgroundColor: "#ffffff",
  },

  headerText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    color: "#374151",
    marginBottom: 8,
  },

  welcomeContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 24,
    marginBottom: 32,
  },

  welcomeText: {
    fontSize: 24,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    color: "#111827",
    textAlign: "center",
    lineHeight: 32,
  },

  instructionContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 32,
    backgroundColor: "#F3F4F6",
    padding: 16,
    borderRadius: 8,
  },

  instructionText: {
    fontFamily: "BarlowRegular",
    fontSize: 16,
    color: "#4B5563",
    marginRight: 8,
  },

  formSection: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 2,
  },
});
