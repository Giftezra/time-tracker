import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { OrderSummaryType } from "@/app/types/management/dashboard";
import { useThemeColor } from "@/hooks/useThemeColor";

const OrderSummaryComponent = ({ data }: { data: OrderSummaryType }) => {
  const backgroundColor = useThemeColor({}, "white");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const text = useThemeColor({}, "background");
  const hightlight = useThemeColor({}, "highlight");

  return (
    <View style={[styles.mainContainer, {backgroundColor:backgroundColor}]}>
      <Text style={[styles.headerText, {color:text}]}>Order Summary</Text>
      <Text style={[styles.summaryText, {color:hightlight}]}>
        The order summary contains the bill for staffs managed within a 30 day
        period
      </Text>
      <View style={styles.rowContainer}>
        <Text style={styles.subheaderText}>stafss</Text>
        <Text style={styles.valuetext}>{data.employee}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.subheaderText}>cost per staff</Text>
        <Text style={styles.valuetext}>{data.cost_per_employee}</Text>
      </View>

      <View style={styles.rowContainer}>
        <Text style={styles.subheaderText}>duration</Text>
        <Text style={styles.valuetext}>{data.duration}</Text>
      </View>

      <TouchableOpacity style={[styles.reviewBillButton, {backgroundColor:inactivebtn}]}>
        <Text style={styles.reviewBillText}>Review bill</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderSummaryComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    borderWidth: 0.5,
    padding: 5,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 10 : 14,
    fontWeight: "600",
    fontFamily: "BarlowLight",
    padding: 5,
    borderBottomWidth: 1,
    marginVertical: 10,
  },

  summaryText: {
    fontSize: Platform.OS === "web" ? 7 : 12,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    padding: 2,
  },

  rowContainer: {
    flexDirection: "row",
    width: "100%",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 1,
  },

  subheaderText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "500",
    fontFamily: "BarlowRegular",
    textTransform: "lowercase",
    padding: 2,
  },

  valuetext: {
    fontSize: Platform.OS === "web" ? 12 : 16,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
  },

  reviewBillButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 12,
    borderRadius: 2,
  },

  reviewBillText: {
    fontSize: Platform.OS === "web" ? 10 : 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
});
