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
  ActivityIndicator,
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
import PrintModal from "./PrintModal";
import { Tooltip } from "./Tooltip";

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
    gotoPreviousWeek,
    gotoNextWeek,
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
  const [isGeneratingReport, setIsGeneratingReport] = useState(false);

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

  const formatDate = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      month: "long",
      year: "numeric",
    });
  };

  // Add function to get current month and year
  const getCurrentMonthYear = () => {
    const firstDate = weekDays[0];
    return formatDate(firstDate.toDate());
  };

  /**
   * Handles the print/export functionality for shift reports
   * Sends the report to the user's email address after confirmation
   * Supports both web and mobile platforms with appropriate confirmation dialogs
   */
  const handlePrint = async () => {
    const startDate = `${selectedStartDate.year}-${selectedStartDate.month}-${selectedStartDate.day}`;
    const endDate = `${selectedEndDate.year}-${selectedEndDate.month}-${selectedEndDate.day}`;

    const sendReport = async () => {
      setIsGeneratingReport(true);
      try {
        await emailShiftReport(startDate, endDate);
        setIsPrintModalVisible(false);
        Alert.alert("Success", "Report has been sent to your email!");
      } catch (error) {
        console.error("Error sending report:", error);
        setSendingReportError(
          "Error sending report. Please check your internet connection and try again."
        );
      } finally {
        setIsGeneratingReport(false);
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
    <View style={[styles.mainContainer, { padding: 12 }]}>
      {/* Header title section */}
      <View style={[styles.rowContainer, { marginBottom: 16 }]}>
        <View style={styles.headerTitleContainer}>
          <Text style={styles.headerTitle}>Schedule</Text>
          <Text style={styles.currentMonthYear}>{getCurrentMonthYear()}</Text>
        </View>
      </View>

      {/* Week navigation and actions section */}
      <View style={styles.navigationContainer}>
        {/* Week navigation controls */}
        <View style={styles.weekNavigation}>
          <Pressable style={styles.navigationButton} onPress={gotoPreviousWeek}>
            <AntDesign name="left" size={20} color="#555" />
          </Pressable>

          <Text style={styles.weekRangeText}>{weekRange}</Text>

          <Pressable style={styles.navigationButton} onPress={gotoNextWeek}>
            <AntDesign name="right" size={20} color="#555" />
          </Pressable>
        </View>

        {/* Action buttons */}
        <View style={styles.actionButtons}>
          <Tooltip
            visible={!hasAnyShifts}
            content="Add shifts to enable printing"
          >
            <Pressable
              onPress={() => setIsPrintModalVisible(true)}
              disabled={!hasAnyShifts || isGeneratingReport}
              style={({ pressed }) => [
                styles.iconButton,
                pressed && styles.iconButtonPressed,
                !hasAnyShifts && styles.iconButtonDisabled,
              ]}
            >
              {isGeneratingReport ? (
                <ActivityIndicator size="small" color="#4CAF50" />
              ) : (
                <MaterialCommunityIcons
                  name="printer"
                  size={22}
                  color={hasAnyShifts ? "#4CAF50" : "#999"}
                />
              )}
            </Pressable>
          </Tooltip>

          <Pressable style={styles.moreButton}>
            <MaterialCommunityIcons
              name="dots-horizontal"
              size={24}
              color="#555"
            />
          </Pressable>
        </View>
      </View>

      {/* Date range selection modal */}
      <PrintModal
        isVisible={isPrintModalVisible}
        onClose={() => setIsPrintModalVisible(false)}
        onPrint={handlePrint}
        selectedStartDate={selectedStartDate}
        selectedEndDate={selectedEndDate}
        setSelectedStartDate={setSelectedStartDate}
        setSelectedEndDate={setSelectedEndDate}
      />
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
    borderRadius: 8,
    backgroundColor: "rgba(76, 175, 80, 0.1)",
    minWidth: 42,
    alignItems: "center",
  },
  iconButtonPressed: {
    backgroundColor: "rgba(76, 175, 80, 0.2)",
    transform: [{ scale: 0.95 }],
  },
  iconButtonDisabled: {
    backgroundColor: "#F5F5F5",
    opacity: 0.7,
  },
  colorContainer: {
    flexDirection: "column",
    justifyContent: "space-between",
    marginBottom: 10,
  },
  colorText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  },
  headerTitleContainer: {
    flexDirection: "column",
    gap: 4,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "#333",
  },
  currentMonthYear: {
    fontSize: 15,
    fontFamily: "BarlowLight",
    color: "#666",
  },
  navigationContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    paddingVertical: 8,
  },
  weekNavigation: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    backgroundColor: "#f5f5f5",
    padding: 4,
    borderRadius: 8,
  },
  navigationButton: {
    padding: 8,
    borderRadius: 6,
    backgroundColor: "#fff",
  },
  weekRangeText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    color: "#333",
    minWidth: 120,
    textAlign: "center",
  },
  actionButtons: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  moreButton: {
    padding: 8,
    borderRadius: 8,
    backgroundColor: "#f5f5f5",
  },
});
