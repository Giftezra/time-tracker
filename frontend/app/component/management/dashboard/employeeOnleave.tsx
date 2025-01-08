import { Image, StyleSheet, Text, View, Dimensions } from "react-native";
import React from "react";

const image = require("@/assets/images/user image.jpg");

const EmployeeOnLeaveComponent = ({
  id,
  name,
  email,
  dateFrom,
  dateTo,
}: {
  id?: string;
  name: string;
  email: string;
  dateFrom: string;
  dateTo: string;
}) => {
  /**
   * Method is used to calculate the duration of the leave by subtracting the date the employee is expected to return from the date the employee left.
   */
  const handleLeaveDate = () => {
    const date1 = new Date(dateFrom);
    const date2 = new Date(dateTo);
    const diffTime = Math.abs(date2.getTime() - date1.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  return (
    <View style={styles.mainContainer}>
      {/* Profile Image */}
      <Image source={image} style={styles.image} />

      <View style = {styles.container}>
        <View>
          <Text style={styles.nameText}>{name}</Text>
          <Text style={styles.emailText}>{email}</Text>
        </View>

        {/* Leave Details */}
        <View>
          <Text style={styles.leaveText}>{`Start: ${dateFrom}`}</Text>
          <Text style={styles.leaveText}>
            {`Will return in ${handleLeaveDate()} days`}
          </Text>
        </View>
      </View>

      {/* Employee Details */}
    </View>
  );
};

export default EmployeeOnLeaveComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    borderColor: "#ddd",
    marginVertical: 1,
    flexWrap: "wrap",
  },
  image: {
    width: 40,
    height: 40,
    borderRadius: 20,
  },
  nameText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#333",
  },
  emailText: {
    fontSize: 10,
    fontWeight: "400",
    color: "#555",
  },
  leaveText: {
    fontSize: 10,
    color: "#555",
    textAlign: "right",
  },
  container: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 2,
  }, 
});
