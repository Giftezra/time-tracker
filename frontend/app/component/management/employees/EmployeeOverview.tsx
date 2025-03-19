import React from "react";
import { View, Text, Image, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { EmployeeOverviewInterface } from "@/app/types/management/employee";

const EmployeeOverview:React.FC<EmployeeOverviewInterface> = (props) => {

  const text = useThemeColor({}, "text");
  const highlight = useThemeColor({}, "highlight");
  const innerBackground = useThemeColor({}, "innerBackground");

  return (
    <View
      style={[styles.worklogContainer, { backgroundColor: innerBackground }]}
    >
      <Text style={[styles.roleText, { color: highlight }]}>
        {props?.role}
      </Text>
      <View style={styles.nameAndImageContainer}>
        <View>
          <Text style={[styles.nameText, { color: text }]}>
            {props?.name}
          </Text>
          <Text style={[styles.nameText, { fontSize: 10, color: text }]}>
            {props?.email}
          </Text>
        </View>
      </View>
      <View style={styles.innerRowsFordatehired}>
        <Text style={[styles.detailsText, { color: text }]}>hired</Text>
        <Text style={[styles.detailsText, { color: text }]}>
          {props?.date_hired || "N/A"}
        </Text>
      </View>
      <View style={styles.innerRowsFordatehired}>
        <Text style={[styles.detailsText, { color: text }]}>dob</Text>
        <Text style={[styles.detailsText, { color: text }]}>
          {props?.dob || "N/A"}
        </Text>
      </View>
      <Text style={[styles.detailsText, { color: text, padding: 5 }]}>
        {props?.phone || "N/A"}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  worklogContainer: {
    flex: 1,
    flexGrow: 1,
    flexWrap: "wrap",
    flexDirection: "column",
    justifyContent: "space-between",
    padding: 5,
    borderWidth: 1,
    marginHorizontal: 5,
  },
  nameAndImageContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    flexWrap: "wrap",
  },
  nameText: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    padding: 2,
  },
  roleText: {
    fontSize: 10,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
    alignSelf: "flex-end",
  },
  image: {
    width: 50,
    height: 50,
    borderRadius: 50,
    borderWidth: 2,
    borderColor: "gray",
  },
  innerRowsFordatehired: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    alignItems: "center",
    overflow: "hidden",
  },
  detailsText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
});

export default EmployeeOverview;
