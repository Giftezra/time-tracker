import {
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";

import { TaskDetailsInterface } from "@/app/types/staff/task";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { ScrollView } from "react-native-gesture-handler";
import { useTask } from "@/app/context/staff/staffTaskProvider";
import ButtonComponent from "../../helper/buttons";

const TaskDetailsComponent = ({
  props,
  onModalClose,
}: {
  props: TaskDetailsInterface;
  onModalClose: () => void;
}) => {
  const { calculateTimeDifference, calculateTaskStartTime, applyForTask } =
    useTask();
  const [countDown, setCountDown] = useState<string>("");

  const text = useThemeColor({}, "text");
  const activebtn = useThemeColor({}, "activebtn");
  const otherText = useThemeColor({}, "otherText");
  const background = useThemeColor({}, "innerBackground");

  useEffect(() => {
    const updateCountdown = () => {
      const countdownValue = calculateTaskStartTime();
      setCountDown(countdownValue);
    };

    updateCountdown();

    const intervalId = setInterval(() => {
      updateCountdown();
    }, 1000);

    return () => clearInterval(intervalId);
  }, [calculateTaskStartTime]);

  return (
    <ScrollView
      style={[styles.maincontainer, { backgroundColor: background }]}
      showsVerticalScrollIndicator={false}
    >
      <Text style={[styles.headerText, { color: text }]}>Task Details</Text>

      <View style={styles.card}>
        <Text style={[styles.headerText, { color: text }]}>Task Serial</Text>
        <Text style={[styles.otherText, { color: text }]}>
          {props.task_serial}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.headerText, { color: text }]}>Site Name</Text>
        <Text style={[styles.otherText, { color: text }]}>
          {props.site_name}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.headerText, { color: text }]}>Site Address</Text>
        <Text style={[styles.otherText, { color: text }]}>
          {props.site_address}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.headerText, { color: text }]}>Site Postcode</Text>
        <Text style={[styles.otherText, { color: text }]}>
          {props.site_postcode}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.headerText, { color: text }]}>Site City</Text>
        <Text style={[styles.otherText, { color: text }]}>
          {props.site_city}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.headerText, { color: text }]}>
          Shift Start Time
        </Text>
        <Text style={[styles.otherText, { color: text }]}>
          {props.start_time}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.headerText, { color: text }]}>Shift End Time</Text>
        <Text style={[styles.otherText, { color: text }]}>
          {props.end_time}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.headerText, { color: text }]}>
          Shift Start Date
        </Text>
        <Text style={[styles.otherText, { color: text }]}>
          {props.start_date}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.headerText, { marginBottom: 5 }]}>
          Information
        </Text>
        <Text style={[styles.otherText, { color: text }]}>
          {props.description}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.headerText, { color: text }]}>Pay</Text>
        <Text
          style={[styles.otherText, { color: text }]}
        >{`£${props.pay} per hour`}</Text>
      </View>

      <View style={styles.card}>
        <Text style={styles.otherText}>
          {`You have to be on this task for ${calculateTimeDifference()}`}
        </Text>
      </View>

      <View style={styles.card}>
        <Text style={[styles.timeText, { color: otherText }]}>
          {`Given your current date and time, the task is bound to start in ${countDown}`}
        </Text>
        <Text style={[styles.timeText, { color: otherText }]}>
          Please note that if you pick a task that begins in 24 hours or less,
          you will not be able to cancel the task.
        </Text>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonComponent
          onPress={() => applyForTask(props.id)}
          title="Apply"
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
    marginTop: 10,
    padding: 10,
  },

  card: {
    backgroundColor: "black",
    borderRadius: 2,
    borderWidth: 0.5,
    padding: 5,
    marginVertical: 3,
    shadowRadius: 5,
    elevation: 5,
    shadowOpacity: 0.5,
    shadowColor: "black",
  },

  headerText: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    marginBottom: 5,
  },

  otherText: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },

  buttonContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginVertical: 20,
  },

  timeText: {
    padding: 5,
    marginVertical: 10,
    fontSize: 14,
    fontWeight: "500",
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },
});
