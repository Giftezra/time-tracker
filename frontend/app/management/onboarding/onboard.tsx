/**
 * The onboarding page displays the sign in and sign up options for the user to
 * select.
 * The page takes the user to the chosen page to complete thier authentication process.
 *
 */

import {
  ActivityIndicator,
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { router } from "expo-router";
import MobileLandingPage from "@/app/component/helper/onboarding/MobileLandingPage";
const OnboardingPageComponent = () => {
  return (
    <View style={styles.mainContainer}>
      {Platform.OS === "web" ? (
        <View style={styles.container}>
          <Text>Hello</Text>
        </View>
      ) : (
        <View style={styles.container}>
          <MobileLandingPage />
        </View>
      )}
    </View>
  );
};

export default OnboardingPageComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
  },

  container: {
    flex: 1,
    width: "100%",
  },

  buttons: {
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
    borderRadius: 5,
    minWidth: Platform.OS === "web" ? 150 : 150,
    justifyContent: "center",
    marginVertical: 10,
    backgroundColor: "#fff",
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.4,
  },

  buttoText: {
    fontSize: Platform.OS === "web" ? 12 : 15,
    fontFamily: "OswaldVariable",
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
