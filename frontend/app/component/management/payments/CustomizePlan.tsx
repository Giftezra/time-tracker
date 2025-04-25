import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  ScrollView,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useCheckout } from "@/app/context/management/payments/paymentContext";
import TextInputComponent from "../../helper/textInput";

const CustomizePlan = () => {
  const [employeeCount, setEmployeeCount] = useState("");
  const [isEligible, setIsEligible] = useState(false);
  const [basePrice, setBasePrice] = useState(0);
  const activeBtn = useThemeColor({}, "inactivebtn");
  const {
    billingPeriod,
    toggleBillingPeriod,
    subscriptionTiers,
    setSelectedPlan,
    setShowCheckout,
  } = useCheckout();

  // Find the custom plan from subscription tiers
  const customPlan = subscriptionTiers.find((tier) => tier.is_custom);
  console.log("customPlan", customPlan);
  const MIN_EMPLOYEES = customPlan?.minimum_employees || 150;
  const PRICE_PER_EMPLOYEE = customPlan?.rate || 4;
  const OVERAGE_RATE = customPlan?.overage_rate || 4;
  const YEARLY_DISCOUNT = 0.92;

  useEffect(() => {
    const count = parseInt(employeeCount) || 0;
    setIsEligible(count >= MIN_EMPLOYEES);

    if (count >= MIN_EMPLOYEES) {
      const monthlyBase = count * PRICE_PER_EMPLOYEE;
      const finalPrice =
        billingPeriod === "annually"
          ? monthlyBase * 12 * YEARLY_DISCOUNT
          : monthlyBase;
      setBasePrice(finalPrice);
    } else {
      setBasePrice(0);
    }
  }, [employeeCount, billingPeriod]);

  const handleContinue = () => {
    if (isEligible && customPlan) {
      const count = parseInt(employeeCount) || 0;
      setSelectedPlan({
        ...customPlan,
        numberOfEmployees: count,
        rate: basePrice / count,
      });
    }
  };

  // Add this function to handle going back
  const handleBack = () => {
    setSelectedPlan(null);
  };

  return (
    <KeyboardAvoidingView
      behavior="padding"
      style={styles.container}
    >
      <ScrollView style={styles.container}>
        <View style={styles.content}>
          {/* Add back button at the top */}
        <TouchableOpacity style={styles.backButton} onPress={handleBack}>
          <Text style={styles.backButtonText}>← Back to Plans</Text>
        </TouchableOpacity>

        <Text style={styles.title}>Customize Your Enterprise Plan</Text>
        <Text style={styles.subtitle}>
          Build a plan that perfectly fits your organization's needs
        </Text>

        <View style={styles.billingToggle}>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              billingPeriod === "monthly" && styles.activeToggleButton,
            ]}
            onPress={toggleBillingPeriod}
          >
            <Text
              style={[
                styles.toggleText,
                billingPeriod === "monthly" && styles.activeToggleText,
              ]}
            >
              Monthly
            </Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleButton,
              billingPeriod === "annually" && styles.activeToggleButton,
            ]}
            onPress={toggleBillingPeriod}
          >
            <Text
              style={[
                styles.toggleText,
                billingPeriod === "annually" && styles.activeToggleText,
              ]}
            >
              Yearly (8% off)
            </Text>
          </TouchableOpacity>
        </View>

        <TextInputComponent
          text="Number of Employees"
          placeholder="Enter number of employees"
          value={employeeCount}
          setValue={setEmployeeCount}
          keyboardType="numeric"
        />

        {!isEligible && employeeCount !== "" && (
          <Text style={styles.errorText}>
            Custom plans are only available for organizations with 150 or more
            employees
          </Text>
        )}

        {isEligible && (
          <View style={styles.pricingContainer}>
            <Text style={styles.pricingTitle}>Your Custom Plan Details</Text>

            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Base Rate:</Text>
              <Text style={styles.pricingValue}>
                £{PRICE_PER_EMPLOYEE}/employee/month
              </Text>
            </View>

            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Overage Rate:</Text>
              <Text style={styles.pricingValue}>
                £{OVERAGE_RATE}/employee/month
              </Text>
            </View>

            <View style={styles.pricingRow}>
              <Text style={styles.pricingLabel}>Billing Period:</Text>
              <Text style={styles.pricingValue}>
                {billingPeriod === "annually" ? "Annually" : "Monthly"}
              </Text>
            </View>

            <View style={styles.divider} />

            <View style={styles.totalContainer}>
              <Text style={styles.totalLabel}>
                {billingPeriod === "annually"
                  ? "Annually Total:"
                  : "Monthly Total:"}
              </Text>
              <Text style={styles.totalPrice}>£{basePrice.toFixed(2)}</Text>
            </View>

            <TouchableOpacity
              style={[styles.button, { backgroundColor: activeBtn }]}
              onPress={handleContinue}
            >
              <Text style={styles.buttonText}>Make Payment</Text>
            </TouchableOpacity>
          </View>
        )}
      </View>
    </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default CustomizePlan;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "white",
  },
  content: {
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 10,
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  billingToggle: {
    flexDirection: "row",
    backgroundColor: "#f5f5f5",
    borderRadius: 25,
    padding: 4,
    marginBottom: 30,
    alignSelf: "center",
  },
  toggleButton: {
    paddingVertical: 8,
    paddingHorizontal: 24,
    borderRadius: 20,
  },
  activeToggleButton: {
    backgroundColor: "#007AFF",
  },
  toggleText: {
    fontSize: 16,
    color: "#666",
  },
  activeToggleText: {
    color: "white",
    fontWeight: "600",
  },
  inputContainer: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    color: "#333",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 12,
    padding: 15,
    fontSize: 16,
    backgroundColor: "#f9f9f9",
  },
  errorText: {
    color: "#FF3B30",
    marginBottom: 20,
    fontSize: 14,
  },
  pricingContainer: {
    backgroundColor: "#f8f9fa",
    padding: 20,
    borderRadius: 16,
    marginTop: 20,
  },
  pricingTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },
  pricingLabel: {
    fontSize: 16,
    color: "#666",
  },
  pricingValue: {
    fontSize: 16,
    fontWeight: "600",
    color: "#333",
  },
  divider: {
    height: 1,
    backgroundColor: "#ddd",
    marginVertical: 20,
  },
  totalContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: "600",
    color: "#333",
  },
  totalPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  button: {
    padding: 16,
    borderRadius: 12,
    alignItems: "center",
    marginTop: 10,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
  },
  backButton: {
    paddingVertical: 10,
    marginBottom: 20,
  },
  backButtonText: {
    fontSize: 16,
    color: "#007AFF",
  },
});
