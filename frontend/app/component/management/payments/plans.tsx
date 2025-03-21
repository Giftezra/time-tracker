import {
  StyleSheet,
  Text,
  View,
  FlatList,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import SubscriptionTierComponent from "@/app/component/management/payments/subscriptionPlan";
import { id } from "react-native-paper-dates";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SubscriptionPlanTiers } from "@/app/types/management/payment";
import { useCheckout } from "@/app/context/management/payments/paymentContext";

const SubscriptionPlansComponent = () => {
  const { subscriptionTiers, selectedPlan, setSelectedPlan, billingPeriod, toggleBillingPeriod } = useCheckout();
  const activeBtn = useThemeColor({}, "inactivebtn");
  const calendarText = ["Monthly", "Yearly"];

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
            onSelect={() => setSelectedPlan(item)}
            billingPeriod={billingPeriod}
          />
        )}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.plansList}
      />

      {/* Display the continue button only when the an item is selected */}
      {selectedPlan && (
        <View style={styles.continueButtonContainer} >
          <TouchableOpacity style={[styles.continueButton, { backgroundColor: activeBtn }]}>
            <Text style={styles.continueButtonText}>Continue</Text>
          </TouchableOpacity>
        </View>
      )}
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
});
