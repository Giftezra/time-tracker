import {
  ActivityIndicator,
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { SafeAreaView } from "react-native-safe-area-context";
import { useLoadedFonts } from "@/hooks/useLoadedFonts";
import { router } from "expo-router";

import { OwnerOnboardingType } from "@/app/types/management/onboarding";
import RegistrationTextInputComponent from "@/app/component/helper/registrationTextinput";
import ArrowButtonComponent from "@/app/component/helper/arrowButton";
import { useAuth } from "@/app/authentication";
import CalendarComponent from "@/app/component/helper/customCalendar";
import { tranY } from "@/app/utils/animations/onboardingAnimation";

/**
 * Component for the main admin registration page
 */

const RegistrationComponent = () => {
  const {
    ownerData,
    handleUserInput,
    handleDateInput,
    dateClicked,
    setDateClicked,
  } = useAuth();

  return (
    <SafeAreaView style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ScrollView
            style={styles.mainContainer}
            showsVerticalScrollIndicator={false}
          >
            <View
              style={{
                justifyContent: "center",
                alignItems: "center",
                padding: 5,
                marginVertical: 10,
              }}
            >
              <Text style={{ fontFamily: "SpaceMonoRegular" }}>Hello</Text>
            </View>
            <Text
              style={{
                fontFamily: "SpaceMonoRegular",
                fontSize: 20,
                fontWeight: "400",
                textTransform: "capitalize",
              }}
            >
              Thank you for using time trackr to manage your company
            </Text>
            <View style={{ padding: 2, marginTop: 20, marginVertical: 10 }}>
              <View
                style={{
                  flexDirection: "row",
                  justifyContent: "center",
                  alignItems: "center",
                  columnGap: 5,
                }}
              >
                <Text
                  style={{
                    fontFamily: "RobotoRegular",
                    fontSize: 14,
                    fontWeight: "400",
                    textTransform: "lowercase",
                    alignItems: "center",
                  }}
                >
                  To continue, provide the details below
                </Text>

                {/* Animate the dropdown arrow */}
                <Animated.View style={{ transform: [{ translateY: tranY }] }}>
                  <AntDesign name="arrowdown" size={12} color="black" />
                </Animated.View>
              </View>
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
                  placeholder="phone number"
                  value={ownerData?.phone}
                  setValue={(value) => handleUserInput("phone", value)}
                  inputMode="numeric"
                  keyboardType="phone-pad"
                  autoComplete="tel"
                />
              </View>

              {dateClicked && (
                <CalendarComponent onSelectDate={handleDateInput} />
              )}

              <View style={{ padding: 10, marginBottom: 10 }}>
                <Text style={styles.headerText}>date of birth</Text>
                <View
                  style={{
                    flexDirection: "row",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <RegistrationTextInputComponent
                      placeholder="YYYY-MM-DD"
                      value={ownerData?.dob}
                      setValue={(value) => handleUserInput("dob", value)}
                      inputMode="numeric"
                      keyboardType="numeric"
                      autoComplete="birthdate-full"
                    />
                  </View>
                  <Pressable
                    style={{ padding: 5 }}
                    onPress={() => setDateClicked(!dateClicked)}
                  >
                    <MaterialIcons
                      name="calendar-month"
                      size={24}
                      color="black"
                    />
                  </Pressable>
                </View>
              </View>
            </View>

            <ArrowButtonComponent
              onPress={() =>
                router.push("/management/onboarding/registrationAddressPage")
              }
              title="next"
            />
          </ScrollView>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

export default RegistrationComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 2,
    marginBottom: 10,
  },

  headerText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    textShadowOffset: { width: 0.2, height: 0.2 },
    textShadowColor: "black",
    padding: 5,
    marginStart: 5,
  },
});
