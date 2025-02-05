import { FlatList, StyleSheet, Text, View } from "react-native";
import React, { useState } from "react";
import DashboardWelcomeHeader from "@/app/component/management/dashboard/welcomeHeader";
import TodayEventsComponent from "@/app/component/management/dashboard/todayEvents";
import { ScrollView } from "react-native-gesture-handler";
import EmployeeAnalyticsComponent from "@/app/component/management/employees/employeeAnalytics";
import EmployeeOnLeaveComponent from "@/app/component/management/dashboard/employeeOnleave";
import { useThemeColor } from "@/hooks/useThemeColor";
import { SafeAreaProvider } from "react-native-safe-area-context";
import LeaderBoardComponent from "@/app/component/management/dashboard/leaderBoard";
import ContractChartComponent from "@/app/component/management/dashboard/contractChart";
import TaskChartComponent from "@/app/component/management/dashboard/taskChart";

const event = ["johns birthday", "mary resumption"];

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

const MobileDashboard = () => {
  const white = useThemeColor({}, "white");
  const [width, setWidth] = useState(0);

  return (
    <SafeAreaProvider>
      <ScrollView style={styles.maincontainer}>
        <DashboardWelcomeHeader />
        <View style={{ padding: 5 }}>
          <TodayEventsComponent event={event} />
        </View>
        <View style={[styles.containers, { maxHeight: 200 }]}>
          <Text style={styles.headerText}>employees on leave</Text>
          <ScrollView showsVerticalScrollIndicator={false}>
            {employeeData.map((item) => (
              <EmployeeOnLeaveComponent
                key={item.id}
                id={item.id}
                name={item.name}
                email={item.email}
                dateFrom={item.dateFrom}
                dateTo={item.dateTo}
              />
            ))}
          </ScrollView>
        </View>

        {/* This contains the employee analytics component which would be the chart data. */}
        <View
          onLayout={(event) => {
            const { width } = event.nativeEvent.layout;
            setWidth(width);
          }}
        >
          <ContractChartComponent width={width} />
        </View>

        {/* This component is for the task chart. Whichwould be used to display
        1. total tasks completed
        2. total tasks pending
        3. total tasks in progress
        4. total tasks completed
        */}
        <View style={[styles.containers]}>
          <TaskChartComponent width={width} title="total tasks completed" />
        </View>

        {/* This contains the leaderboard component */}
        <View style={styles.containers}>
          <Text
            style={[styles.headerText, { paddingTop: 5, paddingHorizontal: 5 }]}
          >
            leader board
          </Text>
          <LeaderBoardComponent />
        </View>
        
      </ScrollView>
    </SafeAreaProvider>
  );
};

export default MobileDashboard;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },

  containers: {
    borderRadius: 2,
    borderWidth: 0.3,
    padding: 1,
  },

  headerText: {
    fontSize: 18,
    fontFamily: "BarlowBold",
    fontWeight: "400",
    textTransform: "capitalize",
    marginBottom: 10,
  },
});
