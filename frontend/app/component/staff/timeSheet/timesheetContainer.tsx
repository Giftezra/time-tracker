/**
 * This component is used to display a list of all the tasks done by the user using a flatmap so that the user can see all the tasks done by the user.
 * A flatmap enables this to be loaded in a single view.
 */
import { Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import React from "react";
import TimeSheetComponent from "./timeSheet";
import { TimeSheetType } from "@/app/types/staff/timeSheet";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useTimeSheetContext } from "@/app/context/staff/timeSheetProvider";

const TimeSheetContainerComponent = () => {
  // Use the timesheet context to get the data and group the data by week
  const { groupByWeek, filteredData, timesheets, handleStatusChange, selectedStatus } =
    useTimeSheetContext();

  // Declare sections variable before using it
  let sections;
  if (selectedStatus === "all") {
    sections = groupByWeek(timesheets);
  } else {
    sections = groupByWeek(filteredData);
  }

  return (
    <GestureHandlerRootView style={styles.maincontainer}>
      {/* This part of the component contains the option to allow the user download their timesheet in pdf format */}
      <View style={styles.headerOutlineforDownload}>
        <Text style={styles.timesheetText}>Timesheet</Text>

        <Pressable style={styles.downloadbutton}>
          <AntDesign name="clouddownloado" size={15} color="black" />
        </Pressable>
      </View>

      {/* This contains the options that would be used to enable the user search filter */}
      <View style={styles.groupbycontainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.groupbyText}>filter by</Text>
        </View>
        <View style={styles.filtercontainer}>
          <Pressable
            style={[
              styles.buttons,
              selectedStatus === "approved" && {
                backgroundColor: "#E8F5E9",
                borderColor: "#81C784",
              },
            ]}
            onPress={() => handleStatusChange("approved")}
          >
            <Text style={[styles.buttonText, { color: "#2E7D32" }]}>
              approved
            </Text>
          </Pressable>
          <Pressable
            style={[
              styles.buttons,
              selectedStatus === "pending" && {
                backgroundColor: "#E8F5E9",
                borderColor: "#81C784",
              },
            ]}
            onPress={() => handleStatusChange("pending")}
          >
            <Text style={styles.buttonText}>pending</Text>
          </Pressable>
          <Pressable
            style={[
              styles.buttons,
              selectedStatus === "all" && {
                backgroundColor: "#E8F5E9",
                borderColor: "#81C784",
              },
            ]}
            onPress={() => handleStatusChange("all")}
          >
            <Text style={styles.buttonText}>all</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.task_serial + index}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => <TimeSheetComponent {...item} />}
          contentContainerStyle={{
            paddingBottom: 20,
            paddingHorizontal: 5,
          }}
          showsVerticalScrollIndicator={false}
          stickySectionHeadersEnabled={true}
          ItemSeparatorComponent={() => (
            <View
              style={{
                height: 1,
                backgroundColor: "#F0F0F0",
                marginVertical: 8,
              }}
            />
          )}
        />
      </View>
    </GestureHandlerRootView>
  );
};

export default TimeSheetContainerComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 5,
  },

  headerOutlineforDownload: {
    flexDirection: "row",
    padding: 10,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 0.5,
    borderBottomColor: "#E0E0E0",
    marginBottom: 5,
  },

  groupbycontainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    columnGap: 5,
    borderRadius: 8,
    marginBottom: 5,
  },

  innerContainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 8,
  },

  filtercontainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
    flex: 1,
    justifyContent: "flex-end",
  },

  buttons: {
    padding: 5,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    minWidth: 50,
    alignItems: "center",
  },

  buttonText: {
    fontSize: 13,
    fontWeight: "500",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    color: "#4A4A4A",
  },

  groupbyText: {
    fontSize: 14,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    color: "#2C2C2C",
  },

  sectionHeader: {
    fontSize: 14,
    fontWeight: "600",
    backgroundColor: "#DFF9FA",
    padding: 10,
    marginTop: 5,
    marginBottom: 5,
    borderRadius: 5,
    color: "#2CC2C",
    letterSpacing: 0.3,
  },

  downloadbutton: {
    padding: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "#E0E0E0",
    backgroundColor: "#FFFFFF",
    alignItems: "center",
    justifyContent: "center",
  },

  timesheetText: {
    fontSize: 18,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    color: "#1A1A1A",
    letterSpacing: 0.5,
  },
});
