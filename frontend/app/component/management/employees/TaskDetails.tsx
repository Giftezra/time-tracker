import React from "react";
import { View, Text, StyleSheet } from "react-native";
import { useThemeColor } from "@/hooks/useThemeColor";
import { TaskDetailsProps } from "@/app/types/management/employee";
import { useEmployeeContext } from "@/app/context/management/employee/employeeContext";

const TaskDetails:React.FC<TaskDetailsProps> = (props) => {

  const text = useThemeColor({}, "text");
  const highlight = useThemeColor({}, "highlight");
  const innerBackground = useThemeColor({}, "innerBackground");
  const inactivebtn = useThemeColor({}, "inactivebtn");

  return (
    <View style={styles.detailsContainer}>
      <View style={styles.manageWorkContainer}>
        <View
          style={[
            styles.totalProjectsContainer,
            { borderBlockColor: highlight, shadowColor: innerBackground },
          ]}
        >
          <Text style={[styles.detailsText, { color: text }]}>
            {props?.total_tasks}
          </Text>
          <Text>total projects</Text>
        </View>
        <View style={styles.projectDetailsRowContainer}>
          <View style={styles.projectDetailsContainer}>
            <View style={styles.projectDetailsInnerRowContainer}>
              <View style={styles.projectDetailsView}>
                <Text style={styles.projectDetailsText}>
                  tasks selected
                </Text>
                <Text
                  style={[
                    styles.projectDetailsCounter,
                    { backgroundColor: inactivebtn },
                  ]}
                >
                  {props?.total_selected_tasks}
                </Text>
              </View>
              <View style={styles.projectDetailsView}>
                <Text style={styles.projectDetailsText}>
                  tasks assigned
                </Text>
                <Text
                  style={[
                    styles.projectDetailsCounter,
                    { backgroundColor: inactivebtn },
                  ]}
                >
                  {props?.total_assigned_tasks}
                </Text>
              </View>
            </View>
            <View style={styles.projectDetailsInnerRowContainer}>
              <View style={styles.projectDetailsView}>
                <Text style={styles.projectDetailsText}>
                  tasks completed
                </Text>
                <Text
                  style={[
                    styles.projectDetailsCounter,
                    { backgroundColor: inactivebtn },
                  ]}
                >
                  {props?.total_completed_tasks}
                </Text>
              </View>
              <View style={styles.projectDetailsView}>
                <Text style={styles.projectDetailsText}>
                  tasks cancelled
                </Text>
                <Text
                  style={[
                    styles.projectDetailsCounter,
                    { backgroundColor: inactivebtn },
                  ]}
                >
                  {props?.total_cancelled_tasks}
                </Text>
              </View>
            </View>
          </View>
        </View>
      </View>

      <View style={styles.mapcointainer}>
        <Text>
          implement a map here to display the users current location while on a
          task
        </Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  detailsContainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
  },
  manageWorkContainer: {
    flexShrink: 1,
    flexDirection: "column",
    justifyContent: "center",
    alignItems: "center",
    padding: 10,
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
  detailsText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
  projectDetailsRowContainer: {
    flexShrink: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    flexWrap: "wrap",
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
  mapcointainer: {
    flex: 1,
    flexGrow: 1,
    flexDirection: "column",
    justifyContent: "space-between",
    marginStart: 10,
    padding: 5,
  },
});

export default TaskDetails;
