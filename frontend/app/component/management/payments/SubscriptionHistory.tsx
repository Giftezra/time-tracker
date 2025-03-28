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
          {props.planName} Plan
        </Text>
        <View
          style={[
            styles.statusBadge,
            { backgroundColor: getStatusColor(props.status) },
          ]}
        >
          <Text style={styles.statusText}>{props.status}</Text>
        </View>
      </View>

      <View style={styles.dateContainer}>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>Start Date</Text>
          <Text style={styles.dateValue}>{formatDate(props.startDate)}</Text>
        </View>
        <Text style={styles.dateSeparator}>-</Text>
        <View style={styles.dateItem}>
          <Text style={styles.dateLabel}>End Date</Text>
          <Text style={styles.dateValue}>{formatDate(props.endDate)}</Text>
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
});
