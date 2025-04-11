import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
  ActivityIndicator,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SubscriptionPlanTiers } from "@/app/types/management/payment";
import BillingAddressComponent from "./billingAddress";
import OwnerAddressComponent from "./ownerAddress";
import { useCheckout } from "@/app/context/management/payments/paymentContext";
interface CheckoutProps {
  overagePlan?: number;
  selectedPlan?: SubscriptionPlanTiers;
  billingPeriod?: "monthly" | "annually";
  onBack: () => void;
}

const CheckoutComponent = ({
  overagePlan,
  selectedPlan,
  billingPeriod,
  onBack,
}: CheckoutProps) => {
  const activeBtn = useThemeColor({}, "activebtn");
  const secondary = useThemeColor({}, "secondaryColor");

  const {
    paymentDetails,
    setPaymentDetails,
    useOwnerAddress,
    openPaymentSheet,
    isCheckoutLoading,
    finalPrice,
  } = useCheckout();

  /* Render the pay with native pay button given the platform os the app is running on. */
  const renderNativePayButton = () => {
    if (Platform.OS === "ios") {
      return (
        <TouchableOpacity
          style={[styles.nativePayButton, { backgroundColor: "#000" }]}
          onPress={() => {
            /* Handle Apple Pay */
          }}
        >
          <Text style={styles.nativePayButtonText}>Pay with Apple Pay</Text>
        </TouchableOpacity>
      );
    } else if (Platform.OS === "android") {
      return (
        <TouchableOpacity
          style={[styles.nativePayButton, { backgroundColor: "#fff" }]}
          onPress={() => {
            /* Handle Google Pay */
          }}
        >
          <Text style={[styles.nativePayButtonText, { color: "#000" }]}>
            Pay with Google Pay
          </Text>
        </TouchableOpacity>
      );
    }
    return null;
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {isCheckoutLoading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={activeBtn} />
        </View>
      )}

      {/* Display the order summary when the selected plan is not null */}
      {selectedPlan ? (
        <View style={[styles.summaryContainer, { borderColor: secondary }]}>
          <Text style={styles.sectionTitle}>Order Summary</Text>

          <View style={styles.planDetails}>
            <View style={styles.planNameContainer}>
              <Text style={styles.planName}>{selectedPlan?.name}</Text>
              <Text style={styles.billingPeriod}>
                {billingPeriod === "annually"
                  ? "Annual Billing"
                  : "Monthly Billing"}
              </Text>
            </View>

            <View style={styles.priceContainer}>
              <Text style={styles.currency}>£</Text>
              <Text style={styles.price}>
                {billingPeriod === "annually"
                  ? finalPrice
                    ? (finalPrice / 12).toFixed(2)
                    : "0.00"
                  : finalPrice
                  ? finalPrice.toFixed(2)
                  : "0.00"}
              </Text>
              <Text style={styles.period}>/month</Text>
            </View>
          </View>

          {billingPeriod === "annually" && (
            <>
              <View style={styles.yearlyTotalContainer}>
                <Text style={styles.yearlyTotalLabel}>
                  Total annual payment:
                </Text>
                <Text style={styles.yearlyTotalPrice}>
                  £{finalPrice?.toFixed(2)}
                </Text>
              </View>
              <View style={styles.savingsContainer}>
                <MaterialCommunityIcons
                  name="tag"
                  size={20}
                  color={activeBtn}
                />
                <Text style={styles.savingsText}>
                  {`Save ${
                    selectedPlan?.name === "ultimate"
                      ? "10%"
                      : selectedPlan?.name === "pro" ||
                        selectedPlan?.name === "enterprise"
                      ? "8%"
                      : "4%"
                  } with annual billing`}
                </Text>
              </View>
            </>
          )}
        </View>
      ) : (
        <View>
          <Text style={styles.sectionTitle}>
            {`Pay £${overagePlan} for overage`}
          </Text>
        </View>
      )}

      {/* Address Section */}
      <View style={[styles.addressContainer, { borderColor: secondary }]}>
        <Text style={styles.sectionTitle}>Address Information</Text>
        <OwnerAddressComponent />
        {!useOwnerAddress && <BillingAddressComponent />}
      </View>

      {/* Action Buttons */}
      <View style={styles.buttonContainer}>
        <TouchableOpacity
          style={[styles.button, styles.backButton]}
          onPress={onBack}
        >
          <Text style={styles.buttonText}>Back</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[
            styles.button,
            styles.payButton,
            { backgroundColor: activeBtn },
          ]}
          onPress={openPaymentSheet}
          disabled={isCheckoutLoading}
        >
          {isCheckoutLoading ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={[styles.buttonText, styles.payButtonText]}>
              {overagePlan
                ? `Pay £${overagePlan} for overage`
                : `Pay ${
                    billingPeriod === "annually"
                      ? `£${
                          finalPrice ? finalPrice.toFixed(2) : "0.00"
                        } annually`
                      : `£${
                          finalPrice ? finalPrice.toFixed(2) : "0.00"
                        } monthly`
                  }`}
            </Text>
          )}
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CheckoutComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginBottom: 40,
  },
  summaryContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: "600",
    marginBottom: 20,
    fontFamily: "BarlowRegular",
  },
  planDetails: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  planNameContainer: {
    flex: 1,
  },
  planName: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 5,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
  billingPeriod: {
    fontSize: 14,
    color: "#666",
    fontFamily: "BarlowLight",
  },
  priceContainer: {
    flexDirection: "row",
    alignItems: "baseline",
  },
  currency: {
    fontSize: 16,
    fontWeight: "600",
  },
  price: {
    fontSize: 24,
    fontWeight: "700",
    marginHorizontal: 4,
  },
  period: {
    fontSize: 14,
    color: "#666",
  },
  savingsContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 15,
    padding: 10,
    backgroundColor: "#f8f8f8",
    borderRadius: 8,
  },
  savingsText: {
    marginLeft: 10,
    color: "#666",
    fontSize: 14,
    fontFamily: "BarlowRegular",
  },
  paymentContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 14,
    marginBottom: 8,
    color: "#666",
    fontFamily: "BarlowRegular",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    fontFamily: "BarlowRegular",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    flex: 1,
    padding: 15,
    borderRadius: 8,
    alignItems: "center",
  },
  backButton: {
    marginRight: 10,
    backgroundColor: "#f8f8f8",
  },
  payButton: {
    flex: 2,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },
  payButtonText: {
    color: "white",
  },
  addressContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
      },
    }),
  },
  nativePayButton: {
    width: "100%",
    padding: 16,
    borderRadius: 8,
    marginBottom: 20,
    alignItems: "center",
    justifyContent: "center",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 5,
        borderWidth: 1,
        borderColor: "#ddd",
      },
    }),
  },
  nativePayButtonText: {
    fontSize: 16,
    fontWeight: "600",
    color: "#fff",
    fontFamily: "BarlowRegular",
  },
  dividerContainer: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 20,
  },
  divider: {
    flex: 1,
    height: 1,
    backgroundColor: "#ddd",
  },
  dividerText: {
    marginHorizontal: 10,
    color: "#666",
    fontSize: 14,
    fontFamily: "BarlowRegular",
  },
  yearlyTotalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 15,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: "#eee",
  },
  yearlyTotalLabel: {
    fontSize: 16,
    fontFamily: "BarlowRegular",
    color: "#666",
  },
  yearlyTotalPrice: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },
  loadingOverlay: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    zIndex: 1000,
  },
});
