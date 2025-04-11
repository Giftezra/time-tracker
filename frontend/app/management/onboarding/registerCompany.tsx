import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect } from "react";
import RegistrationTextInputComponent from "@/app/component/helper/registrationTextinput";
import { useAuth } from "@/app/authentication";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  bounceText,
  textbounce,
} from "@/app/utils/animations/onboardingAnimation";

const RegisterCompanyComponent = () => {
  const { ownerData, handleUserInput } = useAuth();

  const backgroundColor = useThemeColor({}, "textinput");
  const buttonColor = useThemeColor({}, "inactivebtn");

  useEffect(() => {
    bounceText();
  }, []);

  return (
    <SafeAreaProvider
      style={[{ flex: 1 }, { backgroundColor: backgroundColor }]}
    >
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ScrollView
            style={{ flexGrow: 1, padding: 10 }}
            showsVerticalScrollIndicator={false}
          >
            <View style={{ padding: 5, flexWrap: "wrap" }}>
              <Text
                style={{
                  fontFamily: "RobotoRegular",
                  fontSize: 15,
                  fontWeight: "400",
                  fontVariant: ["contextual"],
                  padding: 1,
                }}
              >
                thank you for choosing to manage your staffs on time trackr. for
                the best expierience, simply add your organisations details
                below or skip to register later.
              </Text>

              <Text
                style={{
                  padding: 2,
                  fontSize: 12,
                  fontFamily: "RobotoLight",
                  fontVariant: ["oldstyle-nums"],
                  marginTop: 5,
                }}
              >
                please note that all fields are required as this would help us
                serve you better. enter n/a for fields that you do not have.
              </Text>

              <Text
                style={{
                  padding: 2,
                  fontSize: 12,
                  fontFamily: "RobotoLight",
                  fontVariant: ["oldstyle-nums"],
                  marginTop: 5,
                }}
              >
                to complete this form in a later time, scroll down and click
                continue later
              </Text>
            </View>

            <View style={styles.containers}>
              <Text style={styles.headerText}>company name</Text>
              <RegistrationTextInputComponent
                placeholder="Vhotis.inc"
                value={ownerData?.company_name}
                setValue={(value) => handleUserInput("company_name", value)}
                inputMode="text"
              />
            </View>

            <View style={styles.containers}>
              <Text style={styles.headerText}>company reg no</Text>
              <RegistrationTextInputComponent
                placeholder="Rc123456"
                value={ownerData?.company_registration_number}
                setValue={(value) =>
                  handleUserInput("company_registration_number", value)
                }
                inputMode="text"
              />
            </View>

            <View style={styles.containers}>
              <Text style={styles.headerText}>company email</Text>
              <RegistrationTextInputComponent
                placeholder="Email"
                value={ownerData?.comapny_email}
                setValue={(value) => handleUserInput("company_email", value)}
                inputMode="text"
              />
            </View>

            <View style={styles.containers}>
              <Text style={styles.headerText}>company address</Text>
              <RegistrationTextInputComponent
                placeholder="Email"
                value={ownerData?.company_address}
                setValue={(value) => handleUserInput("company_address", value)}
                inputMode="text"
              />
            </View>

            <View style={{ padding: 5, justifyContent: "center" }}>
              <Text
                style={{
                  fontFamily: "RobotoRegular",
                  fontSize: 12,
                  fontWeight: "300",
                  textTransform: "lowercase",
                  color: "gray",
                  marginVertical: 5,
                }}
              >
                enter your current office address or enter n/a if you currently
                do not have an office space
              </Text>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <View style={styles.containers}>
                  <Text style={styles.headerText}>office address</Text>
                  <RegistrationTextInputComponent
                    placeholder="21 vhotis street"
                    value={ownerData?.company_address}
                    setValue={(value) =>
                      handleUserInput("company_address", value)
                    }
                    inputMode="text"
                  />
                </View>
                <Pressable style={styles.findAddressBtn}>
                  <Text style={styles.findAddressText}>find address</Text>
                </Pressable>
              </View>
            </View>

            <View style={styles.containers}>
              <Text style={styles.headerText}>company helpline</Text>
              <RegistrationTextInputComponent
                placeholder="08012345678"
                value={ownerData?.company_helpline}
                setValue={(value) => handleUserInput("company_helpline", value)}
                inputMode="text"
              />
            </View>

            <View style={styles.containers}>
              <Text style={styles.headerText}>company website</Text>
              <RegistrationTextInputComponent
                placeholder="www.vhotis.com"
                value={ownerData?.company_website}
                setValue={(value) => handleUserInput("company_website", value)}
                inputMode="text"
              />
            </View>

            <View style={styles.containers}>
              <Text style={styles.headerText}>company services</Text>
              <RegistrationTextInputComponent
                placeholder="services"
                value={ownerData?.company_services}
                setValue={(value) => handleUserInput("company_services", value)}
                inputMode="text"
              />
            </View>

            {/* Use the expo router to replace the screen and route the user to the login page */}
            <Pressable
              onPress={() => router.replace("/management/onboarding/login")}
              style={{
                padding: 10,
              }}
            >
              <Animated.Text
                style={{
                  fontFamily: "BarlowRegular",
                  fontSize: 15,
                  fontWeight: "400",
                  textTransform: "lowercase",
                  color: "blue",
                }}
              >
                continue later
              </Animated.Text>
            </Pressable>

            {/* Submit button saves the user details if provided. and routes the user to the login page*/}
            <TouchableOpacity
              style={[
                styles.submitBtn,
                { backgroundColor: buttonColor, shadowColor: backgroundColor },
              ]}
            >
              <Animated.Text
                style={[
                  {
                    transform: [{ translateY: textbounce }],
                    ...styles.submitText,
                    color: backgroundColor,
                    shadowColor: buttonColor,
                  },
                ]}
              >
                submit
              </Animated.Text>
            </TouchableOpacity>
          </ScrollView>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default RegisterCompanyComponent;

const styles = StyleSheet.create({
  headerText: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    fontWeight: "400",
    fontVariant: ["contextual"],
    padding: 1,
    textShadowOffset: { width: 0.2, height: 0.1 },
    textTransform: "capitalize",
    marginBottom: 5,
  },

  containers: {
    flex: 1,
    padding: 2,
    marginVertical: 5,
  },

  findAddressBtn: {
    padding: 10,
    justifyContent: "center",
    alignItems: "center",
  },

  findAddressText: {
    textTransform: "capitalize",
    fontFamily: "BarlowRegular",
    fontSize: 15,
  },

  submitBtn: {
    padding: Platform.OS === "web" ? 10 : 15,
    justifyContent: "center",
    alignItems: "center",
    borderRadius: 5,
    marginVertical: 10,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },

  submitText: {
    textTransform: "capitalize",
    fontFamily: "BarlowRegular",
    fontSize: 15,
    fontWeight: 600,
    elevation: 5,
    shadowRadius: 5,
    shadowOpacity: 0.8,
  },
});
