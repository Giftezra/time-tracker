import { FlatList, StyleSheet, Text, View } from "react-native";
import React from "react";
import DashboardWelcomeHeader from "@/app/component/management/dashboard/welcomeHeader";
import TodayEventsComponent from "@/app/component/management/dashboard/todayEvents";
import { ScrollView } from "react-native-gesture-handler";
import EmployeeAnalyticsComponent from "@/app/component/management/employees/employeeAnalytics";
import EmployeeOnLeaveComponent from "@/app/component/management/dashboard/employeeOnleave";
import {useThemeColor} from "@/hooks/useThemeColor";

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

  return (
    <ScrollView style={styles.maincontainer}>
      <View style={{flex: 1}}>
        <DashboardWelcomeHeader />
        <View style={{ padding: 5 }}>
          <TodayEventsComponent event={event} />
        </View>
        <View
          style={[
            {
              width: "100%",
              height: 200,
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
      </View>
    </ScrollView>
  );
};

export default MobileDashboard;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
  },
});
