import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import dayjs from "dayjs";
import { FlatList, Pressable } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CalendarShiftType } from "@/app/types/management/calendars";
import { Status } from "@/constants/Status";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useCalendar } from "@/app/context/management/calendar/calendarContext";

const CalendarShiftComponent = () => {
  const { weekDays } = useCalendar();
  const [activeShiftId, setActiveShiftId] = useState<number | null>(null); // Track active shift

  const handlemanageShiftID = (shiftId: number) => {
    setActiveShiftId(activeShiftId === shiftId ? null : shiftId); // Toggle the active shift
  };

  const innerBackgroundColor = useThemeColor({}, "innerBackground");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const text = useThemeColor({}, "text");
  const othertext = useThemeColor({}, "otherText");

  // Sample data for employees and shifts
  const employees = [
    { id: 1, name: "John Doe" },
    { id: 2, name: "Jane Smith" },
    { id: 3, name: "Mark Wright" },
  ];

  const shifts: CalendarShiftType[] = [
    {
      shiftId: 1,
      employeeId: 1,
      startdate: dayjs().startOf("week").add(1, "day").format("YYYY-MM-DD"),
      starttime: "09:00",
      endtime: "17:00",
      status: Status.PENDING,
      task_serial: "1234",
      client: "client",
    },
    {
      shiftId: 2,
      employeeId: 2,
      startdate: dayjs().startOf("week").add(2, "day").format("YYYY-MM-DD"),
      starttime: "10:00",
      endtime: "18:00",
      status: Status.APPROVED,
      task_serial: "1234",
      client: "client2",
    },
    {
      shiftId: 3,
      employeeId: 3,
      startdate: dayjs().startOf("week").add(3, "day").format("YYYY-MM-DD"),
      starttime: "08:00",
      endtime: "16:00",
      status: Status.DECLINED,
      task_serial: "1234",
      client: "client3",
    },
    {
      shiftId: 4,
      employeeId: 3,
      startdate: dayjs().month(10).date(15).format("YYYY-MM-DD"),
      starttime: "08:00",
      endtime: "16:00",
      status: Status.COMPLETED,
      task_serial: "1234",
      client: "client3",
    },
  ];

  // Function to find shift for an employee on a specific day
  const getShift = (employeeId: number, date: dayjs.Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD"); // Format the date to match 'YYYY-MM-DD'
    const shift = shifts.find(
      (shift) => shift.employeeId === employeeId && shift.startdate === dateStr // Check date only
    );
    return shift || "No shift";
  };

  /**
   * The component renders a calendar view of the shifts for the week
   * The view contains the shift details and the time for each day of the week.
   * For every shift that has been accepted or completed, the background color is green
   * For every shift that is in progress, the background color is blue
   * For every shift that is pending, the background color is yellow
   * For every shift that has been declined or cancelled, the background color is red
   */
  const renderItems = (employee: any) => {
    return (
      <View style={styles.flailistRow}>
        {/* Employee details */}
        <View style={[styles.employeesDetails]}>
          <Text style={[styles.employeeDetailsText, { color: text }]}>
            {employee.name}
          </Text>
        </View>

        {/* Shifts */}
        {weekDays.map((day, index) => {
          const shift = getShift(employee.id, day);
          return (
            <View
              key={index}
              style={[
                styles.shiftCell,
                typeof shift === "string"
                  ? { backgroundColor: "lightgray" }
                  : shift.status === Status.ACCEPTED ||
                    shift.status === Status.COMPLETED
                  ? { backgroundColor: "green" }
                  : shift.status === Status.INPROGRESS
                  ? { borderWidth: 1, borderColor: "blue" }
                  : shift.status === Status.PENDING
                  ? { backgroundColor: "yellow" }
                  : shift.status === Status.DECLINED ||
                    shift.status === Status.CANCELLED
                  ? { backgroundColor: "red" }
                  : { backgroundColor: secondaryColor },
              ]}
            >
              <View style={styles.flailistRow}>
                {/* Conditionally render cancel button */}
                <View
                  style={[
                    styles.overlay,
                    { backgroundColor: innerBackgroundColor },
                  ]}
                >
                  {typeof shift !== "string" &&
                    activeShiftId === shift.shiftId && (
                      <TouchableOpacity>
                        <Text style={[styles.cancelText, { color: text }]}>
                          cancel
                        </Text>
                      </TouchableOpacity>
                    )}
                </View>

                {/* Toggle manage shift */}
                {typeof shift !== "string" && (
                  <View style={styles.manageshiftContainer}>
                    <Text style={styles.manageshiftText}>
                      {typeof shift === "string" ? shift : `${shift.client}`}
                    </Text>
                    <Pressable
                      onPress={() =>
                        shift.shiftId !== undefined &&
                        handlemanageShiftID(shift.shiftId)
                      }
                    >
                      <MaterialCommunityIcons
                        name="dots-horizontal"
                        size={20}
                        color="black"
                      />
                    </Pressable>
                  </View>
                )}
              </View>

              <Text style={styles.shiftCellText}>
                {typeof shift === "string"
                  ? shift
                  : `${shift.starttime} - ${shift.endtime}`}
              </Text>
            </View>
          );
        })}
      </View>
    );
  };

  return (
    <View
      style={[styles.mainContainer, { backgroundColor: innerBackgroundColor }]}
    >
      {/* Weekdays Header contains the week display */}
      <View style={styles.topheaderRow}>
        <Text style={[styles.weekdayText, { color: text }]}>Employees</Text>
        {weekDays.map((day, index) => (
          <View
            key={index}
            style={[styles.weekdayContainer, { alignItems: "flex-end" }]}
          >
            <Text style={[styles.weekdayText, { color: text }]}>
              {day.format("MMM DD")}
            </Text>
            <Text style={[styles.weekdayText, { color: text }]}>
              {day.format("ddd")}
            </Text>
          </View>
        ))}
      </View>

      {/* This flatlist contains the list of both the employees and shifts assigned to them in a row format */}
      <FlatList
        data={employees}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item: employee }) => renderItems(employee)}
      />
    </View>
  );
};

export default CalendarShiftComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    padding: 2,
  },

  flailistRow: {
    flexDirection: "row",
    alignItems: "center",
  },

  overlay: {
    position: "absolute",
    bottom: 5,
    left: -20,
    zIndex: 1,
    borderRadius: 5,
    paddingStart: 10,
    paddingEnd: 10,
  },

  shiftCell: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    height: 40,
    borderBottomWidth: 1,
    padding: 5,
  },

  shiftCellText: {
    fontSize: 12,
    fontVariant: ["contextual"],
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  manageshiftText: {
    fontSize: 12,
    fontWeight: "300",
    fontFamily: "BarlowLight",
    textTransform: "lowercase",
  },

  topheaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
  },

  employeesDetails: {
    flexGrow: 1,
    padding: 5,
    borderBottomWidth: 1,
    borderRadius: 5,
    height: 40,
  },

  employeeDetailsText: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    fontWeight: "200",
    fontVariant: ["oldstyle-nums"],
    textTransform: "capitalize",
    zIndex: 1,
  },

  weekdayContainer: {
    flexDirection: "column",
    flexGrow: 1,
    alignItems: "center",
  },

  weekdayText: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
    textTransform: "capitalize",
  },

  manageshiftContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },

  cancelText: {
    fontSize: 12,
    fontWeight: "400",
    fontFamily: "OswaldVariable",
    textTransform: "capitalize",
    padding: 2,
  },
});
