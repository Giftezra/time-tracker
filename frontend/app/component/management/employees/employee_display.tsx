import {
  ActivityIndicator,
  Image,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { router } from "expo-router";
import { useThemeColor } from "@/hooks/useThemeColor";

import { user_image } from "@/app/utils/images";
import { EmployeeDetailsType } from "@/app/types/management/employee";

const EmployeeContainerComponent: React.FC<EmployeeDetailsType> = (props) => {
  const primary = useThemeColor({}, "primaryColor");
  const highlight = useThemeColor({}, "highlight");
  const innerbackground = useThemeColor({}, "innerBackground");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const text = useThemeColor({}, "text");

  return (
    /* Route the admin to the employees analytics page when clicked. 
       Send the user id and accross to the next page to fetch the user that was requested  */
    <View style={[styles.container, { backgroundColor: innerbackground }]}>
      <Image source={user_image} style={styles.image} />
      {/* Constains the staffs name and details */}
      <View style={styles.nameContainer}>
        <Text style={[styles.nameText, { color: text }]}>{props.name}</Text>
        <Text style={[styles.detailsText, { color: highlight }]}>
          {props.role}
        </Text>
      </View>

      <Pressable
        style={[
          styles.container,
          {
            borderRadius: 5,
            backgroundColor: inactivebtn,
            borderBlockColor: highlight,
            borderWidth: 0.5,
          },
        ]}
        onPress={() =>
          router.push({
            pathname: "/management/(drawer)/employee/analytics",
            params: { id: props.id },
          })
        }
      >
        <View style={styles.employmentDetailsContainer}>
          <View>
            <Text style={[styles.detailsText, { color: text }]}>
              department
            </Text>
            <Text style={[styles.detailsText, { color: text }]}>
              {props.is_active}
            </Text>
          </View>

          <View>
            <Text style={[styles.detailsText, { color: text }]}>
              date hired
            </Text>
            <Text style={[styles.detailsText, { color: text }]}>
              {props.date_hired}
            </Text>
          </View>
        </View>

        <View style={styles.detailsContainer}>
          <AntDesign name="mail" size={20} color={text} style={styles.icons} />
          <Text style={[styles.detailsText, { color: text }]}>
            {props.email}
          </Text>
        </View>
        <View style={styles.detailsContainer}>
          <MaterialIcons
            name="phone"
            size={20}
            color={text}
            style={styles.icons}
          />
          <Text style={[styles.detailsText, { color: text }]}>
            {props.phone}
          </Text>
        </View>
      </Pressable>
    </View>
  );
};

export default EmployeeContainerComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    padding: 2,
    height: 300,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.3,
  },

  image: {
    width: 50,
    height: 50,
    alignSelf: "center",
    borderRadius: 40,
    padding: 10,
    marginTop: 10,
  },

  nameContainer: {
    width: "100%",
    padding: 5,
    alignItems: "center",
  },

  employmentDetailsContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 10,
    alignItems: "center",
  },

  detailsContainer: {
    flexDirection: "row",
    padding: 5,
    alignItems: "center",
  },

  nameText: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  subheaderText: {
    fontSize: 14,
    fontFamily: "OswaldVariable",
    textTransform: "capitalize",
    fontWeight: "400",
    marginVertical: 5,
  },

  detailsText: {
    fontSize: 13,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    fontWeight: "600",
  },

  icons: {
    marginHorizontal: 10,
  },
});
