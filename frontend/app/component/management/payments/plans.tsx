import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
  Modal,
} from "react-native";
import React, { useState } from "react";
import SubscriptionTierComponent from "@/app/component/management/payments/SubscriptionTier";
import { id } from "react-native-paper-dates";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SubscriptionPlanTiers } from "@/app/types/management/payment";
import { useCheckout } from "@/app/context/management/payments/paymentContext";
import CustomizePlan from "./CustomizePlan";
import CheckoutComponent from "./Checkout";

const SubscriptionPlansComponent = () => {
  const {
    subscriptionTiers,
    selectedPlan,
    setSelectedPlan,
    billingPeriod,
    toggleBillingPeriod,
    showCheckout,
    setShowCheckout,
  } = useCheckout();
  const activeBtn = useThemeColor({}, "inactivebtn");
  const calendarText = ["Monthly", "Annually"];

  const handleContinue = () => {
    // Remove this function as we'll handle the logic directly in the component
  };

  /* Show the checkout component when showCheckout is true and we have a selected plan */
  if (showCheckout && selectedPlan) {
    return (
      <CheckoutComponent
        selectedPlan={selectedPlan}
        billingPeriod={billingPeriod}
        onBack={() => {
          setShowCheckout(false);
          setSelectedPlan(null);
        }}
      />
    );
  }

  /* Show the CustomizePlan component when a Custom plan is selected but checkout hasn't started */
  if (selectedPlan?.name === "Custom" && !showCheckout) {
    return <CustomizePlan />;
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Choose Your Plan</Text>
        <Text style={styles.subtitle}>
          Select the perfect plan for your business and save up to 10% when
          billed annually
        </Text>
      </View>

      <View style={styles.billingToggle}>
        {calendarText.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={[
              styles.toggleButton,
              billingPeriod.toLowerCase() === item.toLowerCase() && {
                backgroundColor: activeBtn,
              },
            ]}
            onPress={() => toggleBillingPeriod()}
          >
            <Text
              style={[
                styles.toggleText,
                billingPeriod.toLowerCase() === item.toLowerCase() &&
                  styles.activeToggleText,
              ]}
            >
              {item}
            </Text>
          </TouchableOpacity>
        ))}
      </View>

      <FlatList
        data={subscriptionTiers}
        renderItem={({ item }) => (
          <SubscriptionTierComponent
            subscriptionPlan={item}
            isSelected={selectedPlan?.id === item.id}
            onSelect={() => {
              setSelectedPlan(item);
              if (item.name !== "Custom") {
                setShowCheckout(true);
              }
            }}
            billingPeriod={billingPeriod}
          />
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.plansList}
      />
    </View>
  );
};

export default SubscriptionPlansComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
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

  toggleText: {
    fontSize: 16,
    color: "#666",
  },
  activeToggleText: {
    color: "white",
    fontWeight: "bold",
  },
  savingsBadge: {
    position: "absolute",
    top: -10,
    right: -10,
    backgroundColor: "#ff4757",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  savingsText: {
    color: "white",
    fontSize: 12,
    fontWeight: "bold",
  },
  plansList: {
    paddingVertical: 20,
  },
  continueButton: {
    padding: 12,
    borderRadius: 5,
    alignItems: "center",
  },
  continueButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  continueButtonContainer: {
    marginVertical: 20,
  },
  customPlanSection: {
    alignItems: "center",
    marginBottom: 20,
  },
  customPlanButton: {
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 25,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  customPlanButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "bold",
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContent: {
    flex: 1,
    width: "100%",
    backgroundColor: "white",
    padding: 20,
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  modalHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: "bold",
  },
  closeButton: {
    padding: 8,
  },
  closeButtonText: {
    fontSize: 20,
    color: "#666",
  },
});
