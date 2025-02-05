import {
  FlatList,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React from "react";
import LeaderBoardCardComponent from "./leaderBoardCardComponent";
import OtherEmployeeOnLeaderboard from "./otherEmployeeLeaderboard";
import { id } from "react-native-paper-dates";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { useThemeColor } from "@/hooks/useThemeColor";

const leaderBoardData = [
  {
    name: "John Doe",
    role: "Software Engineer",
    totalTasks: 20,
  },
  {
    name: "Jane Doe",
    role: "Software Engineer",
    totalTasks: 15,
  },
  {
    name: "John Smith",
    role: "Product Manager",
    totalTasks: 10,
  },
  {
    name: "Alice Brown",
    role: "Designer",
    totalTasks: 5,
  },
];

const otherEmployeeData = [
  {
    id: "1",
    name: "John Doe",
    email: "johndoes@example.com",
    phone: "1234567890",
    role: "Software Engineer",
    taskCompleted: 20,
    lineData: [{ value: 0 }, { value: 5 }, { value: 2 }, { value: 1 }],
  },
  {
    id: "2",
    name: "John Doe",
    email: "johndoes@example.com",
    phone: "1234567890",
    role: "Software Engineer",
    taskCompleted: 20,
    lineData: [{ value: 5 }, { value: 0 }, { value: 2 }, { value: 3 }],
  },
];

const LeaderBoardComponent = () => {
  const background = useThemeColor({}, "white");
  const otherText = useThemeColor({}, "otherText");
  const innerBackground = useThemeColor({}, "innerBackground");

  return (
    <GestureHandlerRootView
      style={[styles.container, { backgroundColor: background }]}
    >
      <View>
        <Text
          style={{
            fontSize: 14,
            fontWeight: "500",
            fontFamily: "BarlowRegular",
            textTransform: "uppercase",
            marginBottom: 5,
          }}
        >
          top employees
        </Text>
        <ScrollView horizontal={true} showsVerticalScrollIndicator={false}>
          {leaderBoardData.map((item, index) => (
            <LeaderBoardCardComponent
              key={index}
              name={item.name}
              role={item.role}
              totalTasks={item.totalTasks}
            />
          ))}
        </ScrollView>
      </View>

      <View style={{ height: 200 }}>
        <View style={styles.otherEmployeeTextContainer}>
          <View>
            <Text style={styles.otherEmployeeText}>other employees</Text>
          </View>

          <View style={styles.otherEmployeeButtonContainer}>
            <TouchableOpacity
              style={[
                styles.otherEmployeebtn,
                { backgroundColor: innerBackground },
              ]}
            >
              <Text style={[styles.otherEmployeebtnText, { color: otherText }]}>
                weekly
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.otherEmployeebtn,
                { backgroundColor: innerBackground },
              ]}
            >
              <Text style={[styles.otherEmployeebtnText, { color: otherText }]}>
                monthly
              </Text>
            </TouchableOpacity>
          </View>
        </View>

        <ScrollView showsVerticalScrollIndicator={false}>
          {otherEmployeeData.map((item) => (
            <OtherEmployeeOnLeaderboard
              key={item.id}
              id={item.id}
              name={item.name}
              email={item.email}
              phone={item.phone}
              role={item.role}
              taskCompleted={item.taskCompleted}
              onPress={() => {
                console.log(`profile ${item.id}`); // naviagte to the user profile when clicked
              }}
            />
          ))}
        </ScrollView>
      </View>
    </GestureHandlerRootView>
  );
};

export default LeaderBoardComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
    elevation: 5,
    shadowRadius: 5,
    marginStart: 5,
  },

  scrollViewContent: {
    flexDirection: "column",
    flexWrap: "wrap",
    justifyContent: "space-between",
  },

  otherEmployeeTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    padding: 5,
    marginVertical: 5,
    width: "100%",
  },

  otherEmployeeText: {
    fontSize: 13,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  otherEmployeeButtonContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    columnGap: 10,
  },

  otherEmployeebtn: {
    padding: 5,
    borderRadius: 5,
    shadowRadius: 5,
    elevation: 5,
    shadowOpacity: 0.5,
    borderWidth: 0.3,
  },

  otherEmployeebtnText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "400",
    textTransform: "lowercase",
  },
});
