/**
 * This component is used to display a list of all the tasks done by the user using a flatmap so that the user can see all the tasks done by the user.
 * A flatmap enables this to be loaded in a single view.
 */
import { Pressable, SectionList, StyleSheet, Text, View } from "react-native";
import React from "react";
import TimeSheetComponent from "./timeSheet";
import { TimeSheetType } from "@/app/types/staff/timeSheet";
import { FlatList, GestureHandlerRootView } from "react-native-gesture-handler";
import { AntDesign } from "@expo/vector-icons";
import { useTimeSheetContext } from "@/app/context/staff/timeSheetProvider";
import { useTask } from "@/app/context/staff/staffTaskProvider";

const TimeSheetContainerComponent = () => {
  // Use the timesheet context to get the data and group the data by week
  const { groupByWeek, data } = useTimeSheetContext();
  /**
   * The method and the constant is used to filter the time sheet data, check the task start data to display data accordingly
   * : */
  const sections = groupByWeek(data);

  return (
    <GestureHandlerRootView style={styles.maincontainer}>
      {/* This part of the component contains the option to allow the user download their timesheet in pdf format */}
      <View style={styles.headerOutlineforDownload}>
        <Text style={styles.timesheetText}>timesheet</Text>

        <Pressable style={styles.downloadbutton}>
          <AntDesign name="clouddownloado" size={15} color="black" />
        </Pressable>
      </View>

      {/* This contains the options that would be used to enable the user search filter */}
      <View style={styles.groupbycontainer}>
        <View style={styles.innerContainer}>
          <Text style={styles.groupbyText}>group by</Text>
          <AntDesign name="right" size={10} color="black" />
        </View>
        <View style={styles.filtercontainer}>
          <Pressable style={styles.buttons}>
            <Text style={styles.buttonText}>approved</Text>
          </Pressable>
          <Pressable style={styles.buttons}>
            <Text style={styles.buttonText}>pending</Text>
          </Pressable>
          <Pressable style={styles.buttons}>
            <Text style={styles.buttonText}>canceled</Text>
          </Pressable>
        </View>
      </View>

      <View style={{ flex: 1 }}>
        <SectionList
          sections={sections}
          keyExtractor={(item, index) => item.taskSerial + index}
          renderSectionHeader={({ section: { title } }) => (
            <Text style={styles.sectionHeader}>{title}</Text>
          )}
          renderItem={({ item }) => <TimeSheetComponent {...item} />}
          contentContainerStyle={{ paddingBottom: 5 }}
          showsHorizontalScrollIndicator={false}
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

  groupbycontainer: {
    flexDirection: "row",
    alignItems: "center",
    padding: 1,
    columnGap: 10,
  },

  innerContainer: {
    flexDirection: "row",
    padding: 2,
    alignItems: "center",
    columnGap: 5,
    justifyContent: "center",
  },

  filtercontainer: {
    flexDirection: "row",
    alignItems: "center",
    columnGap: 10,
  },

  buttons: {
    padding: 3,
    borderRadius: 5,
    borderWidth: 0.2,
  },

  buttonText: {
    fontSize: 12,
    padding: 2,
    fontWeight: "400",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },

  groupbyText: {
    fontSize: 12,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  sectionHeader: {
    fontSize: 13,
    fontWeight: "600",
    backgroundColor: "#f4f4f4",
    padding: 2,
    marginTop: 10,
    borderWidth: 0.2,
    borderRadius: 5,
  },

  headerOutlineforDownload: {
    flexDirection: "row",
    padding: 5,
    justifyContent: "space-between",
    alignItems: "center",
    borderBottomWidth: 1,
    marginBottom: 5,
  },

  downloadbutton: {
    padding: 5,
    borderRadius: 5,
    borderWidth: 0.5,
    alignItems: "center",
    justifyContent: "center",
  },

  timesheetText: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
});
