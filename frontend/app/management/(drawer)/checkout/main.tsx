import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import OwnerAddressComponent from "@/app/component/management/checkout/ownerAddress";
import BillingAddressComponent from "@/app/component/management/checkout/billingAddress";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { ScrollView } from "react-native-gesture-handler";
import PaymentComponent from "@/app/component/management/checkout/payment";
import { useCheckout } from "@/app/context/management/checkout/checkoutContext";
import SideComponent from "@/app/component/helper/sideComponent";
import { useAuth } from "@/app/context/management/authentication";
import { StripeProvider } from "@stripe/stripe-react-native";

const MainCheckoutPage = () => {
  console.log("MainCheckoutPage rendered");
  const { windowWidth } = useAuth();
  const { isChecked, publishableKey } = useCheckout();

  const sidebarWidth = windowWidth * 0.2;
  const mainContentWidth = windowWidth * 0.8;

  return (
    <StripeProvider publishableKey={publishableKey} urlScheme="time-tracker">
      <SafeAreaProvider style={styles.safeArea}>
        <View style={[styles.maincontainer, { width: windowWidth }]}>
          {/* Only display the sidebar on web */}

          {Platform.OS === "web" && (
            <View style={[styles.sidebar, { width: sidebarWidth }]}>
              <SideComponent />
            </View>
          )}

          <View style={[styles.mainContent, { width: mainContentWidth }]}>
            <ScrollView
              style={styles.scrollView}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.scrollViewContent}
            >
              <Text style={styles.addressText}>address</Text>

              <View style={styles.componentContainer}>
                <OwnerAddressComponent />
              </View>

              {!isChecked && (
                <View style={styles.componentContainer}>
                  <BillingAddressComponent />
                </View>
              )}

              <View style={styles.componentContainer}>
                <PaymentComponent />
              </View>

              <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                  <Text style={styles.buttonText}>Pay Now</Text>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </SafeAreaProvider>
    </StripeProvider>
  );
};

export default MainCheckoutPage;

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
  },
  maincontainer: {
    flex: 1,
    flexDirection: "row",
  },
  sidebar: {
    flex: 1,
  },
  mainContent: {
    flex: 4,
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    padding: 20,
    paddingBottom: 40,
  },
  componentContainer: {
    marginBottom: 20,
  },
  addressText: {
    fontSize: 24,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 20,
    paddingHorizontal: 10,
  },
  button: {
    backgroundColor: "#000",
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
  },
});
