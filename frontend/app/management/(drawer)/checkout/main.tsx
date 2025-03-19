import {
  KeyboardAvoidingView,
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { SafeAreaProvider } from "react-native-safe-area-context";
import SideComponent from "@/app/component/helper/sideComponent";
import { useAuth } from "@/app/context/authentication";
import OwnerAddressComponent from "@/app/component/management/checkout/ownerAddress";
import BillingAddressComponent from "@/app/component/management/checkout/billingAddress";
import PaymentComponent from "@/app/component/management/checkout/payment";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useCheckout } from "@/app/context/management/checkout/checkoutContext";

const MainCheckoutComponent = () => {
  const activeBtn = useThemeColor({}, "activebtn");

  /* Export the width from the auth context */
  const { windowWidth } = useAuth();
  const { useOwnerAddress } = useCheckout();

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <KeyboardAvoidingView style={{ flex: 1 }}>
        {Platform.OS === "web" ? (
          <GestureHandlerRootView
            style={[styles.webMainContainer, { width: windowWidth }]}
          >
            {/* Side component container needs a width */}
            <View style={{ width: "20%" }}>
              <SideComponent />
            </View>

            {/* Main content container */}
            <ScrollView
              style={{ flex: 1, padding: 20 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.componentContainer}>
                <OwnerAddressComponent />
              </View>

              {/* Conditionally render the billing address component */}
              {!useOwnerAddress && (
                <View style={styles.componentContainer}>
                  <BillingAddressComponent />
                </View>
              )}

              <View style={styles.componentContainer}>
                <PaymentComponent />
              </View>

              {/* Submit button */}
              <Pressable
                style={[styles.submitButton, { backgroundColor: activeBtn }]}
              >
                <Text style={[styles.submitButtonText]}>Submit</Text>
              </Pressable>
            </ScrollView>
          </GestureHandlerRootView>
        ) : (
          <GestureHandlerRootView style={styles.mobileMainContainer}>
            <ScrollView
              style={{ flex: 1, padding: 5 }}
              showsVerticalScrollIndicator={false}
            >
              <View style={styles.componentContainer}>
                <OwnerAddressComponent />
              </View>

              {/* Conditionally render the billing address component */}  
              {!useOwnerAddress && (
                <View style={styles.componentContainer}>
                  <BillingAddressComponent />
                </View>
              )}

              <View style={styles.componentContainer}>
                <PaymentComponent />
              </View>

              {/* Submit button */}
              <Pressable
                style={[styles.submitButton, { backgroundColor: activeBtn }]}
              >
                <Text style={[styles.submitButtonText]}>Submit</Text>
              </Pressable>
            </ScrollView>
          </GestureHandlerRootView>
        )}
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default MainCheckoutComponent;

const styles = StyleSheet.create({
  webMainContainer: {
    flex: 1,
    flexDirection: "row",
  },
  mobileMainContainer: {
    flex: 1,
  },
  componentContainer: {
    marginBottom: 20,
    backgroundColor: "white",
    borderRadius: 8,
    padding: 15,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },

  submitButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 1,
    alignItems: "center",
    marginBottom: 10,
  },

  submitButtonText: {
    color: "black",
    fontWeight: "700",
    fontSize: 15,
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },
});
