import React from "react";
import {
  Modal,
  Pressable,
  ScrollView,
  Text,
  View,
  StyleSheet,
} from "react-native";

interface PrintModalProps {
  isVisible: boolean;
  onClose: () => void;
  onPrint: (startDate: string, endDate: string) => void;
  selectedStartDate: { day: number; month: number; year: number };
  selectedEndDate: { day: number; month: number; year: number };
  setSelectedStartDate: (date: {
    day: number;
    month: number;
    year: number;
  }) => void;
  setSelectedEndDate: (date: {
    day: number;
    month: number;
    year: number;
  }) => void;
}

const PrintModal: React.FC<PrintModalProps> = ({
  isVisible,
  onClose,
  onPrint,
  selectedStartDate,
  selectedEndDate,
  setSelectedStartDate,
  setSelectedEndDate,
}) => {
  // Date picker options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = Array.from({ length: 12 }, (_, i) => i + 1);
  const years = Array.from({ length: 50 }, (_, i) => 2020 + i);

  const handlePrint = () => {
    const startDate = `${selectedStartDate.year}-${selectedStartDate.month}-${selectedStartDate.day}`;
    const endDate = `${selectedEndDate.year}-${selectedEndDate.month}-${selectedEndDate.day}`;
    onPrint(startDate, endDate);
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
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
                      selectedStartDate.month === month && styles.selectedItem,
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
                        selectedStartDate.year === year && styles.selectedText,
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
                        selectedEndDate.month === month && styles.selectedText,
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
                onPress={onClose}
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
  );
};

const styles = StyleSheet.create({
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
});

export default PrintModal;
