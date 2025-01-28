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
import { ContractListType, CreateTaskType } from "@/app/types/management/task";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import ButtonComponent from "../../helper/buttons";
import TextInputComponent from "../../helper/textInput";
import SubmitButtonComponent from "../../helper/submitButton";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";

const CreateTaskComponent = () => {
  const {
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
    create_shift,
    dates,
    start_time,
    end_time,
  } = useManagementTask();

  const primary = useThemeColor({}, "primaryColor");
  const text = useThemeColor({}, "text");
  const inactivebtn = useThemeColor({}, "inactivebtn");
  const innerBackground = useThemeColor({}, "innerBackground");
  const hightlight = useThemeColor({}, "highlight");
  const textinput = useThemeColor({}, "textinput");
  const otherText = useThemeColor({}, "otherText");

  const [contracts, setContracts] = useState<ContractListType[] | undefined>(
    []
  );
  const [employees, setEmployees] = useState<EmployeeType[] | undefined>([]);

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
  const handleCreateTask = async () => {
    alert("Creating task");
    // MAke sure all of the fields are selected before creating the task or return an error
    // if (!siteSelected) {
    //   console.error("site not selected");
    //   return;
    // }
    // if (amount === undefined) {
    //   console.error("amount not selected");
    //   setAmountError("amount is required");
    //   return;
    // }
    // if (description === undefined) {
    //   console.error("description not selected");
    //   setDescriptionError("description is required");
    //   return;
    // }
    // if (taskSerial === undefined) {
    //   console.error("Task serial not provided");
    //   setTaskSerialError("task serial is required");
    //   return;
    // }
    // if (!employeeSelected) {
    //   console.error("employee not selected");
    //   return;
    // }
    // if (!dates) {
    //   console.error("Date not provided");
    //   return;
    // }
    // if (!start_time) {
    //   console.error("Start time not provided");
    //   return;
    // }
    // if (!end_time) {
    //   console.error("Task end time not provided");
    //   return;
    // }
    /* Check if the employee is selected and call the approiprate method */
    const task: CreateTaskType = {
      task_serial: taskSerial,
      description,
      contract_id: siteSelected?.contract_id,
      employee_id: employeeSelected?.employee_id,
      start_time,
      end_time,
      dates,
      amount: amount ? parseInt(amount) : 0,
    };
    // Check if the employee id is empty and call the create task method
    try {
      setIsTaskCreated(true);
      if (employeeSelected === null) {
        await create_task(task);
        console.log("task created");
      } else {
        await create_shift(task);
        console.log("task assigned");
      }
    } catch (e) {
      console.error("Failed to create task resulting in error ", e);
    }finally{
      setIsTaskCreated(false);
    }
  };

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
              onPress={() => handleToggleSites("contracts")}
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
                {contracts?.map((site, index) => (
                  <TouchableOpacity
                    onPress={() => setSiteSelected(site)}
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
                {employees?.map((employee, index) => (
                  <TouchableOpacity
                    onPress={() => setEmployeeSelected(employee)}
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
          {siteSelected && employeeSelected === null && (
            <View style={{ marginHorizontal: 10 }}>
              <Text style={[styles.infoText, { color: hightlight }]}>
                Make sure to select shift before selecting date.
              </Text>
              <Text style={[styles.infoText, { color: hightlight }]}>
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
              <Text style={[styles.selectedText, { color: hightlight }]}>
                {siteSelected?.client_name}
              </Text>
              <Text style={[styles.selectedText, { color: hightlight }]}>
                {siteSelected?.contract_name}
              </Text>
              <Text style={[styles.selectedText, { color: hightlight }]}>
                {siteSelected?.contract_address}
              </Text>
              <Text style={[styles.selectedText, { color: hightlight }]}>
                {siteSelected?.contract_id}
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
            <View>
              <Text>{amount_error}</Text>
              <TextInputComponent
                text="amount"
                value={amount}
                setValue={setAmount}
                placeholder="amount"
              />
            </View>

            <View>
              <TextInputComponent
                text="description"
                value={description}
                setValue={setDescription}
                placeholder="description"
                isMultiline={true}
                lines={2}
              />
            </View>

            <View>
              <TextInputComponent
                text="task serial"
                value={taskSerial}
                setValue={setTaskSerial}
                placeholder="task serial"
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
            onPress={handleCreateTask}
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
    borderWidth: 0.2,
    padding: Platform.OS === "web" ? 5 : 10,
    borderRadius: 5,
    flex: 1,
    fontFamily: "BarlowRegular",
    fontSize: Platform.OS === "web" ? 13 : 16,
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
