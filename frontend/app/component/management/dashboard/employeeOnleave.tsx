import { Image, StyleSheet, Text, View } from "react-native";
import React from "react";
import { EmployeeOnLeaveInterface } from "@/app/types/management/dashboard";

const image = require("@/assets/images/user image.jpg");

const EmployeeOnLeaveComponent: React.FC<EmployeeOnLeaveInterface> = ({
  employee_id,
  name,
  email,
  type,
  status,
  start_date,
  end_date,
}) => {
  /**
   * Method is used to calculate the duration of the leave by subtracting the date the employee is expected to return from the date the employee left.
   */
  const handleLeaveDate = () => {
    const date1 = new Date(start_date);
    const date2 = new Date(end_date);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const getStatusColor = () => {
    switch (status.toLowerCase()) {
      case "approved":
        return "#4CAF50";
      case "pending":
        return "#FFC107";
      case "rejected":
        return "#F44336";
      default:
        return "#757575";
    }
  };

  return (
    <View style={styles.mainContainer}>
      <Text style={styles.typeLabel}>{type}</Text>

      <View style={styles.contentContainer}>
        <Image source={image} style={styles.image} />

        <View style={styles.detailsContainer}>
          <View style={styles.employeeInfo}>
            <Text style={styles.nameText}>{name}</Text>
            <Text style={styles.emailText}>{email}</Text>
            <Text style={styles.idText}>ID: {employee_id}</Text>
          </View>

          <View style={styles.leaveInfo}>
            <Text style={styles.dateText}>
              {new Date(start_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}{" "}
              -{" "}
              {new Date(end_date).toLocaleDateString("en-US", {
                month: "short",
                day: "numeric",
              })}
            </Text>
            <Text style={styles.durationText}>{handleLeaveDate()} days</Text>
            <View style={styles.statusContainer}>
              <View
                style={[
                  styles.statusDot,
                  { backgroundColor: getStatusColor() },
                ]}
              />
              <Text style={[styles.statusText, { color: getStatusColor() }]}>
                {status}
              </Text>
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

export default EmployeeOnLeaveComponent;

const styles = StyleSheet.create({
  mainContainer: {
    backgroundColor: "#FFFFFF",
    borderRadius: 5,
    padding: 5,
    marginVertical: 2,
    borderBottomWidth: 0.5,
  },
  typeLabel: {
    fontSize: 8,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 0.5,
    marginBottom: 8,
  },
  contentContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  image: {
    width: 30,
    height: 30,
    borderRadius: 24,
    marginRight: 12,
  },
  detailsContainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
  },
  employeeInfo: {
    flex: 1,
    marginRight: 12,
  },
  nameText: {
    fontSize: 14,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 2,
  },
  emailText: {
    fontSize: 12,
    color: "#666",
    marginBottom: 2,
  },
  idText: {
    fontSize: 10,
    color: "#888",
  },
  leaveInfo: {
    alignItems: "flex-end",
  },
  dateText: {
    fontSize: 12,
    color: "#444",
    fontWeight: "500",
    marginBottom: 2,
  },
  durationText: {
    fontSize: 11,
    color: "#666",
    marginBottom: 4,
  },
  statusContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  statusDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginRight: 4,
  },
  statusText: {
    fontSize: 10,
    fontWeight: "500",
    textTransform: "capitalize",
  },
});
