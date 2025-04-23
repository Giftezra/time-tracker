/**
 * CalendarHeader Component
 *
 * A comprehensive header component for the calendar view that provides:
 * - Search functionality for shifts
 * - Week navigation controls
 * - Date range selection for reports
 * - Print/export functionality for shift reports
 *
 * The component uses the CalendarContext for managing calendar-related state and operations.
 * It includes a modal for date range selection and supports both web and mobile platforms
 * with appropriate UI/UX patterns for each.
 */
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
import {
  AntDesign,
  FontAwesome,
  MaterialCommunityIcons,
} from "@expo/vector-icons";
import SearchInputContainer from "../../helper/SearchInput";
import { useCalendar } from "@/app/context/management/calendar/calendarContext";
import AlertConfig from "@/app/types/management/AlertConfig";
import AlertModal from "../../helper/AlertModal";

/**
 * CalendarHeader component for managing calendar view and shift reports
 * @returns {JSX.Element} The rendered CalendarHeader component
 */
const CalendarHeader = () => {
  // Destructure calendar context values
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

  // Local state management
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig | undefined>(
    undefined
  );
  const [isPrintModalVisible, setIsPrintModalVisible] = useState(false);
  const [sendingReportError, setSendingReportError] = useState<string | null>(
    null
  );

  // Date selection state
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

  // Date picker options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 50 }, (_, i) => 2020 + i);

  /**
   * Handles the print/export functionality for shift reports
   * Sends the report to the user's email address after confirmation
   * Supports both web and mobile platforms with appropriate confirmation dialogs
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

    // Platform-specific confirmation handling
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

  // Check if there are any shifts to enable/disable print functionality
  const hasAnyShifts =
    employees?.some((employee) => {
      return weekDays.some((day) => {
        const shifts = getShift(Number(employee.employee_id), day);
        return shifts && (Array.isArray(shifts) ? shifts.length > 0 : false);
      });
    }) ?? false;

  return (
    <View style={[styles.mainContainer, { padding: 5 }]}>
      {/* Search input section */}
      <View style={styles.searchContainer}>
        <SearchInputContainer
          onPress={() => console.log("search")}
          value={search}
          setValue={setSearch}
          placeholder="Search shifts..."
          text="Search Shifts"
        />
      </View>

      {/* Header title section */}
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
      </View>

      {/* Week navigation and actions section */}
      <View
        style={[
          styles.rowContainer,
          { justifyContent: "space-between", width: "100%" },
        ]}
      >
        {/* Week navigation controls */}
        <View
          style={[
            styles.rowContainer,
            { justifyContent: "center", columnGap: 10 },
          ]}
        >
          <Pressable style={{ padding: 10 }} onPress={gotoPreviousWeek}>
            <Text style={{ fontSize: 20 }}>⬅️</Text>
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
          <Pressable style={{ padding: 10 }} onPress={gotoNextWeek}>
            <Text style={{ fontSize: 20 }}>➡️</Text>
          </Pressable>
        </View>

        {/* Action buttons */}
        <View
          style={[
            styles.rowContainer,
            { columnGap: 20, justifyContent: "flex-end", marginEnd: 5 },
          ]}
        >
          <Pressable
            onPress={() => setIsPrintModalVisible(true)}
            disabled={!hasAnyShifts}
            style={({ pressed }) => [
              styles.iconButton,
              pressed && styles.iconButtonPressed,
              !hasAnyShifts && styles.iconButtonDisabled,
            ]}
          >
            <Text style={{ fontSize: 20 }}>🖨️</Text>
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

      {/* Date range selection modal */}
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
              {/* Start date picker */}
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

              {/* End date picker */}
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

              {/* Action buttons */}
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

      {/* Alert modal for confirmations */}
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

/**
 * Styles for the CalendarHeader component
 */
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
  iconButton: {
    padding: 10,
    borderRadius: 12,
    backgroundColor: "rgba(76, 175, 80, 0.1)", // Light green background
  },
  iconButtonPressed: {
    backgroundColor: "rgba(76, 175, 80, 0.2)", // Darker green when pressed
    transform: [{ scale: 0.95 }],
  },
  iconButtonDisabled: {
    backgroundColor: "#F5F5F5", // Light gray background when disabled
    opacity: 0.7,
  },
});
