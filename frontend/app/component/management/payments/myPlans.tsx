import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CurrentPlanDetails } from "@/app/types/management/payment";

const MySubscriptionPlansComponent = () => {
  // This would typically come from your API/backend
  const [currentPlan] = useState<CurrentPlanDetails>({
    planName: "Pro",
    currentEmployees: 120,
    planLimit: 100,
    overageCount: 20,
    overageFees: 100,
    expiryDate: "2025-04-30",
    billingPeriod: "monthly",
    status: "active",
  });

  const warningColor = useThemeColor({}, "primaryColor");
  const primaryColor = useThemeColor({}, "primaryColor");
  const textColor = useThemeColor({}, "highlight");

  const daysUntilExpiry = () => {
    const expiry = new Date(currentPlan.expiryDate);
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Current Plan</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                currentPlan.status === "active" ? "#4CAF50" : warningColor,
            },
          ]}
        >
          <Text style={styles.statusText}>{currentPlan.status}</Text>
        </View>
      </View>

      <View style={[styles.planCard, { backgroundColor: "#ffffff" }]}>
        <View style={styles.planHeaderSection}>
          <Text style={[styles.planName, { color: primaryColor }]}>
            {currentPlan.planName} Plan
          </Text>
          <Text style={styles.periodText}>
            {currentPlan.billingPeriod.charAt(0).toUpperCase() +
              currentPlan.billingPeriod.slice(1)}{" "}
            billing
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Employees</Text>
            <View style={styles.valueContainer}>
              <Text style={[styles.value, { color: textColor }]}>
                {currentPlan.currentEmployees}
                <Text style={styles.valueSecondary}>
                  {" "}
                  / {currentPlan.planLimit}
                </Text>
              </Text>
            </View>
          </View>

          {currentPlan.overageCount > 0 && (
            <View style={styles.overageContainer}>
              <Text style={[styles.overageText, { color: warningColor }]}>
                Overage: {currentPlan.overageCount} employees
              </Text>
              <Text style={[styles.overageFees, { color: warningColor }]}>
                Additional fees: ${currentPlan.overageFees}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Plan Expires</Text>
            <Text style={[styles.value, { color: textColor }]}>
              {currentPlan.expiryDate}
            </Text>
          </View>

          <View style={[styles.expiryAlert, { backgroundColor: "#F8F9FA" }]}>
            <Text style={[styles.expiryText, { color: textColor }]}>
              {daysUntilExpiry()} days until plan renewal
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={styles.infoContainer}>
        <Text style={styles.infoText}>
          You can pay for your overage now, reduce the number of staff to{" "}
          {currentPlan.planLimit} or increase your plan limit to avoid overage
          fees
        </Text>

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
          >
            <Text style={styles.buttonText}>Pay for Overage</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
          >
            <Text style={styles.buttonText}>Increase Plan Limit</Text>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

export default MySubscriptionPlansComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#F8F9FA",
    padding: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  planCard: {
    borderRadius: 16,
    padding: 24,
    marginBottom: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  planHeaderSection: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 28,
    fontWeight: "700",
    marginBottom: 8,
  },
  periodText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  valueSecondary: {
    color: "#6B7280",
    fontWeight: "400",
  },
  overageContainer: {
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginVertical: 8,
  },
  overageText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  overageFees: {
    fontSize: 14,
    fontWeight: "500",
  },
  expiryAlert: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8F9FA",
  },
  expiryText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    textTransform: "none",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
});
