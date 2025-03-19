import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
} from "react-native";
import React, { useEffect, useState } from "react";
import { CalendarShiftType } from "@/app/types/management/calendars";
import TimeScroller from "../../helper/timeScroller";
import DateScroller from "../../helper/dateScroller";
import dayjs from "dayjs";
import ButtonComponent from "../../helper/buttons";
import { useCalendar } from "@/app/context/management/calendar/calendarContext";
import { MaterialIcons } from "@expo/vector-icons";

const EditShiftComponent = ({
  shift,
}: {
  shift: CalendarShiftType | undefined;
}) => {
  const { approveShift, updateShift, cancelShift, } = useCalendar();
  // State for start time
  const [startHour, setStartHour] = useState(0);
  const [startMinute, setStartMinute] = useState(0);

  // State for end time
  const [endHour, setEndHour] = useState(0);
  const [endMinute, setEndMinute] = useState(0);

  // State for date
  const [day, setDay] = useState(1);
  const [month, setMonth] = useState(1);
  const [year, setYear] = useState(2024);

  const [activeSection, setActiveSection] = useState<
    "start" | "end" | "date" | null
  >(null);

  // Initialize states when shift changes
  useEffect(() => {
    if (shift?.start_date && shift?.start_time && shift?.end_time) {
      const startDate = dayjs(shift.start_date);
      setDay(startDate.date());
      setMonth(startDate.month() + 1);
      setYear(startDate.year());

      const startTimeArr = shift.start_time.split(":");
      setStartHour(parseInt(startTimeArr[0]));
      setStartMinute(parseInt(startTimeArr[1]));

      const endTimeArr = shift.end_time.split(":");
      setEndHour(parseInt(endTimeArr[0]));
      setEndMinute(parseInt(endTimeArr[1]));
    }
  }, [shift]);

  /** The method is used to update the shift event when clicked. 
   * The update shift method is called to update the shift on the server side and it expects the formatted date,    start time and end time as params.
   * The method also calls the getAllShifts method to update the shifts state after the shift is updated
   */
  const handleSave = async () => {
    // Here you would implement the save logic
    // Format the data and make API call
    const formattedDate = dayjs(`${year}-${month}-${day}`).format("YYYY-MM-DD");
    const formattedStartTime = `${startHour
      .toString()
      .padStart(2, "0")}:${startMinute.toString().padStart(2, "0")}`;
    const formattedEndTime = `${endHour.toString().padStart(2, "0")}:${endMinute
      .toString()
      .padStart(2, "0")}`;

    await updateShift(formattedDate, formattedStartTime, formattedEndTime);
  };

  /** The method is used to cancel the shift event when clicked. 
   * The cancel shift method is called to cancel the shift on the server side and it expects the shift id and employee id as params.
   * The method also calls the getAllShifts method to update the shifts state after the shift is cancelled
   */
  const handleCancel = async () => {
    await cancelShift();
  };

  /** The method is used to approve the shift event when clicked. 
   * The approve shift method is called to approve the shift on the server side and it expects the shift id and employee id as params.
   * The method also calls the getAllShifts method to update the shifts state after the shift is approved
   */
  const handleApprove = async () => {
    await approveShift();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Shift</Text>

      <View style={styles.timeSection}>
        <Text style={styles.sectionHeader}>Time & Date Settings</Text>

        <Pressable
          style={[
            styles.timePickerButton,
            activeSection === "date" && styles.activeTimePickerButton,
          ]}
          onPress={() =>
            setActiveSection(activeSection === "date" ? null : "date")
          }
        >
          <View style={styles.timePickerHeader}>
            <Text style={styles.timePickerLabel}>Date</Text>
            <Text style={styles.timeDisplay}>
              {`${day.toString().padStart(2, "0")}/${month
                .toString()
                .padStart(2, "0")}/${year}`}
            </Text>
            <MaterialIcons name="date-range" size={24} color="#4a4a4a" />
          </View>
        </Pressable>

        {activeSection === "date" && (
          <View style={styles.timePickerContainer}>
            <DateScroller
              day={day}
              month={month}
              year={year}
              onChangeDay={setDay}
              onChangeMonth={setMonth}
              onChangeYear={setYear}
            />
          </View>
        )}

        <Pressable
          style={[
            styles.timePickerButton,
            activeSection === "start" && styles.activeTimePickerButton,
          ]}
          onPress={() =>
            setActiveSection(activeSection === "start" ? null : "start")
          }
        >
          <View style={styles.timePickerHeader}>
            <Text style={styles.timePickerLabel}>Start Time</Text>
            <Text style={styles.timeDisplay}>
              {`${startHour.toString().padStart(2, "0")}:${startMinute
                .toString()
                .padStart(2, "0")}`}
            </Text>
            <MaterialIcons name="access-time" size={24} color="#4a4a4a" />
          </View>
        </Pressable>

        {activeSection === "start" && (
          <View style={styles.timePickerContainer}>
            <TimeScroller value={startHour} onChange={setStartHour} max={24} />
            <Text style={styles.timeSeparator}>:</Text>
            <TimeScroller
              value={startMinute}
              onChange={setStartMinute}
              max={60}
            />
          </View>
        )}

        <Pressable
          style={[
            styles.timePickerButton,
            activeSection === "end" && styles.activeTimePickerButton,
          ]}
          onPress={() =>
            setActiveSection(activeSection === "end" ? null : "end")
          }
        >
          <View style={styles.timePickerHeader}>
            <Text style={styles.timePickerLabel}>End Time</Text>
            <Text style={styles.timeDisplay}>
              {`${endHour.toString().padStart(2, "0")}:${endMinute
                .toString()
                .padStart(2, "0")}`}
            </Text>
            <MaterialIcons name="access-time" size={24} color="#4a4a4a" />
          </View>
        </Pressable>

        {activeSection === "end" && (
          <View style={styles.timePickerContainer}>
            <TimeScroller value={endHour} onChange={setEndHour} max={24} />
            <Text style={styles.timeSeparator}>:</Text>
            <TimeScroller value={endMinute} onChange={setEndMinute} max={60} />
          </View>
        )}
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity onPress={handleSave} style={styles.buttons}>
          <Text style={styles.buttonText}>Save Changes</Text>
          <MaterialIcons name="save" size={24} color="white" />
        </TouchableOpacity>
        {/* Conditionally render the cancel or approve button given the status of the shift */}
        {shift?.status === "pending" ||
        shift?.status === "assigned" ||
        shift?.status === "started" ? (
          <TouchableOpacity style={styles.buttons} onPress={handleCancel}>
            <Text style={styles.buttonText}>Cancel</Text>
            <MaterialIcons name="check" size={24} color="white" />
          </TouchableOpacity>
        ) : (
          <TouchableOpacity style={styles.buttons} onPress={handleApprove}>
            <Text style={styles.buttonText}>Approve</Text>
            <MaterialIcons name="check" size={24} color="white" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  );
};

export default EditShiftComponent;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    backgroundColor: "white",
    flex: 1,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 20,
    textAlign: "center",
    fontFamily: "BarlowRegular",
  },
  timeSection: {
    backgroundColor: "#fff",
    borderRadius: 5,
    padding: 10,
    marginVertical: 5,
    borderWidth: 1,
    borderColor: "#f0f0f0",
  },
  sectionHeader: {
    fontSize: 18,
    fontWeight: "600",
    color: "#1a1a1a",
    marginBottom: 16,
    fontFamily: "BarlowRegular",
  },
  timePickerButton: {
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    padding: 10,
    marginVertical: 4,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  activeTimePickerButton: {
    borderColor: "#0066ff",
    backgroundColor: "#f0f7ff",
  },
  timePickerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  timePickerLabel: {
    fontSize: 16,
    color: "#4a4a4a",
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  },
  timeDisplay: {
    fontSize: 18,
    color: "#1a1a1a",
    fontFamily: "BarlowRegular",
    fontWeight: "600",
  },
  timePickerContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    padding: 10,
    borderRadius: 8,
    marginTop: 5,
  },
  timeSeparator: {
    fontSize: 24,
    marginHorizontal: 10,
    fontFamily: "BarlowBold",
  },
  buttonContainer: {
    marginTop: 20,
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 5,
    alignItems: "center",
  },
  buttons: {
    flex: 1,
    padding: 5,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    borderRadius: 5,
    borderWidth: 1,
    borderColor: "#e9ecef",
    marginHorizontal: 5,
    backgroundColor: "#0066ff",
  },

  buttonText: {
    fontSize: 16,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
    textTransform: "capitalize",
  },
});
