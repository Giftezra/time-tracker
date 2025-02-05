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
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          padding: 2,
        }}
      >
        <View style={styles.welcometextContainer}>
          <Text
            style={styles.welcometext}
          >{`welcome ${user?.first_name}`}</Text>
          <Text style={styles.otherText}>lets finish our task for the day</Text>
        </View>

        {/* Display this only when the user is the owner of the company.
        When clicked the button takes the owner to the sunscription and payment page */}
        {role === "Owner" && (
          <Pressable
            style={styles.button}
            onPress={() => router.navigate("/management/checkout/main")}
          >
            <Text style={styles.buttonText}>go to payment page</Text>
          </Pressable>
        )}
      </View>

      <View style={styles.todaysTaskContainer}>
        <Text style={styles.todaystaskText}>today's task</Text>
        <Text style={styles.otherText}>
          {role === "Owner"
            ? "check your companies growth and scheduels for the day"
            : "check your daily schedule"}
        </Text>

        <Pressable
          style={styles.calendarButton}
          onPress={() => router.navigate("/management/calendar/main")}
        >
          <Text style={styles.buttonText}>today's calender</Text>
        </Pressable>
      </View>
    </View>
  );
};

export default DashboardWelcomeHeader;

const styles = StyleSheet.create({
  maincontainer: {
    width: "100%",
    flexDirection: "column",
  },

  welcometextContainer: {
    flexGrow: 1,
    flexDirection: "column",
    padding: 2,
  },

  welcometext: {
    fontFamily: "RobotoRegular",
    fontSize: 15,
    fontWeight: "bold",
    textTransform: "capitalize",
  },

  otherText: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    textTransform: "capitalize",
  },

  todaysTaskContainer: {
    flexGrow: 1,
    padding: 5,
    flexWrap: "wrap",
    borderRadius: 10,
    marginTop: 10,
    width: "100%",
  },

  todaystaskText: {
    fontSize: 20,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    textTransform: "capitalize",
  },

  button: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 0.3,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
    shadowRadius: 5,
    shadowOpacity: 0.7,
    shadowColor: "grey",
  },

  buttonText: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    textTransform: "capitalize",
  },

  calendarButton: {
    padding: 10,
    borderRadius: 5,
    borderWidth: 0.3,
    alignItems: "center",
    marginTop: 10,
    elevation: 5,
    shadowRadius: 5,
    shadowOpacity: 0.7,
    shadowColor: "grey",
    width: "100%",
    backgroundColor: "white",
  },
});
