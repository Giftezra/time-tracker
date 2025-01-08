/**
 * Component is used to define the billing component of the admin dashboard.
 * The component takes no props but retrieves the billing based on the total number of staffs held by a company.
 * The component is available only to the owner of the company.
 */

import {
  Platform,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import { OrderSummaryType } from "@/app/types/management/dashboard";
import OrderSummaryComponent from "./ordersummary";
import { GestureHandlerRootView } from "react-native-gesture-handler";

const BillingComponent = () => {
  /**
   * Get the colors based on the user device theme
   */
  const innerBackground = useThemeColor({}, "innerBackground");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const activebtn = useThemeColor({}, "activebtn");
  const text = useThemeColor({}, "text");

  const data = {
    staffs: 20,
    cost_per_staff: 5,
    owner: "John Doe",
  };

  const total = data.staffs * data.cost_per_staff;

  return (
    <ScrollView
      style={styles.scrollview}
      showsHorizontalScrollIndicator={false}
      nestedScrollEnabled={true}
    >
      <GestureHandlerRootView
        style={[styles.maincontainer, { backgroundColor: innerBackground }]}
      >
        <Text style={styles.headerText}>Billing</Text>
        <View style={styles.container}>
          <Text style={styles.noteText}>
            bills are calcuted based on the number of staffs in your company.
            please find your most recent bill below.
          </Text>
        </View>

        <View style={{ flexGrow: 0.5, padding: 5 }}>
          <OrderSummaryComponent
            data={{
              employee: data.staffs,
              cost_per_employee: data.cost_per_staff,
              duration: 30,
            }}
          />
        </View>

        <View style={styles.container}>
          <Text style={styles.noteText}>
            hello mr {data.owner}, kindly clear your bill with 48 hours to enjoy
            unterruped services. if you disagree with the bill or may want to
            discuss with us, contact us
          </Text>

          <Pressable>
            <Text
              style={[{ textDecorationLine: "underline" }, styles.noteText]}
            >
              here
            </Text>
          </Pressable>
        </View>

        <View style={[styles.buttonContainer]}>
          <TouchableOpacity
            style={[styles.paymentButtons, { backgroundColor: inactivebtn }]}
          >
            <Text>Pay with card</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentButtons, { backgroundColor: inactivebtn }]}
          >
            <Text>google pay</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.paymentButtons, { backgroundColor: inactivebtn }]}
          >
            <Text>Apple pay</Text>
          </TouchableOpacity>
        </View>
      </GestureHandlerRootView>
    </ScrollView>
  );
};

export default BillingComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 2,
  },

  container: {
    width: "100%",
    flexDirection: "row",
    flexWrap: "wrap",
    padding: 5,
  },

  noteText: {
    alignItems: "center",
    fontSize: Platform.OS === "web" ? 8 : 12,
    fontWeight: "400",
    color: "grey",
    textTransform: "lowercase",
    fontFamily: "BarlowLight",
  },

  headerText: {
    fontSize: 15,
    fontWeight: "600",
    fontFamily: "BarlowLight",
    textTransform: "uppercase",
    padding: 10,
    alignSelf: "center",
  },

  buttonContainer: {
    width: "100%",
    flexDirection: "column",
    padding: 10,
    alignItems: "center",
  },

  paymentButtons: {
    width: "100%",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
    borderRadius: 5,
    elevation: 5,
    shadowRadius: 5,
    shadowOpacity: 0.4,
    borderWidth: 0.4,
    marginBottom: 10,
  },

  totalText: {
    fontSize: Platform.OS === "web" ? 10 : 18,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
    textTransform: "uppercase",
  },

  scrollview: {
    flex: 1,
    width: "100%",
  },
});
