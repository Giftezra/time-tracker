import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { TaskDetailsType } from "@/app/types/staff/task";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useTask } from "@/app/context/staff/staffTaskProvider";
import ButtonComponent from "../../helper/buttons";

const renderDot = () => {
  return <View style={styles.dot} />;
};

const TaskDetailsComponent = ({
  props,
  onModalClose,
}: {
  props: TaskDetailsType;
  onModalClose: () => void;
}) => {
  const { calculateTimeDifference, calculateTaskStartTime, applyForTask } =
    useTask();
  const [countDown, setCountDown] = useState<string>("");

  /**
   * Implement the useTheme hook to get the colors based on the theme.
   */
  const text = useThemeColor({}, "text");
  const activebtn = useThemeColor({}, "activebtn");
  const otherText = useThemeColor({}, "otherText");
  const background = useThemeColor({}, "innerBackground");

  /**
   * This useeffect counts down the task start time
   *  */
  useEffect(() => {
    // Function to update the countdown
    const updateCountdown = () => {
      const countdownValue = calculateTaskStartTime();
      setCountDown(countdownValue);
    };

    // Initial update
    updateCountdown();

    // Set interval to update every second
    const intervalId = setInterval(() => {
      updateCountdown();
    }, 1000);

    // Cleanup on unmount
    return () => clearInterval(intervalId);
  }, []);

  return (
    <ScrollView
      style={[styles.maincontainer, { backgroundColor: background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.headerText, { color: text }]}>task details</Text>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>Task serial</Text>
          <Text style={[styles.otherText, { color: text }]}>
            {props.site_serial}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>Site name</Text>
          <Text style={[styles.otherText, { color: text }]}>
            {props.site_name}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>Site address</Text>
          <Text style={[styles.otherText, { color: text }]}>
            {props.site_address}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>Site postcode</Text>
          <Text style={[styles.otherText, { color: text }]}>
            {props.site_postcode}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>Site city</Text>
          <Text style={[styles.otherText, { color: text }]}>
            {props.site_city}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>Shift start time</Text>
          <Text style={[styles.otherText, { color: text }]}>
            {props.start_time}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>Shift end time</Text>
          <Text style={[styles.otherText, { color: text }]}>
            {props.end_time}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>Shift start date</Text>
          <Text style={[styles.otherText, { color: text }]}>
            {props.start_date}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={[styles.headerText, { marginBottom: 5 }]}>
            Information
          </Text>
          <Text style={[styles.otherText, { color: text }]}>
            {props.information}
          </Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>Pay</Text>
          <Text
            style={[styles.otherText, { color: text }]}
          >{`£${props.pay} per hour`}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <View style={styles.innerContainer}>
          <Text style={styles.headerText}>your shift falls into the </Text>
          <Text
            style={[styles.otherText, { color: text }]}
          >{`${props.department} department`}</Text>
        </View>
      </View>

      <View style={styles.container}>
        <Text style={styles.otherText}>
          {`You have to be on this task for ${calculateTimeDifference()}`}
        </Text>
      </View>

      <View style={styles.container}>
        <Text style={[styles.timeText, { color: otherText }]}>
          {`given your current date and time, the task is bound to start in ${countDown}`}
        </Text>
        <Text style={[styles.timeText, { color: otherText }]}>
          Please note that if you pick a task that begins in 24 hours or less,
          you will not be able to cancel the task.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonComponent
          onPress={() => applyForTask(props.id)}
          title="Apply for this task"
        />
      </View>
    </ScrollView>
  );
};

export default TaskDetailsComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    flexDirection: "column",
    width: "100%",
    shadowRadius: 5,
    elevation: 5,
    shadowOpacity: 0.5,
    marginTop: 5,
    padding: 5,
  },

  container: {
    flexDirection: "row",
    flexWrap: "wrap",
    marginVertical: 2,
    marginHorizontal: 5,
    padding: 5,
    alignItems: "center",
    columnGap: 10,
  },

  innerContainer: {
    flex: 1,
    flexDirection: "row",
    flexWrap: "wrap",
    alignItems: "center",
    justifyContent: "space-between",
  },

  headerText: {
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  otherText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    marginHorizontal: 5,
  },

  iconsView: {
    width: 5,
    height: 5,
    borderRadius: 20,
    padding: 5,
    backgroundColor: "white",
    marginHorizontal: 15,
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 10,
  },

  button: {
    flex: 1,
    padding: 10,
    alignItems: "center",
    borderRadius: 5,
  },

  timeText: {
    padding: 5,
    marginVertical: 10,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },

  buttonText: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "RobotoRegular",
    textTransform: "capitalize",
  },

  dot: {
    width: 5,
    height: 5,
    borderRadius: 5,
    padding: 4,
    marginHorizontal: 5,
    backgroundColor: "black",
  },
});
