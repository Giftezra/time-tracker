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

const OnboardingPage = () => {
  return (
    <View style={styles.mainContainer}>
      <View style={styles.container}>
        <TouchableOpacity
          style={styles.buttons}
          onPress={() => router.push('/management/onboarding/login')}
        >
          <Text style={styles.buttoText}>sign in</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.buttons}
          onPress={() => router.push('/management/onboarding/registration')}
        >
          <Text style={styles.buttoText}>sign up</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default OnboardingPage;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  container: {
    justifyContent: "center",
    alignItems: "center",
    padding: 30,
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
