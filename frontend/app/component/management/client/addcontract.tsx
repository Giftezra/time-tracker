import {
  Alert,
  Platform,
  ScrollView,
  StyleSheet,
  View,
  Pressable,
  Text,
} from "react-native";
import React, { useState } from "react";
import { GestureHandlerRootView } from "react-native-gesture-handler";
import CustomCalendar from "../../helper/customCalendar";
import { useThemeColor } from "@/hooks/useThemeColor";
import TextInputComponent from "../../helper/textInput";
import SubmitButtonComponent from "../../helper/submitButton";
import { useClientContext } from "@/app/context/management/client/clientContext";
import DateScroller from "../../helper/dateScroller";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SubHeaderText from "../../helper/SubHeaderText";
import InnerThemedText from "../../helper/InnerThemedText";
import ButtonText from "../../helper/ButtonText";
import AlertModal from "../../helper/AlertModal";

const AddContractComponent = ({isModal}:{isModal:boolean}) => {
  // Get the methods from the context.
  const { newContract, handleAddContractInput, createContract, setNewContract, alertConfig, setAlertConfig, isAlertVisible, setIsAlertVisible } =
    useClientContext();

  const otherText = useThemeColor({}, "otherText");
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

  /**
   * Validate the contract input fields and handle the modal display alert for the user
   */
  const validateContractInput = () => {
    const validationErrors: string[] = [];

    // Add console.log to debug the newContract object
    console.log("Contract details:", newContract);

    // Check if newContract exists first
    if (!newContract) {
      validationErrors.push("Contract details are missing");
      return false;
    }

    // Check contract name - handle both undefined and empty string cases
    if (!newContract.name?.trim()) {
      validationErrors.push("Contract name is required");
    }

    // Rest of the validation checks
    if (!newContract.postcode?.trim()) {
      validationErrors.push("Postcode is required");
    }
    if (!newContract.address?.trim()) {
      validationErrors.push("Address is required");
    }
    if (!newContract.city?.trim()) {
      validationErrors.push("City is required");
    }
    if (!newContract.start_date?.trim()) {
      validationErrors.push("Start date is required");
    }
    if (!newContract.end_date?.trim()) {
      validationErrors.push("End date is required");
    }
    // Check if the start date is before the end date
    if (newContract.start_date && newContract.end_date) {
      const startDate = new Date(newContract.start_date); 
      const endDate = new Date(newContract.end_date);
      if (startDate > endDate) {    
        validationErrors.push("Start date must be before end date");
      }
      if (startDate < new Date()) {
        validationErrors.push("Start date must be in the future");
      }
    }

    if (validationErrors.length > 0) {
      setAlertConfig({
        title: "Validation Error",
        message: validationErrors.join("\n"),
        onConfirm: () => setIsAlertVisible(false),
        isVisible: true,
      });
      setIsAlertVisible(true);
      return false;
    }

    setAlertConfig({  
      title: "Create Contract",
      message: `Are you sure you want to create this contract? ${newContract.name}`,
      onConfirm: () => {
        setIsAlertVisible(false);
        setNewContract(undefined);
        createContract();   
      },
      isVisible: true,
    });
    setIsAlertVisible(true);
    return true;
  };

  return (
    <GestureHandlerRootView style={styles.mainContainer}>
      <ScrollView style={styles.scrollView}>
        <SubHeaderText text="New Contract" />

        <View style={styles.warningContainer}>
          <MaterialCommunityIcons
            name="information"
            size={24}
            color="#947600"
            style={styles.warningIcon}
          />
          <View style={styles.warningTextContainer}>
            <InnerThemedText text="Note: Contracts created in Time Tracker do not constitute legally binding agreements. This system is intended for client and task management purposes only." />
            <View style={styles.termsContainer}>
              <InnerThemedText text="Please review our" />
              <Pressable style={styles.termsLink}>
                <Text style={styles.linkText}>terms and conditions</Text>
              </Pressable>
              <InnerThemedText text="and" />
              <Pressable style={styles.termsLink}>
                <Text style={styles.linkText}>privacy policy</Text>
              </Pressable>
            </View>
          </View>
        </View>

        <View style={styles.formContainer}>
          <TextInputComponent
            placeholder="Enter contract name"
            text="Contract Name"
            value={newContract?.name}
            setValue={(text) => handleAddContractInput("name", text)}
          />

          <View style={styles.postcodeInput}>
            <TextInputComponent
              placeholder="Enter postcode"
              text="Postcode"
              value={newContract?.postcode}
              setValue={(text) => handleAddContractInput("postcode", text)}
            />

            <Pressable style={[styles.findAddressBtn]}>
              <ButtonText text="Find Address" />
            </Pressable>
          </View>

          <Pressable
            onPress={toggleEnterAddress}
            style={styles.manualAddressBtn}
          >
            <MaterialCommunityIcons
              name={enterAddress ? "minus" : "plus"}
              size={20}
              color="#0066cc"
            />
            <Text style={styles.manualAddressText}>
              {enterAddress ? "Hide manual address" : "Enter address manually"}
            </Text>
          </Pressable>

          {enterAddress && (
            <View style={styles.addressFields}>
              <TextInputComponent
                placeholder="Address"
                text="Address"
                autoComplete="address-line1"
                value={newContract?.address}
                setValue={(text) => handleAddContractInput("address", text)}
              />

              <TextInputComponent
                placeholder="City"
                text="City"
                autoComplete="address-line2"
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
                <InnerThemedText
                  text={`Start Date: ${formatDate(
                    startDate.day,
                    startDate.month,
                    startDate.year
                  )}`}
                />
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
                <InnerThemedText
                  text={`End Date: ${formatDate(
                    endDate.day,
                    endDate.month,
                    endDate.year
                  )}`}
                />
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
              title="Create Contract"
              onPress={validateContractInput}
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
    backgroundColor: "#f8f9fa",
  },
  scrollView: {
    flex: 1,
    padding: Platform.OS === "web" ? 40 : 20,
  },
  warningContainer: {
    backgroundColor: "#fff8e6",
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: "#ffe066",
    flexDirection: "row",
    alignItems: "flex-start",
  },
  warningIcon: {
    marginRight: 12,
    marginTop: 2,
  },
  warningTextContainer: {
    flex: 1,
  },
  termsContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginTop: 8,
    gap: 4,
  },
  termsLink: {
    marginHorizontal: 2,
  },
  linkText: {
    color: "#0066cc",
    textDecorationLine: "underline",
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 14 : 13,
  },
  formContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 12,
    padding: 24,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    gap: 20,
  },
  postcodeContainer: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 12,
  },
  postcodeInput: {
    flex: 1,
  },
  findAddressBtn: {
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    minWidth: 130,
    marginTop: 24,
  },
  manualAddressBtn: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  manualAddressText: {
    fontSize: 14,
    color: "#0066cc",
    fontFamily: "BarlowRegular",
  },
  addressFields: {
    gap: 16,
  },
  dateContainer: {
    gap: 16,
  },
  dateField: {
    width: "100%",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e9ecef",
  },
  dateScrollerContainer: {
    backgroundColor: "#ffffff",
    borderRadius: 8,
    padding: 16,
    borderWidth: 1,
    borderColor: "#e9ecef",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  submitContainer: {
    marginTop: 24,
  },
});
