import {
  ActionSheetIOS,
  ActivityIndicator,
  Button,
  Image,
  Modal,
  StyleSheet,
  ScrollView,
  Text,
  TouchableOpacity,
  View,
  TextInput,
  Platform,
} from "react-native";
import React, { useEffect, useLayoutEffect, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";

import { ca, DatePickerModal, TimePickerModal } from "react-native-paper-dates";

import { EmployeeType } from "@/app/types/management/employee";
import { user_image } from "@/app/utils/images";
import {
  ContractListType,
  CreateTaskInterface,
} from "@/app/types/management/task";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import ButtonComponent from "../../helper/buttons";
import TextInputComponent from "../../helper/textInput";
import SubmitButtonComponent from "../../helper/submitButton";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";

const CreateTaskComponent = () => {
  const {
    contractList,
    employeeList,
    onConfirmDate,
    onConfirmStartTime,
    onConfirmEndTime,
    onDateDismiss,
    onStartTimeDismiss,
    onEndTimeDismiss,
    handle_date_display: handleDateDisplay,
    handle_time_display: handleTimeDisplay,
    dateVisible,
    start_time_visible: startTimeVisible,
    endTimeVisible,
    isLoading,
    create_task,
    createShift: create_shift,
    dates,
    start_time,
    end_time,
    collectNewTaskData,
    taskData,
  } = useManagementTask();

  const primary = useThemeColor({}, "primaryColor");
  const text = useThemeColor({}, "text");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const innerBackground = useThemeColor({}, "innerBackground");
  const hightlight = useThemeColor({}, "highlight");
  const textinput = useThemeColor({}, "textinput");
  const otherText = useThemeColor({}, "otherText");

  const [siteSelected, setSiteSelected] = useState<ContractListType | null>(
    null
  );
  const [employeeSelected, setEmployeeSelected] = useState<EmployeeType | null>(
    null
  );

  const [amount, setAmount] = useState<string | undefined>(undefined);
  const [selected, setSelected] = useState<string>("");
  const [description, setDescription] = useState<string | undefined>(undefined);
  const [taskSerial, setTaskSerial] = useState<string | undefined>(undefined);
  const [amount_error, setAmountError] = useState<string>("");
  const [description_error, setDescriptionError] = useState<string>("");
  const [task_serial_error, setTaskSerialError] = useState<string>("");
  const [isTaskCreated, setIsTaskCreated] = useState<boolean>(false);

  /**
   * The method is used to handle the toggling of the contract list and the list of employees.
   * When one is selected, the other is unselected so it is closed.
   * @param selected the selected item
   * @returns void
   */
  const handleToggleSites = (selected: string) => {
    if (selected === "contracts" || selected === "employees") {
      setSelected((prevSelected) =>
        prevSelected === selected ? "" : selected
      );
    }
  };

  /**
   * This method is used to gather all of the selected component, and would handle the creation of the task
   * To do this, it will call the create_task method from the management task context and pass the required parameters
   */

  return (
    <View style={styles.maincontainer}>
      <Text
        style={[
          styles.headerText,
          { marginVertical: 10, fontSize: 14, color: otherText },
        ]}
      >
        Create Task
      </Text>
      <ScrollView
        style={{ flex: 1 }}
        showsVerticalScrollIndicator={false}
        nestedScrollEnabled={true}
      >
        <View style={{ width: "100%" }}>
          {/* The container contains the fetched shift from the server. the AllSiteProps is used to manage the types allowed.
        
        The View is scrollable and allows the users to scroll through a long light of sites*/}
          <View
            style={[
              styles.container,
              { backgroundColor: innerBackground, shadowColor: primary },
            ]}
          >
            <TouchableOpacity
              onPressIn={() => handleToggleSites("contracts")}
              style={[styles.button]}
            >
              {isLoading ? (
                <ActivityIndicator size={15} color={text} />
              ) : (
                <Text style={[styles.headerText, { color: text }]}>
                  select contract
                </Text>
              )}
            </TouchableOpacity>

            {selected === "contracts" && (
              <ScrollView
                style={styles.scrollviewContainer}
                nestedScrollEnabled={true}
                showsHorizontalScrollIndicator={false}
              >
                {contractList?.map((site, index) => (
                  <TouchableOpacity
                    onPress={() => setSiteSelected(site)}
                    // Check if the site is undefined before collecting and assigning the data
                    // Else assign an empty string
                    onPressOut={() =>
                      collectNewTaskData(
                        "contract_id",
                        site.contract_id !== undefined ? site.contract_id : ""
                      )
                    }
                    key={index}
                    style={[
                      styles.pressable,
                      siteSelected === site && {
                        backgroundColor: primary,
                        borderRadius: 5,
                        shadowColor: "red",
                        padding: 4,
                      },
                      { backgroundColor: inactivebtn },
                    ]}
                  >
                    <View style={styles.contractTeXtContainer}>
                      <Text style={[styles.text, { color: text }]}>
                        {site.contract_id}
                      </Text>
                      <Text style={[styles.text, { color: text }]}>
                        {site.contract_name}
                      </Text>
                    </View>
                    <View style={styles.contractTeXtContainer}>
                      <Text style={[styles.text, { color: text }]}>
                        {site.contract_address}
                      </Text>
                      <Text style={[styles.text, { color: text }]}>
                        {site.contract_city}
                      </Text>
                      <Text style={[styles.text, { color: text }]}>
                        {site.client_name}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          <View
            style={[
              styles.container,
              { backgroundColor: innerBackground, shadowColor: primary },
            ]}
          >
            <TouchableOpacity
              onPress={() => handleToggleSites("employees")}
              style={styles.button}
            >
              <Text style={[styles.buttonText, { color: text }]}>
                select employee
              </Text>
            </TouchableOpacity>

            {selected === "employees" && (
              <ScrollView
                style={styles.scrollviewContainer}
                nestedScrollEnabled={true}
                showsHorizontalScrollIndicator={false}
              >
                {employeeList?.map((employee, index) => (
                  <TouchableOpacity
                    onPress={() => setEmployeeSelected(employee)}
                    // Collect the employee id after the user selects the employee.
                    // Check if the employee id is undefined before collecting and assigning the data
                    // Else assign an empty string
                    onPressOut={() =>
                      collectNewTaskData(
                        "employee_id",
                        employee.employee_id !== undefined
                          ? employee.employee_id
                          : ""
                      )
                    }
                    key={index}
                    style={[
                      styles.pressable,
                      employeeSelected === employee && {
                        backgroundColor: primary,
                        borderRadius: 5,
                        shadowColor: "red",
                        padding: 4,
                      },
                      { backgroundColor: inactivebtn },
                    ]}
                  >
                    <Image source={user_image} style={styles.image} />
                    <View
                      style={{
                        flex: 1,
                        flexDirection: "row",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <Text style={[styles.text, { color: text }]}>
                        {employee.employee_name}
                      </Text>
                      <Text style={[styles.text, { color: text }]}>
                        {employee.employee_id}
                      </Text>
                    </View>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
          </View>

          {/* Conditionally render the apps information display when the user is yet to select  a staff member and an employee*/}
          {siteSelected && !employeeSelected && (
            <View style={{ marginHorizontal: 10 }}>
              <Text style={[styles.infoText, { color: otherText }]}>
                Make sure to select shift before selecting date.
              </Text>
              <Text style={[styles.infoText, { color: otherText }]}>
                A task will be created if no team member is selected
              </Text>
            </View>
          )}
        </View>

        {/* The view contains the date and time selection components */}
        <View style={{ width: "100%" }}>
          <Text style={[styles.headerText, { color: text }]}>
            select date and time
          </Text>
          <View style={styles.selectedContainer}>
            <View style={styles.selectedTextContainer}>
              <Text style={[styles.selectedText, { color: otherText }]}>
                {siteSelected?.client_name}
              </Text>
              <Text style={[styles.selectedText, { color: otherText }]}>
                {siteSelected?.contract_name}
              </Text>
              <Text style={[styles.selectedText, { color: otherText }]}>
                {siteSelected?.contract_address}
              </Text>
            </View>
            <View style={styles.selectedTextContainer}>
              <Text style={[styles.headerText]}>assigned to</Text>
              <View>
                <Text style={[styles.selectedText, { color: hightlight }]}>
                  {employeeSelected?.employee_name}
                </Text>
                <Text style={[styles.selectedText, { color: hightlight }]}>
                  {employeeSelected?.employee_id}
                </Text>
              </View>
            </View>
          </View>

          {/* Buttons to toggle the date and time selection */}
          <View style={styles.dateTimeButtonContainer}>
            <ButtonComponent title="date" onPress={handleDateDisplay} />
            <ButtonComponent title="time" onPress={handleTimeDisplay} />
          </View>

          <DatePickerModal
            visible={dateVisible}
            onDismiss={onDateDismiss}
            onConfirm={onConfirmDate}
            mode="multiple"
            locale={"en"}
            animationType="slide"
            label="Select date"
            saveLabel="Save"
          />

          <TimePickerModal
            visible={startTimeVisible}
            onDismiss={onStartTimeDismiss}
            onConfirm={onConfirmStartTime}
            animationType="slide"
            label="Select time"
            cancelLabel="Cancel"
          />

          <TimePickerModal
            visible={endTimeVisible}
            onDismiss={onEndTimeDismiss}
            onConfirm={onConfirmEndTime}
            animationType="slide"
            label="Select time"
            cancelLabel="Cancel"
          />

          <View style={{ width: "100%", marginVertical: 10 }}>
            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="amount"
                value={amount}
                onChangeText={(text) => {
                  setAmount(text);
                  collectNewTaskData("amount", text);
                }}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="description"
                value={description}
                onChangeText={(text) => {
                  setDescription(text);
                  collectNewTaskData("description", text);
                }}
                multiline={true}
                numberOfLines={3}
              />
            </View>

            <View style={styles.inputContainer}>
              <TextInput
                style={styles.input}
                placeholder="task serial"
                value={taskSerial}
                onChangeText={(text) => {
                  setTaskSerial(text);
                  collectNewTaskData("task_serial", text);
                }}
              />
            </View>
          </View>
          <SubmitButtonComponent
            title={
              isTaskCreated
                ? "Creating task"
                : employeeSelected === null
                ? "create new task"
                : "assign shift"
            }
          />
        </View>
      </ScrollView>
    </View>
  );
};

export default CreateTaskComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flexDirection: "column",
    width: "100%",
    flex: 1,
  },

  container: {
    flexDirection: "column",
    width: "100%",
    borderWidth: 0.1,
    marginBottom: 10,
    elevation: 10,
    shadowRadius: 10,
    borderRadius: 5,
  },

  headerText: {
    fontSize: Platform.OS === "web" ? 12 : 16,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  button: {
    padding: Platform.OS === "web" ? 5 : 10,
    alignItems: "center",
  },

  buttonText: {
    fontSize: Platform.OS === "web" ? 12 : 15,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  scrollviewContainer: {
    width: "100%",
    maxHeight: 200,
    marginVertical: 10,
  },

  pressable: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
    marginVertical: 2,
    marginHorizontal: 3,
    borderRadius: 10,
    shadowRadius: 10,
    elevation: 10,
    shadowOpacity: 0.4,
  },

  text: {
    fontFamily: "RobotoRegular",
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "500",
    textTransform: "lowercase",
  },

  input: {
    padding: 10,
    flex: 1,
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 13 : 16,
    fontWeight: "500",
    textTransform: "capitalize",
  },

  inputContainer:{
    marginVertical: 4,
    borderRadius: 5,
    borderWidth: 1,
  },

  contractTeXtContainer: {
    marginHorizontal: 10,
    marginVertical: 2,
  },

  image: {
    width: 20,
    height: 20,
    borderRadius: 30,
    marginEnd: 10,
  },

  selectedText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    textTransform: "lowercase",
  },

  selectedTextContainer: {
    marginHorizontal: 10,
    marginVertical: 2,
  },

  selectedContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: Platform.OS === "web" ? 5 : 10,
  },

  dateTimeButtonContainer: {
    width: "100%",
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
  },

  dateTimeButton: {
    padding: Platform.OS === "web" ? 7 : 10,
    flex: 1,
    alignItems: "center",
    borderRadius: 5,
    marginHorizontal: 2,
    marginBottom: 10,
    elevation: 10,
    shadowRadius: 10,
    shadowOpacity: 0.5,
  },

  infoText: {
    fontSize: Platform.OS === "web" ? 10 : 15,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
    textTransform: "lowercase",
    color: "red",
    padding: 2,
    marginVertical: 5,
  },
});
