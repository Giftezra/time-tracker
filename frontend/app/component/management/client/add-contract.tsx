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
  const toggleEnterAddress = () => setEnterAddress(!enterAddress);

  return (
    <GestureHandlerRootView>
      <Text>Create a new contract</Text>
      <View style={styles.warningContainer}>
        <Text style={styles.warningText}>
          Note: contracts created on time tracker does not reflect a signed
          contract. Time tracker is solely used to manage clients and general
          task systems.
        </Text>
        <Text style={styles.warningText}>
          plese read our terms and conditions
          <Pressable style={styles.warningPressables}>
            <Text
              style={[styles.warningText, { textDecorationLine: "underline" }]}
            >
              here
            </Text>
          </Pressable>
          and privacy policy
          <Pressable style={styles.warningPressables}>
            <Text
              style={[styles.warningText, { textDecorationLine: "underline" }]}
            >
              here
            </Text>
          </Pressable>
        </Text>
      </View>
      {/* The view displays a form used to enter the contract data.
      The view display date pickers to select the start and end date of the contract 
       */}
      <View>
        <TextInputComponent
          placeholder="contract name"
          text="contract name"
          value={newContract?.name}
          setValue={(text) => {
            handleAddContractInput("contract_name", text);
          }}
        />
        <TextInputComponent
          placeholder="description"
          text="description"
          isMultiline
          lines={3}
          value={newContract?.description}
          setValue={(text) => {
            handleAddContractInput("description", text);
          }}
        />

        <View style={styles.postcodeContainer}>
          <View style={{ flexGrow: 1 }}>
            <TextInputComponent
              placeholder="post code"
              text="post code"
              value={newContract?.postcode}
              setValue={(text) => {
                handleAddContractInput("postcode", text);
              }}
            />
          </View>
          <Pressable
            style={[styles.findAddressbtn, { backgroundColor: otherText }]}
          >
            <Text style={[styles.findaddressBtnText, { color: text }]}>
              find address
            </Text>
          </Pressable>
        </View>

        <Pressable onPress={toggleEnterAddress}>
          <Text
            style={{ fontSize: 12, textTransform: "capitalize", padding: 2 }}
          >
            enter address manually
          </Text>
        </Pressable>

        {/* Conditionally render the other parts of the contract details input if the user toggles the enter address manually */}
        {enterAddress && (
          <View style={{ width: "100%" }}>
            <TextInputComponent
              placeholder="address line 1"
              text="adress line 1"
              value={newContract?.address}
              setValue={(text) => {
                handleAddContractInput("address", text);
              }}
            />

            <TextInputComponent
              placeholder="city"
              text="city"
              value={newContract?.city}
              setValue={(text) => {
                handleAddContractInput("city", text);
              }}
            />

            <TextInputComponent
              placeholder="country"
              text="country"
              value={newContract?.country}
              setValue={(text) => {
                handleAddContractInput("country", text);
              }}
            />
          </View>
        )}

        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-evenly",
            width: "100%",
          }}
        >
          <View style={{ flexGrow: 1 }}>
            <TextInputComponent
              placeholder="YYYY-MM-DD"
              text="start date"
              value={newContract?.start_date}
              setValue={(text) => {
                handleAddContractInput("start_date", text);
              }}
            />
          </View>
          <View style={{ flexGrow: 1 }}>
            <TextInputComponent
              placeholder="YYYY-MM-DD"
              text="end date"
              value={newContract?.end_date}
              setValue={(text) => {
                handleAddContractInput("end_date", text);
              }}
            />
          </View>
        </View>
        <TextInputComponent
          placeholder="contract type"
          text="contract type"
          value={newContract?.contract_type}
          setValue={(text) => {
            handleAddContractInput("contract_type", text);
          }}
        />
        <SubmitButtonComponent title="save contract" onPress={createContract} />
      </View>
    </GestureHandlerRootView>
  );
};

export default AddContractComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    width: "100%",
  },

  warningContainer: {
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    padding: 2,
  },

  warningPressables: {
    flexDirection: "row",
    alignItems: "center",
    marginHorizontal: 5,
  },

  warningText: {
    fontSize: Platform.OS === "web" ? 10 : 14,
    fontFamily: "BarlowRegular",
    fontWeight: "400",
  },

  container: {
    flex: 1,
    width: "100%",
    flexDirection: "column",
    padding: 10,
    alignSelf: "center",
    marginTop: 20,
  },

  inputContainer: {
    flexDirection: "column",
    marginVertical: 2,
  },

  input: {
    padding: Platform.OS === "web" ? 3 : 5,
    marginVertical: 2,
    borderRadius: 2,
  },

  headerTexts: {
    fontSize: Platform.OS === "web" ? 12 : 14,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
  },

  postcodeContainer: {
    flexGrow: 1,
    flexDirection: "row",
    justifyContent: "space-between",
    flexWrap: "wrap",
    alignItems: "center",
    columnGap: 5,
  },

  findAddressbtn: {
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
    marginTop: 10,
  },

  findaddressBtnText: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    textTransform: "capitalize",
  },
});
