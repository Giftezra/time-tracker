import { Pressable, StyleSheet, Text, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useDashboardContext } from "@/app/context/management/dashboard/dashboardContext";
import { router } from "expo-router";
import { userData } from "@/app/utils/loadData";

const DashboardWelcomeHeader = () => {
  const user = userData();

  const [role, setRole] = useState<string>("");

  useEffect(() => {
    if (user) {
      setRole(user.is_owner ? "Owner" : "Staff");
    }
  }, [user]);

  return (
    <View style={styles.maincontainer}>
      <View style={styles.headerRow}>
        <View style={styles.welcometextContainer}>
          <Text style={styles.welcometext}>
            Welcome back, {user?.first_name}
          </Text>
          <Text style={styles.otherText}>
            {role === "Owner"
              ? "Monitor your business performance and daily activities"
              : "Track your tasks and daily activities"}
          </Text>
        </View>

        {role === "Owner" && (
          <Pressable
            style={({ pressed }) => [
              styles.subscriptionButton,
              pressed && styles.buttonPressed,
            ]}
            onPress={() => router.push("/management/(drawer)/checkout/main")}
          >
            <Text style={styles.buttonText}>Manage Subscription</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.todaysTaskContainer}>
        <Text style={styles.todaystaskText}>Daily Overview</Text>
        <Text style={styles.otherText}>
          {role === "Owner"
            ? "View company performance metrics and scheduled activities"
            : "Review your schedule and assigned tasks"}
        </Text>

        <Pressable
          style={({ pressed }) => [
            styles.calendarButton,
            pressed && styles.buttonPressed,
          ]}
          onPress={() => router.navigate("/management/calendar/main")}
        >
          <Text style={styles.calendarButtonText}>View Calendar</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DashboardWelcomeHeader;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: "column",
    backgroundColor: "#FFFFFF",
    padding: 10,
  },

  headerRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
  },

  welcometextContainer: {
    flexGrow: 1,
    flexDirection: "column",
  },

  welcometext: {
    fontFamily: "RobotoRegular",
    fontSize: 24,
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 4,
  },

  otherText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    color: "#666666",
    lineHeight: 20,
  },

  todaysTaskContainer: {
    flexGrow: 1,
    padding: 16,
    borderRadius: 8,
    backgroundColor: "#F8F9FA",
    marginTop: 8,
  },

  todaystaskText: {
    fontSize: 18,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    color: "#1A1A1A",
    marginBottom: 8,
  },

  subscriptionButton: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 6,
    backgroundColor: "#F8F9FA",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  },

  buttonPressed: {
    opacity: 0.8,
    transform: [{ scale: 0.98 }],
  },

  buttonText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    color: "#4A4A4A",
  },

  calendarButton: {
    padding: 12,
    borderRadius: 6,
    alignItems: "center",
    marginTop: 16,
    backgroundColor: "#2563EB",
  },

  calendarButtonText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    color: "#FFFFFF",
  },
});
