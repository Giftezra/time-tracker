import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useState } from "react";
import dayjs from "dayjs";
import { FlatList, Pressable } from "react-native-gesture-handler";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { CalendarShiftType } from "@/app/types/management/calendars";
import { Status } from "@/constants/Status";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useCalendar } from "@/app/context/management/calendar/calendarContext";
import { EmployeeType } from "@/app/types/management/employee";

const CalendarShiftComponent = () => {
  // Add new state to track the specific shift being managed
  const [selectedShift, setSelectedShift] = useState<
    | {
        shiftId: number;
        employeeId: number;
        date: string;
      }
    | undefined
  >(undefined);

  const { employees, getShift, weekDays, handleActiveShift } = useCalendar();

  /**
   * Handle the shift click event to store the active shift in the state
   * @param shiftId - the shift id
   * @param employeeId - the employee id
   * @param date - the date of the shift
   */
  const handleShiftClick = (
    shiftId: number | undefined,
    employeeId: number,
    date: string
  ) => {
    if (shiftId !== undefined) {
      setSelectedShift(
        selectedShift?.shiftId === shiftId &&
          selectedShift?.employeeId === employeeId &&
          selectedShift?.date === date
          ? undefined
          : { shiftId, employeeId, date }
      );
    }
  };

  const innerBackgroundColor = useThemeColor({}, "innerBackground");
  const secondaryColor = useThemeColor({}, "secondaryColor");
  const text = useThemeColor({}, "text");

  /**
   * The component renders a calendar view of the shifts for the week
   * The view contains the shift details and the time for each day of the week.
   * For every shift that has been accepted or completed, the background color is green
   * For every shift that is in progress, the background color is blue
   * For every shift that is pending, the background color is yellow
   * For every shift that has been declined or cancelled, the background color is red
   */
  const renderItems = (employee: any) => {
    // Calculate maximum height based on shifts
    const maxShiftHeight = weekDays.reduce((maxHeight, day) => {
      const shifts = getShift(employee.employee_id, day);
      const shiftCount = Array.isArray(shifts) ? shifts.length : 1;
      return Math.max(maxHeight, shiftCount * 30);
    }, 30);

    return (
      <View style={styles.flailistRow}>
        {/* Employee details - now uses calculated height */}
        <View style={[styles.employeesDetails, { minHeight: maxShiftHeight }]}>
          <Text style={[styles.employeeDetailsText, { color: text }]}>
            {employee.employee_name}
          </Text>
        </View>

        {/* Shifts */}
        {weekDays.map((day, index) => {
          const shifts = getShift(employee.employee_id, day);
          return (
            <View
              key={index}
              style={[
                styles.shiftCell,
                {
                  minHeight: shifts?.length ? shifts.length * 30 : 30,
                },
              ]}
            >
              {!shifts ? (
                <View style={{ borderEndWidth: 1,gap:2}}>
                  <Text style={styles.shiftCellText}>No shifts</Text>
                </View>
              ) : (
                <View style={styles.multipleShiftsContainer}>
                  {shifts.map(
                    (shift: CalendarShiftType, shiftIndex: number) => (
                      <View
                        key={shiftIndex}
                        style={[
                          styles.singleShiftContainer,
                          {
                            backgroundColor:
                              shift.status === "assigned"
                                ? "lightgreen"
                                : shift.status === "pending"
                                ? "yellow"
                                : shift.status === "started"
                                ? "blue"
                                : shift.status === "cancelled"
                                ? "red"
                                : shift.status === "completed"
                                ? "green"
                                : secondaryColor,
                          },
                        ]}
                      >
                        {/* Overlay for the shift */}
                        <View style={styles.flailistRow}>
                          {selectedShift?.shiftId === shift.shiftId &&
                            selectedShift?.employeeId ===
                              employee.employee_id &&
                            selectedShift?.date ===
                              day.format("YYYY-MM-DD") && (
                              <View
                                style={[
                                  styles.overlay,
                                  { backgroundColor: innerBackgroundColor },
                                ]}
                              >
                                <TouchableOpacity
                                  onPress={() => handleActiveShift(shift)}
                                >
                                  <Text
                                    style={[styles.cancelText, { color: text }]}
                                  >
                                    manage shift
                                  </Text>
                                </TouchableOpacity>
                              </View>
                            )}

                          <View style={styles.manageshiftContainer}>
                            <Text style={styles.manageshiftText}>
                              {shift.client}
                            </Text>
                            <Pressable
                              onPress={() =>
                                // Handle the horizontal dots click event to open the overlay given the shift id, employee id and date
                                handleShiftClick(
                                  shift.shiftId,
                                  employee.employee_id,
                                  day.format("YYYY-MM-DD")
                                )
                              }
                            >
                              <MaterialCommunityIcons
                                name="dots-horizontal"
                                size={20}
                                color="black"
                              />
                            </Pressable>
                          </View>
                        </View>

                        <Text style={styles.shiftCellText}>
                          {`${shift.start_time} - ${shift.end_time}`}
                        </Text>
                      </View>
                    )
                  )}
                </View>
              )}
            </View>
          );
        })}
      </View>
    );
  };

  const hasAnyShifts = employees.some((employee) => {
    return weekDays.some((day) => {
      const shifts = getShift(Number(employee.employee_id), day);
      return shifts !== null && shifts.length > 0;
    });
  });

  if (!hasAnyShifts) {
    return (
      <View style={[styles.emptyContainer]}>
        <Text>No shifts </Text>
      </View>
    );
  }

  return (
    <View style={[styles.mainContainer, {backgroundColor:innerBackgroundColor}]}>
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
        keyExtractor={(item) => item.employee_id.toString()}
        renderItem={({ item: employee }) => renderItems(employee)}
      />
    </View>
  );
};

export default CalendarShiftComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flexGrow: 1,
    flexShrink: 0,
  },

  emptyContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },

  flailistRow: {
    flexDirection: "row",
    alignItems: "stretch",
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
    justifyContent: "flex-start",
    padding: 2,
    borderBottomWidth: 1,
  },

  shiftCellText: {
    fontSize: 12,
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
    fontWeight: "700",
  },

  manageshiftText: {
    fontSize: 12,
    fontWeight: "700",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  topheaderRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 5,
    borderBottomWidth: 1,
  },

  employeesDetails: {
    width: 100,
    padding: 5,
    borderBottomWidth: 1,
    borderRadius: 5,
    justifyContent: "center",
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

  multipleShiftsContainer: {
    width: "100%",
    gap: 2,
  },

  singleShiftContainer: {
    padding: 4,
    borderRadius: 4,
    marginVertical: 2,
  },
});
