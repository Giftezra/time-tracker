import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  Pressable,
  Platform,
  ViewStyle,
  TextStyle,
} from "react-native";
import React, { useState } from "react";
import { AntDesign } from "@expo/vector-icons";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import { ActiveTaskType } from "@/app/types/management/task";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";
import { useThemeColor } from "@/hooks/useThemeColor";
import MapView from "react-native-maps"; // Uncomment when ready to implement maps
import { Marker } from "react-native-maps";

const ActiveTask = ({
  activeTaskClicked,
}: {
  activeTaskClicked: ActiveTaskType;
}) => {
  const { hideModal, gotoMessageScreen, terminateTask } = useManagementTask();

  const [terminationError, setTerminationError] = useState<string>("");
  const [isTerminating, setIsTerminating] = useState<boolean>(false);

  /**
   * Method is used to handle the task termination process, and also handles any errors
   * that may occur during the process.
   */
  const handleTaskTermination = async () => {
    setIsTerminating(true);
    try {
      await terminateTask(activeTaskClicked);
    } catch (error) {
      console.log(error);
      setTerminationError("An error occurred while terminating the task");
    } finally {
      setIsTerminating(false);
    }
  };

  const textinput = useThemeColor({}, "textinput");
  const icon = useThemeColor({}, "icon");

  return (
    <View style={styles.mainModalContainer}>
      <View style={[styles.modalContainer, { backgroundColor: textinput }]}>
        <Pressable
          onPress={hideModal}
          style={[styles.modalCloseButton, { backgroundColor: "transparent" }]}
        >
          <AntDesign name="close" size={24} color={icon} />
        </Pressable>

        {activeTaskClicked && (
          <View style={styles.modalContent}>
            <View style={styles.headerSection}>
              <Text style={styles.headerText}>Active Task Details</Text>
            </View>

            {/* Task Information Section */}
            <View style={styles.infoSection}>
              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Shift ID:</Text>
                <Text style={[styles.valueText, { color: '#000' }]}>
                  {activeTaskClicked.shift_id}
                </Text>
              </View>

              <View style={styles.infoRow}>
                <Text style={styles.labelText}>Employee:</Text>
                <View>
                  <Text style={[styles.valueText, { color: 'red' }]}>
                    {activeTaskClicked.employee_name}
                  </Text>
                  <Text style={styles.subText}>
                    ID: {activeTaskClicked.employee_id}
                  </Text>
                </View>
              </View>
            </View>

            {/* Map View Section */}
            <View style={styles.mapContainer}>
              {/* <MapView
                style={styles.map}
                initialRegion={{
                  latitude: activeTaskClicked.latitude || 37.78825,
                  longitude: activeTaskClicked.longitude || -122.4324,
                  latitudeDelta: 0.0922,
                  longitudeDelta: 0.0421,
                }}
              >
                <Marker
                  coordinate={{
                    latitude: activeTaskClicked.latitude || 37.78825,
                    longitude: activeTaskClicked.longitude || -122.4324,
                  }}
                  title={activeTaskClicked.employee_name}
                  description={`Task ID: ${activeTaskClicked.shift_id}`}
                />
              </MapView> */}
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtons}>
              <TouchableOpacity
                style={[styles.actionButton, styles.messageButton]}
                onPress={() => gotoMessageScreen(activeTaskClicked)}
              >
                <AntDesign name="message1" size={24} color={icon} />
                <Text style={styles.buttonText}>Message</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.actionButton, styles.terminateButton]}
                onPress={handleTaskTermination}
                disabled={isTerminating}
              >
                <MaterialCommunityIcons name="cancel" size={24} color={icon} />
                <Text style={styles.buttonText}>
                  {isTerminating ? "Terminating..." : "Terminate Shift"}
                </Text>
              </TouchableOpacity>
            </View>

            {terminationError && (
              <Text style={styles.errorText}>{terminationError}</Text>
            )}
          </View>
        )}
      </View>
    </View>
  );
};

export default ActiveTask;

const styles = StyleSheet.create({
  mainModalContainer: {
    flex: 1,
    justifyContent: "center",
    padding: 20,
    backgroundColor: "rgba(0,0,0,0.5)",
  } as ViewStyle,
  modalContainer: {
    width: "100%",
    maxWidth: Platform.OS === "web" ? 600 : "100%",
    borderRadius: 12,
    overflow: "hidden",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 8,
    shadowOpacity: 0.25,
  } as ViewStyle,
  modalCloseButton: {
    alignSelf: "flex-end",
    padding: 16,
  } as ViewStyle,
  modalContent: {
    padding: 20,
  } as ViewStyle,
  headerSection: {
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E0E0E0",
    paddingBottom: 12,
  } as ViewStyle,
  headerText: {
    fontSize: 24,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
  } as TextStyle,
  infoSection: {
    marginBottom: 24,
  } as ViewStyle,
  infoRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    marginBottom: 16,
  } as ViewStyle,
  labelText: {
    width: 100,
    fontSize: 16,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
    color: "#666",
  } as TextStyle,
  valueText: {
    flex: 1,
    fontSize: 16,
    fontFamily: "BarlowRegular",
    fontWeight: "500",
  } as TextStyle,
  subText: {
    fontSize: 14,
    color: "#666",
    marginTop: 4,
  } as TextStyle,
  mapContainer: {
    height: 200,
    marginBottom: 24,
    borderRadius: 8,
    overflow: "hidden",
    borderWidth: 1,
    borderColor: "#E0E0E0",
  } as ViewStyle,
  map: {
    ...StyleSheet.absoluteFillObject,
  } as ViewStyle,
  actionButtons: {
    flexDirection: "row",
    justifyContent: "space-around",
    marginTop: 16,
  } as ViewStyle,
  actionButton: {
    flexDirection: "row",
    alignItems: "center",
    padding: 12,
    borderRadius: 8,
    minWidth: 150,
    justifyContent: "center",
  } as ViewStyle,
  messageButton: {
    backgroundColor: "#E8F5E9",
    marginRight: 8,
  } as ViewStyle,
  terminateButton: {
    backgroundColor: "#FFEBEE",
    marginLeft: 8,
  } as ViewStyle,
  buttonText: {
    marginLeft: 8,
    fontSize: 16,
    fontFamily: "BarlowRegular",
    fontWeight: "600",
  } as TextStyle,
  errorText: {
    color: "#D32F2F",
    textAlign: "center",
    marginTop: 16,
    fontSize: 14,
  } as TextStyle,
});
