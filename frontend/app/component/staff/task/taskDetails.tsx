import { StyleSheet, Text, View } from "react-native";
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
  const borderColor = useThemeColor({}, "headertext");

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

  const renderDetailRow = (label: string, value: string | number) => (
    <View style={styles.detailRow}>
      <Text style={[styles.label, { color: otherText }]}>{label}</Text>
      <Text style={[styles.value, { color: text }]}>{value}</Text>
    </View>
  );

  return (
    <ScrollView
      style={[styles.container, { backgroundColor: background }]}
      showsVerticalScrollIndicator={false}
    >
      <View style={[styles.header, { borderBottomColor: borderColor }]}>
        <Text style={[styles.headerTitle, { color: text }]}>Task Details</Text>
        <Text style={[styles.taskSerial, { color: otherText }]}>
          {props.task_serial}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: text }]}>
          Location Details
        </Text>
        {renderDetailRow("Site Name", props.site_name || "")}
        {renderDetailRow("Address", props.site_address || "")}
        {renderDetailRow("Postcode", props.site_postcode || "")}
        {renderDetailRow("City", props.site_city || "")}
      </View>

      <View style={[styles.section, { borderColor }]}>
        <Text style={[styles.sectionTitle, { color: text }]}>
          Shift Information
        </Text>
        {renderDetailRow("Start Time", props.start_time)}
        {renderDetailRow("End Time", props.end_time)}
        {renderDetailRow("Date", props.start_date)}
        {renderDetailRow("Duration", calculateTimeDifference())}
        {renderDetailRow("Pay Rate", `£${props.pay}/hour`)}
      </View>

      <View style={[styles.section, { borderColor }]}>
        <Text style={[styles.sectionTitle, { color: text }]}>
          Task Description
        </Text>
        <Text style={[styles.description, { color: text }]}>
          {props.description}
        </Text>
      </View>

      <View
        style={[styles.infoBox, { backgroundColor: background, borderColor }]}
      >
        <MaterialIcons
          name="info"
          size={24}
          color={otherText}
          style={styles.infoIcon}
        />
        <View>
          <Text style={[styles.infoText, { color: otherText }]}>
            Task starts in {countDown}
          </Text>
          <Text style={[styles.warningText, { color: otherText }]}>
            Tasks starting within 24 hours cannot be cancelled after applying
          </Text>
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <ButtonComponent
          onPress={() => applyForTask(props.id)}
          title="Apply for Task"
        />
      </View>
    </ScrollView>
  );
};

export default TaskDetailsComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    paddingBottom: 16,
    marginBottom: 24,
    borderBottomWidth: 1,
  },
  headerTitle: {
    fontSize: 24,
    fontFamily: "BarlowMedium",
    marginBottom: 8,
  },
  taskSerial: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
  },
  section: {
    marginBottom: 24,
    padding: 16,
    borderRadius: 12,
    backgroundColor: "rgba(255,255,255,0.05)",
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: "BarlowMedium",
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(255,255,255,0.1)",
  },
  label: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    flex: 1,
  },
  value: {
    fontSize: 14,
    fontFamily: "BarlowMedium",
    flex: 2,
    textAlign: "right",
  },
  description: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
    lineHeight: 22,
  },
  infoBox: {
    flexDirection: "row",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginBottom: 24,
    alignItems: "center",
  },
  infoIcon: {
    marginRight: 12,
  },
  infoText: {
    fontSize: 14,
    fontFamily: "BarlowMedium",
    marginBottom: 4,
  },
  warningText: {
    fontSize: 12,
    fontFamily: "BarlowRegular",
    opacity: 0.8,
  },
  buttonContainer: {
    paddingVertical: 24,
  },
  applyButton: {
    width: "100%",
    height: 48,
  },
});
