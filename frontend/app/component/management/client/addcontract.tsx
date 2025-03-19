import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  Touchable,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useState } from "react";
import {
  GestureHandlerRootView,
  Pressable,
} from "react-native-gesture-handler";
import CalendarComponent from "../../helper/customCalendar";
import { useThemeColor } from "@/hooks/useThemeColor";
import TextInputComponent from "../../helper/textInput";
import SubmitButtonComponent from "../../helper/submitButton";
import { useClientContext } from "@/app/context/management/client/clientContext";
import DateScroller from "../../helper/dateScroller";
import { MaterialCommunityIcons } from "@expo/vector-icons";

const renderCalendar = () => {
  return (
    <CalendarComponent
      onSelectDate={() => {
        alert("Date selected");
      }}
    />
  );
};

const AddContractComponent = () => {
  // Get the methods from the context.
  const { newContract, handleAddContractInput, createContract } =
    useClientContext();

  const innerBackground = useThemeColor({}, "innerBackground");
  const otherText = useThemeColor({}, "otherText");
  const text = useThemeColor({}, "text");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const textinput = useThemeColor({}, "textinput");

  const [enterAddress, setEnterAddress] = useState(false);
  const [showStartDateScroller, setShowStartDateScroller] = useState(false);
  const [showEndDateScroller, setShowEndDateScroller] = useState(false);

  // Add state for date components
  const [startDate, setStartDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  const [endDate, setEndDate] = useState({
    day: new Date().getDate(),
    month: new Date().getMonth() + 1,
    year: new Date().getFullYear(),
  });

  // Format date helper function
  const formatDate = (day: number, month: number, year: number) => {
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  // Handle start date changes
  const handleStartDateChange = (
    newDay: number,
    newMonth: number,
    newYear: number
  ) => {
    setStartDate({ day: newDay, month: newMonth, year: newYear });
    const formattedDate = formatDate(newDay, newMonth, newYear);
    handleAddContractInput("start_date", formattedDate);
  };

  // Handle end date changes
  const handleEndDateChange = (
    newDay: number,
    newMonth: number,
    newYear: number
  ) => {
    setEndDate({ day: newDay, month: newMonth, year: newYear });
    const formattedDate = formatDate(newDay, newMonth, newYear);
    handleAddContractInput("end_date", formattedDate);
  };

  const toggleEnterAddress = () => setEnterAddress(!enterAddress);

  // Modify the date scroller toggle functions to ensure only one is open at a time
  const toggleStartDateScroller = () => {
    setShowStartDateScroller(!showStartDateScroller);
    setShowEndDateScroller(false); // Close end date scroller
  };

  const toggleEndDateScroller = () => {
    setShowEndDateScroller(!showEndDateScroller);
    setShowStartDateScroller(false); // Close start date scroller
  };

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <ScrollView style={styles.scrollView}>
        <Text style={styles.pageTitle}>Create a new contract</Text>

        <View style={styles.warningContainer}>
          <Text style={styles.warningText}>
            Note: contracts created on time tracker does not reflect a signed
            contract. Time tracker is solely used to manage clients and general
            task systems.
          </Text>
          <Text style={styles.warningText}>
            Please read our terms and conditions and privacy policy
          </Text>

          <Pressable style={styles.warningPressables}>
            <Text style={{ textDecorationLine: "underline" }}>here</Text>
          </Pressable>
        </View>

        <View style={styles.formContainer}>
          <TextInputComponent
            placeholder="Contract name"
            text="Contract name"
            value={newContract?.name}
            setValue={(text) => handleAddContractInput("contract_name", text)}
          />

          <View style={styles.postcodeContainer}>
            <View style={styles.postcodeInput}>
              <TextInputComponent
                placeholder="Post code"
                text="Post code"
                value={newContract?.postcode}
                setValue={(text) => handleAddContractInput("postcode", text)}
              />
            </View>
            <Pressable
              style={[styles.findAddressBtn, { backgroundColor: otherText }]}
            >
              <Text style={[styles.findAddressBtnText, { color: text }]}>
                Find Address
              </Text>
            </Pressable>
          </View>

          <Pressable
            onPress={toggleEnterAddress}
            style={styles.manualAddressBtn}
          >
            <Text style={styles.manualAddressText}>
              {enterAddress
                ? "− Hide manual address"
                : "+ Enter address manually"}
            </Text>
          </Pressable>

          {enterAddress && (
            <View style={styles.addressFields}>
              <TextInputComponent
                placeholder="Address line 1"
                text="Address line 1"
                value={newContract?.address}
                setValue={(text) => handleAddContractInput("address", text)}
              />

              <TextInputComponent
                placeholder="City"
                text="City"
                value={newContract?.city}
                setValue={(text) => handleAddContractInput("city", text)}
              />
            </View>
          )}

          <View style={styles.dateContainer}>
            <View style={styles.dateField}>
              <Pressable
                style={styles.dateButton}
                onPress={toggleStartDateScroller}
              >
                <Text style={styles.dateButtonText}>
                  Start Date:{" "}
                  {formatDate(startDate.day, startDate.month, startDate.year)}
                </Text>
                <MaterialCommunityIcons
                  name="calendar"
                  size={24}
                  color="black"
                />
              </Pressable>

              {showStartDateScroller && (
                <View style={styles.dateScrollerContainer}>
                  <DateScroller
                    day={startDate.day}
                    month={startDate.month}
                    year={startDate.year}
                    onChangeDay={(day) =>
                      handleStartDateChange(
                        day,
                        startDate.month,
                        startDate.year
                      )
                    }
                    onChangeMonth={(month) =>
                      handleStartDateChange(
                        startDate.day,
                        month,
                        startDate.year
                      )
                    }
                    onChangeYear={(year) =>
                      handleStartDateChange(
                        startDate.day,
                        startDate.month,
                        year
                      )
                    }
                  />
                </View>
              )}
            </View>

            <View style={styles.dateField}>
              <Pressable
                style={styles.dateButton}
                onPress={toggleEndDateScroller}
              >
                <Text style={styles.dateButtonText}>
                  End Date:{" "}
                  {formatDate(endDate.day, endDate.month, endDate.year)}
                </Text>
                <MaterialCommunityIcons
                  name="calendar"
                  size={24}
                  color="black"
                />
              </Pressable>

              {showEndDateScroller && (
                <View style={styles.dateScrollerContainer}>
                  <DateScroller
                    day={endDate.day}
                    month={endDate.month}
                    year={endDate.year}
                    onChangeDay={(day) =>
                      handleEndDateChange(day, endDate.month, endDate.year)
                    }
                    onChangeMonth={(month) =>
                      handleEndDateChange(endDate.day, month, endDate.year)
                    }
                    onChangeYear={(year) =>
                      handleEndDateChange(endDate.day, endDate.month, year)
                    }
                  />
                </View>
              )}
            </View>
          </View>

          <View style={styles.submitContainer}>
            <SubmitButtonComponent
              title="create Contract"
              onPress={createContract}
            />
          </View>
        </View>
      </ScrollView>
    </GestureHandlerRootView>
  );
};

export default AddContractComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    width: "100%",
    backgroundColor: "#fff",
  },
  scrollView: {
    flex: 1,
    padding: Platform.OS === "web" ? 40 : 20,
  },
  pageTitle: {
    fontSize: Platform.OS === "web" ? 24 : 20,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    marginBottom: 20,
    color: "#1a1a1a",
  },
  warningContainer: {
    backgroundColor: "#fff8e6",
    borderRadius: 8,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ffd700",
  },
  warningText: {
    fontSize: Platform.OS === "web" ? 14 : 13,
    fontFamily: "BarlowRegular",
    color: "#666666",
    lineHeight: 20,
    marginBottom: 8,
  },
  linkText: {
    color: "#0066cc",
    textDecorationLine: "underline",
    fontSize: Platform.OS === "web" ? 14 : 13,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  postcodeContainer: {
    flexDirection: "row",
    alignItems: "flex-end",
    marginBottom: 16,
    gap: 12,
  },
  postcodeInput: {
    flex: 1,
  },
  findAddressBtn: {
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 6,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 120,
  },
  findAddressBtnText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
  },
  manualAddressBtn: {
    marginBottom: 16,
  },
  manualAddressText: {
    fontSize: 14,
    color: "#0066cc",
    fontFamily: "BarlowRegular",
  },
  addressFields: {
    gap: 16,
    marginBottom: 16,
  },
  dateContainer: {
    flexDirection: "column",
    gap: 16,
    marginBottom: 24,
  },
  dateField: {
    width: "100%",
  },
  submitContainer: {
    marginTop: 8,
  },
  warningPressables: {
    flexDirection: "row",
    alignItems: "center",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 12,
    borderRadius: 5,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: "BarlowRegular",
    color: "#4a4a4a",
  },
  dateScrollerContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 5,
    padding: 8,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
});
