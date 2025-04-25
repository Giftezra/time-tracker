import {
  StyleSheet,
  Text,
  View,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ContractDetailsType } from "@/app/types/management/client";
import DateScroller from "../../helper/dateScroller";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { useClientContext } from "@/app/context/management/client/clientContext";
const EditContractComponent = ({
  activeContract,
}: {
  activeContract: ContractDetailsType | undefined;
}) => {
  const { updateContract, isUpdateContractLoading } = useClientContext(); // Get the update contract and is update contract loading from the client context
  const [contract, setContract] = useState<ContractDetailsType | undefined>(
    activeContract
  );
  const [showStartDateScroller, setShowStartDateScroller] = useState(false);
  const [showEndDateScroller, setShowEndDateScroller] = useState(false);

  // State for start date
  const [startDay, setStartDay] = useState(1);
  const [startMonth, setStartMonth] = useState(1);
  const [startYear, setStartYear] = useState(2024);

  // State for end date
  const [endDay, setEndDay] = useState(1);
  const [endMonth, setEndMonth] = useState(1);
  const [endYear, setEndYear] = useState(2024);

  /** Use the start and end date from the active contract to set the start and end date in the state.
   * Create anew date object from the start and end date from the active contract
   * Set the day, month and year from the date object to the state
   */
  useEffect(() => {
    if (activeContract?.start_date) {
      const startDate = new Date(activeContract.start_date);
      setStartDay(startDate.getDate());
      setStartMonth(startDate.getMonth() + 1);
      setStartYear(startDate.getFullYear());
    }
    if (activeContract?.end_date) {
      const endDate = new Date(activeContract.end_date);
      setEndDay(endDate.getDate());
      setEndMonth(endDate.getMonth() + 1);
      setEndYear(endDate.getFullYear());
    }
  }, [activeContract]);

  /** Handle the input change for the contract details using the key of the contract details and the value of the input */
  const handleInputChange = (key: keyof ContractDetailsType, value: string) => {
    setContract((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /** Format the date to be in the format YYYY-MM-DD */
  const formatDate = (day: number, month: number, year: number) => {
    return `${year}-${month.toString().padStart(2, "0")}-${day
      .toString()
      .padStart(2, "0")}`;
  };

  /** Handle start date changes and update both date state and contract state */
  const handleStartDateChange = (
    newDay: number,
    newMonth: number,
    newYear: number
  ) => {
    setStartDay(newDay);
    setStartMonth(newMonth);
    setStartYear(newYear);

    const formattedDate = formatDate(newDay, newMonth, newYear);
    setContract((prev) => ({
      ...prev,
      start_date: formattedDate,
    }));
  };

  /** Handle end date changes and update both date state and contract state */
  const handleEndDateChange = (
    newDay: number,
    newMonth: number,
    newYear: number
  ) => {
    setEndDay(newDay);
    setEndMonth(newMonth);
    setEndYear(newYear);

    const formattedDate = formatDate(newDay, newMonth, newYear);
    setContract((prev) => ({
      ...prev,
      end_date: formattedDate,
    }));
  };

  /** Handle the save button press */
  const handleSaveButtonPress = async () => {
    if (contract) {
      await updateContract(contract);
    }
  };

  return (
    <View style={styles.container}>
      {/* Add Header Section */}
      <View style={styles.headerContainer}>
        <Text style={styles.headerTitle}>Edit Contract Details</Text>
        <Text style={styles.headerSubtitle}>
          {contract?.name || "New Contract"}
        </Text>
      </View>

      <View style={styles.formContainer}>
        <TextInput
          style={styles.input}
          placeholder="Contract Name"
          value={contract?.name}
          onChangeText={(value) => handleInputChange("name", value)}
          placeholderTextColor="#6c757d"
        />

        <TextInput
          style={styles.input}
          placeholder="Address"
          value={contract?.address}
          onChangeText={(value) => handleInputChange("address", value)}
          placeholderTextColor="#6c757d"
        />

        <TextInput
          style={styles.input}
          placeholder="Postcode"
          value={contract?.postcode}
          onChangeText={(value) => handleInputChange("postcode", value)}
          placeholderTextColor="#6c757d"
        />

        <TextInput
          style={styles.input}
          placeholder="City"
          value={contract?.city}
          onChangeText={(value) => handleInputChange("city", value)}
          placeholderTextColor="#6c757d"
        />

        {/* Start Date Section */}
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowStartDateScroller(!showStartDateScroller)}
        >
          <Text style={styles.dateButtonText}>
            Start Date: {formatDate(startDay, startMonth, startYear)}
          </Text>
          <MaterialCommunityIcons name="calendar" size={24} color="black" />
        </Pressable>

        {showStartDateScroller && (
          <DateScroller
            day={startDay}
            month={startMonth}
            year={startYear}
            onChangeDay={(day) =>
              handleStartDateChange(day, startMonth, startYear)
            }
            onChangeMonth={(month) =>
              handleStartDateChange(startDay, month, startYear)
            }
            onChangeYear={(year) =>
              handleStartDateChange(startDay, startMonth, year)
            }
          />
        )}

        {/* End Date Section */}
        <Pressable
          style={styles.dateButton}
          onPress={() => setShowEndDateScroller(!showEndDateScroller)}
        >
          <Text style={styles.dateButtonText}>
            End Date: {formatDate(endDay, endMonth, endYear)}
          </Text>

          <MaterialCommunityIcons name="calendar" size={24} color="black" />
        </Pressable>

        {showEndDateScroller && (
          <DateScroller
            day={endDay}
            month={endMonth}
            year={endYear}
            onChangeDay={(day) => handleEndDateChange(day, endMonth, endYear)}
            onChangeMonth={(month) =>
              handleEndDateChange(endDay, month, endYear)
            }
            onChangeYear={(year) => handleEndDateChange(endDay, endMonth, year)}
          />
        )}
      </View>

      <Pressable
        style={[
          styles.saveButton,
          isUpdateContractLoading && styles.saveButtonDisabled,
        ]}
        onPress={() => handleSaveButtonPress()}
        disabled={isUpdateContractLoading}
      >
        <Text style={styles.saveButtonText}>
          {isUpdateContractLoading ? "Saving..." : "Save Changes"}
        </Text>
      </Pressable>
    </View>
  );
};

export default EditContractComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#fff",
  },
  headerContainer: {
    backgroundColor: "#fff",
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#e9ecef",
    marginBottom: 16,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "BarlowSemiBold",
    color: "#212529",
    marginBottom: 4,
  },
  headerSubtitle: {
    fontSize: 16,
    fontFamily: "BarlowRegular",
    color: "#6c757d",
  },
  formContainer: {
    padding: 16,
  },
  input: {
    borderWidth: 1,
    borderColor: "#dee2e6",
    borderRadius: 8,
    padding: 14,
    marginBottom: 16,
    fontSize: 16,
    fontFamily: "BarlowRegular",
    backgroundColor: "#f8f9fa",
    color: "#212529",
  },
  dateButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    backgroundColor: "#f8f9fa",
    padding: 14,
    borderRadius: 8,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: "#dee2e6",
  },
  dateButtonText: {
    fontSize: 16,
    fontFamily: "BarlowRegular",
    color: "#212529",
  },
  saveButton: {
    backgroundColor: "#0066ff",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: "auto",
    marginBottom: 20,
    marginHorizontal: 16,
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  saveButtonDisabled: {
    backgroundColor: "#99c2ff",
  },
  saveButtonText: {
    color: "#fff",
    fontSize: 16,
    fontFamily: "BarlowSemiBold",
  },
});
