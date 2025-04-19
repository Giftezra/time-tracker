import {
  Pressable,
  StyleSheet,
  Text,
  View,
  Modal,
  ScrollView,
  Alert,
  Platform,
} from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialCommunityIcons } from "@expo/vector-icons";
import SearchInputContainer from "../../helper/SearchInput";
import { useCalendar } from "@/app/context/management/calendar/calendarContext";
import AlertConfig from "@/app/types/management/AlertConfig";
import AlertModal from "../../helper/AlertModal";

const CalendarHeader = () => {
  const {
    schedule,
    getShift,
    search,
    setSearch,
    handleSchedule,
    handleWeekSeleced,
    gotoPreviousWeek,
    gotoNextWeek,
    currentWeek,
    weekDays,
    employees,
    weekRange,
    emailShiftReport,
  } = useCalendar();

  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig | undefined>(
    undefined
  );
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [sendingReportError, setSendingReportError] = useState<string | null>(
    null
  );
  const [selectedStartDate, setSelectedStartDate] = useState({
    day: 1,
    month: 1,
    year: 2024,
  });
  const [selectedEndDate, setSelectedEndDate] = useState({
    day: 1,
    month: 1,
    year: 2024,
  });
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 50 }, (_, i) => 2020 + i);

  /**
   * Call the emailShiftReport method to send the report to the user's email address.
   * The emailShiftReport method is a method that is defined in the useCalendar hook and expects a startDate and endDate both of type string.
   */
  const handlePrint = async () => {
    const startDate = `${selectedStartDate.year}-${selectedStartDate.month}-${selectedStartDate.day}`;
    const endDate = `${selectedEndDate.year}-${selectedEndDate.month}-${selectedEndDate.day}`;

    const sendReport = async () => {
      try {
        await emailShiftReport(startDate, endDate);
        setIsPrintModalVisible(false);
      } catch (error) {
        console.error("Error sending report:", error);
        setSendingReportError(
          "Error sending report. Please check your internet connection and try again."
        );
      }
    };

    // If the platform is web, use the window.confirm method to ask the user if they want to proceed
    if (Platform.OS === "web") {
      if (
        window.confirm(
          "This report will be sent to your email address. Do you want to proceed?"
        )
      ) {
        await sendReport();
      }
    } else {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Send Report",
        message:
          "This report will be sent to your email address. Do you want to proceed?",
        onConfirm: () => {
          sendReport();
          setIsAlertVisible(false);
        },
        onClose: () => {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
    }
  };

  const hasAnyShifts = employees.some((employee) => {
    return weekDays.some((day) => {
      const shifts = getShift(Number(employee.employee_id), day);
      return shifts && (typeof shifts === "object" ? shifts.length > 0 : false);
    });
  });

  return (
    <View style={[styles.mainContainer, { padding: 5 }]}>
      <View style={styles.searchContainer}>
        <SearchInputContainer
          onPress={() => console.log("search")}
          value={search}
          setValue={setSearch}
          placeholder="Search shifts..."
          text="Search Shifts"
        />
      </View>

      <View style={[styles.rowContainer, { columnGap: 10, marginBottom: 10 }]}>
        <Text
          style={{
            fontSize: 18,
            fontWeight: "500",
            fontFamily: "BarlowRegular",
            textTransform: "capitalize",
          }}
        >
          shifts
        </Text>
        <Pressable
          onPress={() => handleSchedule("shifts")}
          style={
            schedule === "shifts"
              ? { borderBottomWidth: 2, borderBottomColor: "black" }
              : {}
          }
        >
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              fontFamily: "BarlowRegular",
              textTransform: "capitalize",
            }}
          >
            shifts
          </Text>
        </Pressable>
      </View>

      {/* This part contains the date management role */}
      <View
        style={[
          styles.rowContainer,
          { justifyContent: "space-between", width: "100%" },
        ]}
      >
        <View
          style={[
            styles.rowContainer,
            { justifyContent: "center", columnGap: 10 },
          ]}
        >
          <Pressable style={{ padding: 10 }}>
            <AntDesign
              name="left"
              size={12}
              color="black"
              onPress={gotoPreviousWeek}
            />
          </Pressable>
          <Text
            style={{
              fontSize: 13,
              fontWeight: "500",
              fontFamily: "BarlowLight",
              textTransform: "capitalize",
            }}
          >
            {weekRange}
          </Text>
          <Pressable style={{ padding: 10 }}>
            <AntDesign
              name="right"
              size={12}
              color="black"
              onPress={gotoNextWeek}
            />
          </Pressable>
        </View>

        <View
          style={[
            styles.rowContainer,
            { columnGap: 20, justifyContent: "flex-end", marginEnd: 5 },
          ]}
        >
          <Pressable>
            <MaterialCommunityIcons
              name="file-account-outline"
              size={24}
              color="black"
            />
          </Pressable>
          <Pressable
            onPress={() => setIsPrintModalVisible(true)}
            disabled={!hasAnyShifts}
          >
            <MaterialCommunityIcons name="printer" size={24} color="black" />
          </Pressable>
          <Pressable>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color="black"
            />
          </Pressable>
        </View>
      </View>

      {/* Display the modal for the user to select a date range to print or access the report */}
      <Modal
        visible={isPrintModalVisible}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setIsPrintModalVisible(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Select Date Range</Text>

            <View style={styles.dateSection}>
              <Text style={styles.dateLabel}>Start Date:</Text>
              <View style={styles.datePickerContainer}>
                <ScrollView
                  style={styles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {days.map((day) => (
                    <Pressable
                      key={`start-day-${day}`}
                      onPress={() =>
                        setSelectedStartDate({ ...selectedStartDate, day })
                      }
                      style={[
                        styles.pickerItem,
                        selectedStartDate.day === day && styles.selectedItem,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          selectedStartDate.day === day && styles.selectedText,
                        ]}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <ScrollView
                  style={styles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {months.map((month) => (
                    <Pressable
                      key={`start-month-${month}`}
                      onPress={() =>
                        setSelectedStartDate({ ...selectedStartDate, month })
                      }
                      style={[
                        styles.pickerItem,
                        selectedStartDate.month === month &&
                          styles.selectedItem,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          selectedStartDate.month === month &&
                            styles.selectedText,
                        ]}
                      >
                        {month}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <ScrollView
                  style={styles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {years.map((year) => (
                    <Pressable
                      key={`start-year-${year}`}
                      onPress={() =>
                        setSelectedStartDate({ ...selectedStartDate, year })
                      }
                      style={[
                        styles.pickerItem,
                        selectedStartDate.year === year && styles.selectedItem,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          selectedStartDate.year === year &&
                            styles.selectedText,
                        ]}
                      >
                        {year}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <Text style={styles.dateLabel}>End Date:</Text>
              <View style={styles.datePickerContainer}>
                <ScrollView
                  style={styles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {days.map((day) => (
                    <Pressable
                      key={`end-day-${day}`}
                      onPress={() =>
                        setSelectedEndDate({ ...selectedEndDate, day })
                      }
                      style={[
                        styles.pickerItem,
                        selectedEndDate.day === day && styles.selectedItem,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          selectedEndDate.day === day && styles.selectedText,
                        ]}
                      >
                        {day}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <ScrollView
                  style={styles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {months.map((month) => (
                    <Pressable
                      key={`end-month-${month}`}
                      onPress={() =>
                        setSelectedEndDate({ ...selectedEndDate, month })
                      }
                      style={[
                        styles.pickerItem,
                        selectedEndDate.month === month && styles.selectedItem,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          selectedEndDate.month === month &&
                            styles.selectedText,
                        ]}
                      >
                        {month}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
                <ScrollView
                  style={styles.picker}
                  showsVerticalScrollIndicator={false}
                >
                  {years.map((year) => (
                    <Pressable
                      key={`end-year-${year}`}
                      onPress={() =>
                        setSelectedEndDate({ ...selectedEndDate, year })
                      }
                      style={[
                        styles.pickerItem,
                        selectedEndDate.year === year && styles.selectedItem,
                      ]}
                    >
                      <Text
                        style={[
                          styles.pickerText,
                          selectedEndDate.year === year && styles.selectedText,
                        ]}
                      >
                        {year}
                      </Text>
                    </Pressable>
                  ))}
                </ScrollView>
              </View>

              <View style={styles.buttonContainer}>
                <Pressable
                  style={[styles.button, styles.cancelButton]}
                  onPress={() => setIsPrintModalVisible(false)}
                >
                  <Text style={styles.buttonText}>Cancel</Text>
                </Pressable>
                <Pressable
                  style={[styles.button, styles.printButton]}
                  onPress={handlePrint}
                >
                  <Text style={styles.buttonText}>Print</Text>
                </Pressable>
              </View>
            </View>
          </View>
        </View>
      </Modal>
      {isAlertVisible && (
        <AlertModal
          isVisible={alertConfig?.isVisible || false}
          onClose={() => alertConfig?.onClose?.()}
          onConfirm={() => alertConfig?.onConfirm?.()}
          title={alertConfig?.title || ""}
          message={alertConfig?.message || ""}
        />
      )}
    </View>
  );
};

export default CalendarHeader;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },

  rowContainer: {
    flexGrow: 1,
    flexDirection: "row",
    alignItems: "center",
  },

  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxHeight: "80%",
  },
  modalTitle: {
    fontSize: 17,
    fontWeight: "600",
    marginBottom: 15,
    textAlign: "center",
    fontFamily: "BarlowRegular",
  },
  dateSection: {
    marginBottom: 20,
  },
  dateLabel: {
    fontSize: 16,
    fontWeight: "500",
    marginBottom: 10,
    fontFamily: "BarlowLight",
  },
  datePickerContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 20,
  },
  picker: {
    height: 120,
    flex: 1,
    marginHorizontal: 5,
  },
  pickerItem: {
    padding: 5,
    alignItems: "center",
    marginVertical: 2,
  },
  selectedItem: {
    borderBottomWidth: 2,
    borderBottomColor: "black",
  },
  pickerText: {
    fontSize: 14,
    fontFamily: "BarlowLight",
    fontWeight: "400",
  },
  selectedText: {
    fontWeight: "800",
    fontFamily: "BarlowRegular",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 20,
  },
  button: {
    padding: 10,
    borderRadius: 5,
    minWidth: 100,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#ff4444",
  },
  printButton: {
    backgroundColor: "#2196F3",
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  },
  searchContainer: {
    marginBottom: 10,
    width: "100%",
  },
});
