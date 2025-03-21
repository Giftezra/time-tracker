import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TextInput,
  TouchableOpacity,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { SubscriptionPlanTiers } from "@/app/types/management/payment";

interface CheckoutProps {
  selectedPlan: SubscriptionPlanTiers;
  billingPeriod: "monthly" | "yearly";
  onBack: () => void;
  onComplete: () => void;
}

const CheckoutComponent = ({
  selectedPlan,
  billingPeriod,
  onBack,
  onComplete,
}: CheckoutProps) => {
  const activeBtn = useThemeColor({}, "activebtn");
  const secondary = useThemeColor({}, "secondaryColor");

  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: "",
    expiryDate: "",
    cvv: "",
    name: "",
    email: "",
  });

  // Calculate final price based on billing period and plan
  const calculateFinalPrice = () => {
    if (!selectedPlan.rate || !selectedPlan.numberOfEmployees) return 0;

    const basePrice = selectedPlan.rate * selectedPlan.numberOfEmployees;

    if (billingPeriod === "yearly") {
      const yearlyPrice = basePrice * 12;
      const discount = getYearlyDiscount(selectedPlan.name);
      return yearlyPrice * discount;
    }

    return basePrice;
  };

  const getYearlyDiscount = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "basic":
      case "starter":
        return 0.96;
      case "pro":
      case "enterprise":
        return 0.92;
      case "ultimate":
        return 0.9;
      default:
        return 1;
    }
  };

  const finalPrice = calculateFinalPrice();

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Order Summary Section */}
      <View style={[styles.summaryContainer, { borderColor: secondary }]}>
        <Text style={styles.sectionTitle}>Order Summary</Text>

        <View style={styles.planDetails}>
          <View style={styles.planNameContainer}>
            <Text style={styles.planName}>{selectedPlan.name}</Text>
            <Text style={styles.billingPeriod}>
              {billingPeriod === "yearly"
                ? "Annual Billing"
                : "Monthly Billing"}
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.currency}>£</Text>
            <Text style={styles.price}>
              {billingPeriod === "yearly"
                ? (finalPrice / 12).toFixed(2)
                : finalPrice.toFixed(2)}
            </Text>
            <Text style={styles.period}>/month</Text>
          </View>
        </View>

        {billingPeriod === "yearly" && (
          <View style={styles.savingsContainer}>
            <MaterialCommunityIcons name="tag" size={20} color={activeBtn} />
            <Text style={styles.savingsText}>
              {`Save ${
                selectedPlan.name === "Ultimate"
                  ? "10%"
                  : selectedPlan.name === "Pro"
                  ? "8%"
                  : "4%"
              } with annual billing`}
            </Text>
          </View>
        )}
      </View>

      {/* Payment Details Section */}
      <View style={[styles.paymentContainer, { borderColor: secondary }]}>
        <Text style={styles.sectionTitle}>Payment Details</Text>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Holder Name</Text>
          <TextInput
            style={styles.input}
            placeholder="John Doe"
            value={paymentDetails.name}
            onChangeText={(text) =>
              setPaymentDetails({ ...paymentDetails, name: text })
            }
          />
        </View>

        <View style={styles.inputContainer}>
          <Text style={styles.label}>Card Number</Text>
          <TextInput
            style={styles.input}
            placeholder="1234 5678 9012 3456"
            keyboardType="numeric"
            maxLength={16}
            value={paymentDetails.cardNumber}
            onChangeText={(text) =>
              setPaymentDetails({ ...paymentDetails, cardNumber: text })
            }
          />
        </View>

        <View style={styles.row}>
          <View style={[styles.inputContainer, { flex: 1, marginRight: 10 }]}>
            <Text style={styles.label}>Expiry Date</Text>
            <TextInput
              style={styles.input}
              placeholder="MM/YY"
              maxLength={5}
              value={paymentDetails.expiryDate}
              onChangeText={(text) =>
                setPaymentDetails({ ...paymentDetails, expiryDate: text })
              }
            />
          </View>

          <View style={[styles.inputContainer, { flex: 1 }]}>
            <Text style={styles.label}>CVV</Text>
            <TextInput
              style={styles.input}
              placeholder="123"
              keyboardType="numeric"
              maxLength={3}
              value={paymentDetails.cvv}
              onChangeText={(text) =>
                setPaymentDetails({ ...paymentDetails, cvv: text })
              }
            />
          </View>
        </View>
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
          onPress={onComplete}
        >
          <Text style={[styles.buttonText, styles.payButtonText]}>
            {`Pay ${
              billingPeriod === "yearly"
                ? `£${finalPrice.toFixed(2)} annually`
                : `£${finalPrice.toFixed(2)} monthly`
            }`}
          </Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
};

export default CheckoutComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
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
    fontWeight: "600",
    marginBottom: 5,
    fontFamily: "BarlowRegular",
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
});
