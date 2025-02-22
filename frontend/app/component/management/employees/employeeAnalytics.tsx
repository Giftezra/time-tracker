/**
 * The component is used to handle the employees panel which displays an overview of the employees in the company.
 * The component displays the overview in the left hand side of the screen and also displays the analytics of the
 * employees in the right hand side.
 * Details  to be displayed include the total number of hours done by the employee, the total number of unassigned
 * tasks completed by the employee, the employees most worked day and hour, the employee most recent job and if the
 * are currently working on a job.
 */
import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

import { EmployeeAnalyticInterface } from "@/app/types/management/employee";

/**
 * The function calculates the total number of tasks assigned to the employee
 * @param props
 * @returns
 */
const calculateTotalTasks = (props: EmployeeAnalyticInterface) => {
  return props.number_of_assigned_tasks + props.number_of_unassigned_tasks;
};

const EmployeeAnalyticsComponent: React.FC<{
  props: EmployeeAnalyticInterface;
  onModalClose: () => void;
}> = ({ props, onModalClose }) => {
  const primaryColor = useThemeColor({}, "primaryColor");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const text = useThemeColor({}, "text");
  const highlight = useThemeColor({}, "highlight");
  const innerBackground = useThemeColor({}, "innerBackground");
  const inactivebtn = useThemeColor({}, "inactivebtn");

  const [isModalClose, setIsModalClose] = useState(false);

  /* Returna JSX view */
  return (
    <ScrollView
      style={[styles.mainContainer, { backgroundColor: secondaryColor }]}
    >
      {/* Contains the analytics of the employee */}
      {/* Displays the users details overview which contains the name, email, phone and other important details */}

      <View style={styles.mainOverviewContainer}>
        <View
          style={[
            styles.worklogContainer,
            { backgroundColor: innerBackground },
          ]}
        >
          <Text style={[styles.roleText, { color: highlight }]}>
            {props.role}
          </Text>
          <View style={styles.nameAndImageContainer}>
            <View>
              <Text style={[styles.nameText, { color: text }]}>
                {props.name}
              </Text>
              <Text style={[styles.nameText, { fontSize: 10, color: text }]}>
                {props.email}
              </Text>
            </View>
            <Image source={props.image} style={[styles.image]} />
          </View>
          {/* Row position for the date hired */}
          <View style={styles.innerRowsFordatehired}>
            <Text style={[styles.detailsText, { color: text }]}>
              employed on
            </Text>
            <Text style={[styles.detailsText, { color: text }]}>
              {props.date_hired}
            </Text>
          </View>
          <View style={styles.innerRowsFordatehired}>
            <Text style={[styles.detailsText, { color: text }]}>dob</Text>
            <Text style={[styles.detailsText, { color: text }]}>
              {props.dob}
            </Text>
          </View>
          <Text style={[styles.detailsText, { color: text, padding: 5 }]}>
            {props.phone}
          </Text>
          <Text style={[styles.detailsText, { color: text, padding: 5 }]}>
            {props.dob}
          </Text>
        </View>

        {/* Contains the view that enable shift processing and shift start.
         */}
        <View
          style={[
            styles.worklogContainer,
            { backgroundColor: innerBackground },
          ]}
        >
          <Text style={[styles.worklogDetailsText, { color: text }]}>
            {props.name} work log
          </Text>
          <View>
            <Text style={[styles.worklogDetailsText, { color: text }]}>
              Feb 11 2012
            </Text>
            <Text
              style={[
                styles.worklogDetailsText,
                {
                  fontSize: 20,
                  fontWeight: "bold",
                  color: highlight,
                  marginTop: 5,
                },
              ]}
            >
              08:10:20
            </Text>
            <Text
              style={[
                styles.worklogDetailsText,
                { fontSize: 12, marginBottom: 10 },
              ]}
            >
              work schedule
            </Text>
            <View style={styles.clockinClockoutContainer}>
              <View style={styles.clockinClockoutTextContainer}>
                <Text
                  style={[styles.clockinClockoutText, { color: highlight }]}
                >
                  Clock in
                </Text>
                <Text
                  style={[styles.clockinClockoutText, { color: highlight }]}
                >
                  10:00:12
                </Text>
                <TouchableOpacity
                  style={[
                    styles.clockinClockoutButton,
                    {
                      backgroundColor: primaryColor,
                      shadowColor: secondaryColor,
                      borderBlockColor: highlight,
                    },
                  ]}
                >
                  <Text style={styles.clockinClockoutButtonText}>
                    start shift
                  </Text>
                </TouchableOpacity>
              </View>
              <View style={styles.clockinClockoutTextContainer}>
                <Text
                  style={[styles.clockinClockoutText, { color: highlight }]}
                >
                  Clock out
                </Text>
                <Text
                  style={[styles.clockinClockoutText, { color: highlight }]}
                >
                  10:00:12
                </Text>
                <TouchableOpacity
                  style={[
                    styles.clockinClockoutButton,
                    {
                      backgroundColor: primaryColor,
                      shadowColor: primaryColor,
                      borderBlockColor: highlight,
                    },
                  ]}
                >
                  <Text style={styles.clockinClockoutButtonText}>
                    end shift
                  </Text>
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* The details component contains the details of each individual shifts and task completed by the user. 
      
      */}
      <View style={styles.detailsContainer}>
        <View style={styles.manageWorkContainer}>
          <View
            style={[
              styles.totalProjectsContainer,
              { borderBlockColor: highlight, shadowColor: innerBackground },
            ]}
          >
            <Text style={[styles.detailsText, { color: text }]}>
              {calculateTotalTasks(props)}
            </Text>
            <Text>total projects</Text>
          </View>
          {/* This part of the view contains a details of the employees projects or shifts covered */}
          <View style={styles.projectDetailsRowContainer}>
            <View style={styles.projectDetailsContainer}>
              <View style={styles.projectDetailsInnerRowContainer}>
                <View style={[styles.projectDetailsView]}>
                  <Text style={styles.projectDetailsText}>
                    projects completed
                  </Text>
                  <Text
                    style={[
                      styles.projectDetailsCounter,
                      { backgroundColor: inactivebtn },
                    ]}
                  >
                    {props.total_number_of_project_completed}
                  </Text>
                </View>
                <View style={styles.projectDetailsView}>
                  <Text style={styles.projectDetailsText}>
                    projects cancelled
                  </Text>
                  <Text
                    style={[
                      styles.projectDetailsCounter,
                      { backgroundColor: inactivebtn },
                    ]}
                  >
                    {props.total_cancellations}
                  </Text>
                </View>
              </View>
              <View style={styles.projectDetailsInnerRowContainer}>
                <View style={styles.projectDetailsView}>
                  <Text style={styles.projectDetailsText}>assigned task</Text>
                  <Text
                    style={[
                      styles.projectDetailsCounter,
                      { backgroundColor: inactivebtn },
                    ]}
                  >
                    {props.number_of_assigned_tasks}
                  </Text>
                </View>
                <View style={styles.projectDetailsView}>
                  <Text style={styles.projectDetailsText}>unassigned task</Text>
                  <Text
                    style={[
                      styles.projectDetailsCounter,
                      { backgroundColor: inactivebtn },
                    ]}
                  >
                    {props.number_of_unassigned_tasks}
                  </Text>
                </View>
              </View>
            </View>
          </View>
        </View>

        <View style={styles.mapcointainer}>
          <Text>
            implement a map here to display the users current location while on
            a task
          </Text>
        </View>
      </View>
    </ScrollView>
  );
};

export default EmployeeAnalyticsComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    padding: 5,
  },

  detailsContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
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
    color: "red",
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
  },

  detailsText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    color: "grey",
  },

  mainOverviewContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-between",
  },

  mapcointainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    marginStart: 10,
    padding: 5,
  },

  manageWorkContainer: {
    flexShrink: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
  },

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

  worklogDetailsText: {
    fontSize: 12,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
  },

  clockinClockoutContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    justifyContent: "space-between",
    rowGap: 5,
  },

  clockinClockoutTextContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
  },

  clockinClockoutText: {
    fontSize: 12,
    fontWeight: "normal",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
    padding: 2,
  },

  clockinClockoutButton: {
    flexGrow: 1,
    padding: 5,
    borderWidth: 1,
    borderRadius: 5,
    marginTop: 5,
    elevation: 10,
    shadowRadius: 10,
  },

  clockinClockoutButtonText: {
    fontSize: 13,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
    color: "white",
  },

  projectDetailsRowContainer: {
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
  },

  projectHeaderText: {
    fontSize: 18,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    padding: 2,
  },

  totalProjectsContainer: {
    borderRadius: 50,
    borderWidth: 2,
    alignContent: "center",
    width: 100,
    height: 100,
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
    shadowRadius: 5,
    elevation: 5,
  },

  projectDetailsContainer: {
    flex: 1,
    padding: 10,
    flexDirection: "column",
    justifyContent: "space-between",
    marginHorizontal: 10,
    marginEnd: 10,
  },

  projectDetailsInnerRowContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    alignItems: "center",
    flexWrap: "wrap",
  },

  projectDetailsView: {
    flexDirection: "column",
    padding: 10,
    alignItems: "center",
  },

  projectDetailsText: {
    fontSize: 12,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    padding: 2,
    marginBottom: 5,
  },

  projectDetailsCounter: {
    fontSize: 20,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    padding: 5,
    width: 50,
    height: 50,
    borderRadius: 30,
    color: "black",
    textAlign: "center",
    textAlignVertical: "center",
  },
});
