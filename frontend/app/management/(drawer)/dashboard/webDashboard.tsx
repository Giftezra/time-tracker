import {
  Dimensions,
  FlatList,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { useDashboardContext } from "@/app/context/management/dashboard/dashboardContext";
import DashboardWelcomeHeader from "@/app/component/management/dashboard/welcomeHeader";
import BillingComponent from "@/app/component/management/dashboard/billlingComponent";
import ExpenseComponent from "@/app/component/management/dashboard/expense";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import TaskChartComponent from "@/app/component/management/dashboard/taskChart";
import ContractChartComponent from "@/app/component/management/dashboard/contractChart";
import EmployeeOnLeaveComponent from "@/app/component/management/dashboard/employeeOnleave";
import { useThemeColor } from "@/hooks/useThemeColor";
import TodayEventsComponent from "@/app/component/management/dashboard/todayEvents";
import LeaderBoardComponent from "@/app/component/management/dashboard/leaderBoard";
import { id } from "react-native-paper-dates";
import SideComponent from "@/app/component/helper/sideComponent";
import { useAuth } from "@/app/context/authentication";

const employeeData = [
  {
    id: "1",
    name: "john doe",
    email: "johndoe@example.com",
    dateFrom: "2021-08-01",
    dateTo: "2021-08-01",
  },
  {
    id: "2",
    name: "jane doe",
    email: "johndoe@example.com",
    dateFrom: "2021-08-01",
    dateTo: "2021-08-01",
  },
  {
    id: "3",
    name: "john doe",
    email: "johndoe@example.com",
    dateFrom: "2021-08-01",
    dateTo: "2021-08-01",
  },
  {
    id: "4",
    name: "jane doe",
    email: "johndoe@example.com",
    dateFrom: "2021-08-01",
    dateTo: "2021-08-01",
  },
];

const event = ["johns birthday", "mary resumption"];

const WebDashboard = () => {
  const { screenWidth, windowWidth } = useAuth();
  const [taskChartWidth, setTaskChartWidth] = useState(0);
  const [contractChartWidth, setContractChartWidth] = useState(0);
  const screen = Dimensions.get("screen");

  const white = useThemeColor({}, "white");

  return (
    /** This is the main web dashboard. this */
    <GestureHandlerRootView
      style={[styles.maincontainer, { width: windowWidth }]}
    >
      <View style={{ width: windowWidth * 0.2 }}>
        <SideComponent />
      </View>

      <ScrollView
        style={{ width: windowWidth * 0.8 }}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.headerContainer}>
          <DashboardWelcomeHeader />
        </View>
        {/* This view contains the component for bothe the right and left hand side of the dashboard */}
        <View style={[styles.rowcontainer]}>
          {/* Left and side of the dashboard */}
          <View style={{ width: "70%" }}>
            <View
              style={[styles.innerleftcontainers]}
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setContractChartWidth(width);
              }}
            >
              <ContractChartComponent width={contractChartWidth} />
            </View>

            <View style={[styles.overviewContainer]}>
              <LeaderBoardComponent />
            </View>
          </View>

          {/* Right hand side of the dashboard */}
          <View style={[styles.rightContainer, { width: "30%" }]}>
            <View style={{ width: "100%", marginBottom: 5 }}>
              <TodayEventsComponent event={event} />
            </View>

            <View
              style={[
                {
                  width: "100%",
                  height: "20%",
                  borderRadius: 5,
                  borderWidth: 0.3,
                  padding: 5,
                  elevation: 5,
                  shadowRadius: 5,
                  shadowOpacity: 0.5,
                },
                { backgroundColor: white },
              ]}
            >
              <Text
                style={{
                  fontSize: 15,
                  fontFamily: "BarlowLight",
                  fontWeight: "400",
                  textTransform: "capitalize",
                  marginBottom: 10,
                }}
              >
                employees on leave
              </Text>

              <FlatList
                data={employeeData}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                  <EmployeeOnLeaveComponent
                    id={item.id}
                    name={item.name}
                    email={item.email}
                    dateFrom={item.dateFrom}
                    dateTo={item.dateTo}
                  />
                )}
                showsHorizontalScrollIndicator={false}
              />
            </View>

            <View
              style={[styles.innerleftcontainers]}
              onLayout={(event) => {
                const { width } = event.nativeEvent.layout;
                setTaskChartWidth(width);
              }}
            >
              <TaskChartComponent width={taskChartWidth} title="task" />
            </View>
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default WebDashboard;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: "row",
  },

  rowcontainer: {
    flex: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
  },

  leftContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    marginHorizontal: 5,
  },

  rightContainer: {
    padding: 5,
    flexDirection: "column",
    alignItems: "center",
  },

  overviewContainer: {
    flexDirection: "column",
  },

  overviews: {
    flexDirection: "row",
    justifyContent: "space-between",
  },

  taskOverview: {
    padding: 5,
    margin: 10,
    borderRadius: 5,
    borderWidth: 1,
  },

  contractOverview: {
    flexGrow: 1,
    padding: 5,
    borderRadius: 10,
    borderWidth: 1,
    marginEnd: 10,
  },

  headerContainer: {
    width: "100%",
    padding: 5,
    marginBottom: 20,
  },

  innerleftcontainers: {
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    padding: 5,
    borderRadius: 5,
    borderWidth: 1,
    margin: 5,
    shadowRadius: 10,
    elevation: 10,
  },
});
