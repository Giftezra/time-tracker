import { StyleSheet, Text, View } from "react-native";
import React from "react";
import { SubscriptionHistoryInterface } from "@/app/types/management/payment";
import { useThemeColor } from "@/hooks/useThemeColor";

const SubscriptionHistory = ({
  props,
}: {
  props: SubscriptionHistoryInterface;
}) => {
  const primaryColor = useThemeColor({}, "primaryColor");

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active":
        return "#4CAF50";
      case "expiring":
        return "#FFA726";
      case "overdue":
        return "#EF5350";
      default:
        return "#4CAF50";
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "short",
      day: "numeric",
    });
  };

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.planName, { color: primaryColor }]}>
          {props.tier}
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(props.status) },
          ]}
        >
          <Text style={styles.statusText}>{props.status}</Text>
        </View>
        <View style={styles.billingCycle}>
          <Text style={styles.billingCycleText}>
            {props.billing_cycle}
          </Text>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateValue}>{formatDate(props.start_date)}</Text>
        </View>
        <Text style={styles.dateSeparator}>-</Text>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>{formatDate(props.renewal_date)}</Text>
        </View>
      </View>
    </View>
  );
};

export default SubscriptionHistory;

const styles = StyleSheet.create({
  container: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
    borderWidth: 2,
    borderColor: "#E5E7EB",
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  planName: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowMedium",
    letterSpacing: 1,
    textTransform: "capitalize",
  },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12,
  },
  statusText: {
    color: "#ffffff",
    fontSize: 12,
    fontWeight: "500",
    textTransform: "capitalize",
  },
  dateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  dateItem: {
    flex: 1,
  },
  dateLabel: {
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
  },
  dateValue: {
    fontSize: 14,
    color: "#374151",
    fontWeight: "500",
  },
  dateSeparator: {
    marginHorizontal: 12,
    color: "#6B7280",
  },
  billingCycle: {
    position: "absolute",
    right: 100,
    top: -25,
    fontSize: 12,
    color: "#6B7280",
    marginBottom: 4,
    padding:2,
    backgroundColor: "#E5E7EB",
    borderRadius: 10,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    minWidth: 100,
    alignItems: "center",
  },
  billingCycleText: {
    fontSize: 14,
    color: "red",
    marginBottom: 4,
    fontFamily: "BarlowMedium",
    fontWeight: "500",
    textTransform: "capitalize",
    letterSpacing: 1,
  },
});
