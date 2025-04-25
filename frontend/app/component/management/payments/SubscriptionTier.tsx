import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  Pressable,
  ScrollView,
  Platform,
} from "react-native";
import React from "react";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SubscriptionPlanTiers } from "@/app/types/management/payment";

interface Props {
  subscriptionPlan: SubscriptionPlanTiers;
  isSelected: boolean;
  onSelect: () => void;
  billingPeriod: "monthly" | "annually";
}

const SubscriptionTierComponent = ({
  subscriptionPlan,
  isSelected,
  onSelect,
  billingPeriod,
}: Props) => {
  const activeBtn = useThemeColor({}, "activebtn");
  const secondary = useThemeColor({}, "secondaryColor");
  /**
   * Get the yearly discount given the plan name.
   * @param planName The name of the plan.
   * @returns {number} The discount value.
   */
  const getYearlyDiscount = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "basic":
      case "starter":
        return 0.96; // 4% discount (multiply by 0.96)
      case "pro":
      case "enterprise":
        return 0.92; // 8% discount (multiply by 0.92)
      case "ultimate":
        return 0.9; // 10% discount (multiply by 0.90)
      default:
        return 1; // no discount
    }
  };

  /**
   * Calculate the price of the subscription plan using the rate and the number of employees.
   * If the plan is yearly, it will apply the discount to the price by passing the subscriptionPlan.name to the getYearlyDiscount function to get the discount value.
   * @returns {number} The price of the subscription plan.
   */
  const calculatePrice = () => {
    if (!subscriptionPlan.rate || !subscriptionPlan.numberOfEmployees) {
      return 0;
    }

    // Calculate base monthly price per employee
    const baseMonthlyPrice =
      subscriptionPlan.rate * subscriptionPlan.numberOfEmployees;

    if (billingPeriod === "annually") {
      // First multiply by 12 to get yearly price
      const yearlyPrice = baseMonthlyPrice * 12;
      // Then apply the yearly discount
      const discountMultiplier = getYearlyDiscount(subscriptionPlan.name);
      const discountedYearlyPrice = yearlyPrice * discountMultiplier;
      return discountedYearlyPrice;
    }

    // For monthly, return the base monthly price
    return baseMonthlyPrice;
  };

  const price = calculatePrice();

  return (
    <TouchableOpacity
      onPress={() => {
        console.log("Selected Plan Details:", {
          id: subscriptionPlan.id,
          name: subscriptionPlan.name,
          rate: subscriptionPlan.rate,
        });
        onSelect();
      }}
      activeOpacity={0.7}
      style={[
        styles.container,
        isSelected && styles.selectedContainer,
        subscriptionPlan.isPopular && styles.popularContainer,
        { borderColor: secondary },
      ]}
    >
      {/* Conditional rendering for popular badge */}
      {subscriptionPlan.isPopular && (
        <View style={[styles.popularBadge, { backgroundColor: activeBtn }]}>
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}

      {/* Conditional rendering for savings badge */}
      {subscriptionPlan.name === "ultimate"
        ? billingPeriod === "annually" && (
            <View style={[styles.savingsBadge, { backgroundColor: activeBtn }]}>
              <Text style={styles.savingsText}>Save 10%</Text>
            </View>
          )
        : subscriptionPlan.name === "pro" ||
          subscriptionPlan.name === "enterprise"
        ? billingPeriod === "annually" && (
            <View style={[styles.savingsBadge, { backgroundColor: activeBtn }]}>
              <Text style={styles.savingsText}>Save 8%</Text>
            </View>
          )
        : (subscriptionPlan.name === "starter" ||
            subscriptionPlan.name === "basic") &&
          billingPeriod === "annually" && (
            <View style={[styles.savingsBadge, { backgroundColor: activeBtn }]}>
              <Text style={styles.savingsText}>Save 4%</Text>
            </View>
          )}

      <View style={styles.header}>
        <Text style={styles.planName}>{subscriptionPlan.name}</Text>
        <Text style={styles.description}>{subscriptionPlan.description}</Text>
      </View>

      {/* Conditional rendering for price if the tier is custom or ultimate */}
      {subscriptionPlan.name === "Custom" ? (
        <View style={styles.priceContainer}>
          <Text style={styles.price}>Custom</Text>
        </View>
      ) : subscriptionPlan.name === "Unlimited" ? (
        <View style={styles.priceContainer}>
          <Text style={[styles.price, { fontSize: 18 }]}>Contact Us</Text>
        </View>
      ) : (
        <View style={styles.priceContainer}>
          <Text style={styles.currency}>£</Text>
          <Text style={styles.price}>
            {billingPeriod === "annually"
              ? (price / 12).toFixed(2)
              : price.toFixed(2)}
          </Text>
          <Text style={styles.period}>/month</Text>
        </View>
      )}

      {billingPeriod === "annually" &&
        subscriptionPlan.name !== "Unlimited" && (
          <View style={styles.billingNoteContainer}>
            <Text style={styles.billingNote}>
              {`Billed £${price.toFixed(2)} annually`}
            </Text>
          </View>
        )}

      <ScrollView
        style={styles.featuresContainer}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View>
          {subscriptionPlan.features.map((feature, index) => (
            <View key={index} style={styles.featureRow}>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={"#ff4757"}
              />
              <Text style={styles.featureText}>{feature}</Text>
            </View>
          ))}
          {subscriptionPlan.overageFee && (
            <View style={styles.featureRow}>
              <MaterialCommunityIcons
                name="check-circle"
                size={20}
                color={"#ff4757"}
              />
              <Text style={styles.featureText}>
                Overage fee: £{subscriptionPlan.overageFee}
              </Text>
            </View>
          )}
        </View>
      </ScrollView>

      <View style={[styles.selectButton, { backgroundColor: activeBtn }]}>
        <Text style={styles.selectButtonText}>
          {isSelected ? "Selected" : "Select Plan"}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

export default SubscriptionTierComponent;

const styles = StyleSheet.create({
  container: {
    margin: 10,
    padding: 5,
    borderRadius: 10,
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: {
          width: 0,
          height: 2,
        },
        shadowOpacity: 0.25,
        shadowRadius: 3.84,
      },
      android: {
        elevation: 4,
      },
    }),
    position: "relative",
    display: "flex",
    flexDirection: "column",
    backgroundColor: "#fff",
    minWidth: 250,
  },
  selectedContainer: {
    borderWidth: 2,
  },
  popularContainer: {
    transform: [{ scale: 1.05 }],
  },
  popularBadge: {
    position: "absolute",
    top: -12,
    right: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  savingsBadge: {
    position: "absolute",
    top: -12,
    left: 20,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },

  savingsText: {
    color: "white",
    fontWeight: "600",
  },

  popularText: {
    color: "white",
    fontWeight: "bold",
  },
  header: {
    alignItems: "center",
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    marginBottom: 5,
    textTransform: "capitalize",
  },
  description: {
    fontSize: 14,
    fontFamily: "BarlowLight",
    fontWeight: "400",
    color: "#666",
    textAlign: "center",
    textTransform: "capitalize",
  },
  priceContainer: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "baseline",
    marginBottom: 20,
    position: "relative",
  },
  currency: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
  },
  price: {
    fontSize: 30,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
    marginHorizontal: 4,
  },
  period: {
    fontSize: 16,
    color: "#666",
    fontFamily: "BarlowRegular",
    fontWeight: "700",
  },
  featuresContainer: {
    flex: 1,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 12,
  },
  featureText: {
    marginLeft: 10,
    fontSize: 16,
    color: "#444",
    fontWeight: "600",
    fontFamily: "BarlowLight",
    lineHeight: 24,
    letterSpacing: 0.4,
    textTransform: "capitalize",
  },
  selectButton: {
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
    width: "100%",
  } as const,
  selectButtonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },
  billingNoteContainer: {
    width: "100%",
    alignItems: "center",
    marginBottom: 10,
  },
  billingNote: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textAlign: "center",
  },
});
