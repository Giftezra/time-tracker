import {
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
  Switch,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import { router } from "expo-router";
import FeaturesComponent from "./FeaturesComponent";
import SubscriptionTierComponent from "../../management/payments/SubscriptionTier";
import { SubscriptionPlanTiers } from "@/app/types/management/payment";

const MobileLandingPage = () => {
  const [isPricing, setIsPricing] = useState(false);
  const [isFeatures, setIsFeatures] = useState(false);
  const [selectedPlanId, setSelectedPlanId] = useState<string>("");
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">(
    "monthly"
  );

  const subscriptionPlans: SubscriptionPlanTiers[] = [
    {
      id: "1",
      name: "Starter",
      description: "Perfect for 1-20 employees",
      features: [
        "Up to 20 team members",
        "Basic time tracking",
        "Project management",
      ],
      isPopular: false,
      numberOfEmployees: 20,
      rate: 5,
      overage_rate: 5,
      minimum_employees: 0,
    },
    {
      id: "2",
      name: "Basic",
      description: "Perfect for small teams",
      features: [
        "Up to 50 team members",
        "Basic time tracking",
        "Project management",
        "Priority support",
        "Unlimited projects",
      ],
      isPopular: false,
      numberOfEmployees: 50,
      rate: 4.5,
      overage_rate: 5,
      minimum_employees: 20,
    },
    {
      id: "3",
      name: "Pro",
      description: "Growing teams and businesses",
      features: [
        "Up to 100 team members",
        "Advanced analytics",
        "Priority support",
        "Custom reports",
        "Unlimited projects",
        "Chat Functionality",
      ],
      isPopular: true,
      numberOfEmployees: 100,
      rate: 4,
      overage_rate: 4,
      minimum_employees: 50,
    },
    {
      id: "4",
      name: "Enterprise",
      description: "Large organizations",
      features: [
        "Unlimited team members",
        "24/7 support",
        "Custom integration",
        "Dedicated manager",
        "Unlimited projects",
        "Chat Functionality",
        "Customizable branding",
      ],
      isPopular: false,
      numberOfEmployees: 200,
      rate: 4,
      overage_rate: 3.5,
      minimum_employees: 100,
    },
  ];

  const handlePricingClick = () => {
    console.log("Pricing button clicked");
    setIsPricing((prev) => {
      console.log("Setting isPricing to:", !prev);
      return !prev;
    });
  };

  const handleFeaturesClick = () => {
    setIsFeatures((prev) => {
      return !prev;
    });
  };

  if (isPricing) {
    return (
      <View style={[styles.maincontainer, { backgroundColor: "#f5f5f5" }]}>
        <View style={[styles.pricingHeader, { backgroundColor: "#fff" }]}>
          <Pressable onPress={() => setIsPricing(false)} style={{ padding: 5 }}>
            <Text style={styles.backButton}>Back</Text>
          </Pressable>

          <View style={styles.billingToggle}>
            <Text
              style={[
                styles.billingText,
                billingPeriod === "monthly" && styles.activeBilling,
              ]}
            >
              Monthly
            </Text>
            <Switch
              value={billingPeriod === "annually"}
              onValueChange={(value) =>
                setBillingPeriod(value ? "annually" : "monthly")
              }
              trackColor={{ false: "#767577", true: "#81b0ff" }}
              thumbColor={billingPeriod === "annually" ? "#f5dd4b" : "#f4f3f4"}
            />
            <Text
              style={[
                styles.billingText,
                billingPeriod === "annually" && styles.activeBilling,
              ]}
            >
              Annually
            </Text>
          </View>
        </View>

        <ScrollView
          style={styles.plansContainer}
          contentContainerStyle={styles.plansContentContainer}
        >
          {subscriptionPlans.map((plan) => (
            <View key={plan.id} style={{ marginBottom: 16 }}>
              <SubscriptionTierComponent
                subscriptionPlan={plan}
                isSelected={selectedPlanId === plan.id}
                onSelect={() => setSelectedPlanId(plan.id)}
                billingPeriod={billingPeriod}
              />
            </View>
          ))}
        </ScrollView>
      </View>
    );
  }

  if (isFeatures) {
    return (
      <View style={styles.maincontainer}>
        <FeaturesComponent closeFeatures={() => setIsFeatures(false)} />
      </View>
    );
  }

  return (
    <View style={styles.maincontainer}>
      <View style={styles.headercontainer}>
        <View style={styles.navContainer}>
          <Image
            source={require("@/assets/icons/time-icon.png")}
            style={styles.logo}
          />

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setIsPricing(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.navText}>pricing</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={styles.navButton}
            onPress={() => setIsFeatures(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.navText}>Features</Text>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[
            styles.navButton,
            styles.signInButton,
          ]}
          onPress={() => {
            router.replace("/management/onboarding/login");
          }}
        >
          <Text
            style={[
              styles.navText,
              { color: "#000", fontSize: 14, textTransform: "capitalize",  },
            ]}
          >
            Sign In
          </Text>
        </TouchableOpacity>
      </View>

      {/* Contains thebody of the page */}
      <View style={styles.bodyContainer}>
        {/* Center the content to display the logo and the text */}
        <View style={{ alignItems: "center" }}>
          <Image
            source={require("@/assets/icons/time-icon.png")}
            style={{
              width: 150,
              height: 150,
              borderRadius: 100,
              padding: 10,
            }}
            resizeMode="contain"
          />
          <View style={styles.textContainer}>
            <Text
              style={[
                styles.text,
                {
                  fontVariant: ["small-caps"],
                },
              ]}
            >
              Think, Plan, Track, and Grow
            </Text>
            <Text
              style={[
                styles.text,
                {
                  fontSize: 20,
                  color: "#444",
                  textTransform: "lowercase",
                },
              ]}
            >
              All in one Place
            </Text>
            <Text style={[styles.text, { fontSize: 12, color: "#444" }]}>
              Efficiently manage your task and boost productivity
            </Text>
            <TouchableOpacity
              style={styles.getStartedButton}
              onPress={() =>
                router.replace("/management/onboarding/registration")
              }
            >
              <Text style={styles.getStartedButtonText}>Get Started</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      <Image
        source={require("@/assets/icons/note.jpg")}
        style={styles.backgroundImage}
        resizeMode="contain"
      />
    </View>
  );
};

export default MobileLandingPage;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  headercontainer: {
    padding: 5,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    backgroundColor: "#fff",
  },
  logo: {
    width: 40, // 10% of screen width
    height: 40,
    maxWidth: 50,
    maxHeight: 50,
    borderRadius: 100,
  },
  navContainer: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  navButton: {
    gap: 5,
    marginHorizontal: 10,
  },
  navText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BarlowMedium",
    textTransform: "lowercase",
    letterSpacing: 0.5,
    color: "#333",
  },
  pricingHeader: {
    padding: 16,
    flexDirection: "column",
    gap: 16,
    borderBottomWidth: 1,
    borderBottomColor: "#e1e1e1",
    backgroundColor: "#fff",
  },
  backButton: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    letterSpacing: 0.5,
  },
  billingToggle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
  },
  billingText: {
    fontSize: 14,
    color: "#666",
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  activeBilling: {
    color: "#000",
    fontWeight: "600",
  },
  plansContainer: {
    flex: 1,
  },
  plansContentContainer: {
    paddingHorizontal: 16,
    paddingTop: 16,
  },

  // Body context
  bodyContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },

  textContainer: {
    flexDirection: "column",
    alignItems: "center",
    padding: 5,
    width: "100%",
    gap: 20,
  },
  text: {
    fontSize: 25,
    fontFamily: "BarlowMedium",
    fontWeight: "600",
    letterSpacing: 0.5,
    textAlign: "center",
    width: "100%",
  },
  getStartedButton: {
    backgroundColor: "rgb(8, 59, 212)",
    padding: 10,
    borderRadius: 5,
    width: "100%",
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "rgba(0, 0, 0, 0.2)",
    shadowOpacity: 0.5,
    shadowRadius: 4,
    elevation: 4,
  },
  getStartedButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "BarlowMedium",
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  backgroundImage: {
    width: 150,
    position: "absolute",
    bottom: 0,
    left: -50,
    transform: [{ rotate: "30deg" }],
  },
  signInButton: {
    borderWidth: 0.3,
    padding: 5,
    borderRadius: 10,
    width: 100,
    alignItems: "center",
    justifyContent: "center",
    shadowOffset: { width: 0, height: 2 },
    shadowColor: "rgba(0, 0, 0, 0.2)",
    backgroundColor: "rgb(207, 207, 233)",
    shadowOpacity: 0.7,
    shadowRadius: 4,
    elevation: 4,
  },
});
