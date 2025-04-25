/**
 * Component is used to display the list of open tasks. the component is self sufficient by callining its own methods to get the data from the server..
 */

import {
  Platform,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Pressable,
} from "react-native";
import { MaterialIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useManagementTask } from "@/app/context/management/task manager/managementTaskProvider";
import ThemedHeaderText from "@/app/component/helper/ThemedHeaderText";
import SearchInputContainer from "@/app/component/helper/SearchInput";
import { useState } from "react";
import { OpenTaskProps } from "@/app/types/management/task";
const OpenTaskComponents = () => {
  // Get the methods from the context
  const {
    unassignedTask,
    openAssignTaskModal,
    setEditTask,
    setIsEditTaskModalVisible,
    deleteTask,
  } = useManagementTask();

  const innerBackground = useThemeColor({}, "innerBackground");
  const highlight = useThemeColor({}, "otherText");
  const [searchQuery, setSearchQuery] = useState("");

  /**
   * Filter all opened task based on the search query which is the contract name or the task serial number
   * @param query is the search query
   * @returns {Promise<OpenTaskProps[]>}
   */
  const filterTasks = (query: string) => {
    const filteredTasks = unassignedTask?.filter((task) => {
      return (
        task.contract_name?.toLowerCase().includes(query.toLowerCase()) ||
        task.task_serial?.toLowerCase().includes(query.toLowerCase())
      );
    });
    return filteredTasks as OpenTaskProps[];
  };

  return (
    <View style={[styles.maincontainer, { backgroundColor: "white" }]}>
      <View style={styles.header}>
        <SearchInputContainer
          placeholder="Contract name or Task Serial Number"
          text="Search open tasks"
          value={searchQuery}
          setValue={setSearchQuery}
        />
      </View>

      <ScrollView
        style={styles.scrollContainer}
        nestedScrollEnabled={true}
        showsHorizontalScrollIndicator={false}
      >
        <View style={styles.container}>
          {/* Map the data
              The mapped data represents a task that will be clickable to open a modal. which will enable the admin assign the task to a user.*/}
          {(searchQuery ? filterTasks(searchQuery) : unassignedTask)?.map(
            (task, index) => (
              /**
               * Main dropdown container for the task component which contains the task details
               */
              <View
                key={index}
                style={[styles.taskCard, { backgroundColor: "white" }]}
              >
                <View style={styles.taskHeader}>
                  <View style={styles.taskTitleContainer}>
                    <ThemedHeaderText text={task.contract_name || ""} />
                    <View
                      style={{
                        flexDirection: "row",
                        gap: 10,
                        alignItems: "center",
                      }}
                    >
                      <Pressable
                        style={[styles.priorityBadge]}
                        onPress={() => {
                          setEditTask(task);
                          setIsEditTaskModalVisible(true);
                        }}
                      >
                        <MaterialIcons
                          name="edit"
                          size={16}
                          color={highlight}
                        />
                      </Pressable>
                      <Pressable
                        style={[styles.priorityBadge]}
                        onPress={() => {
                          deleteTask(task.task_id || "");
                        }}
                      >
                        <MaterialIcons name="delete" size={16} color={"red"} />
                      </Pressable>
                    </View>
                  </View>
                  <Text style={[styles.dateText, { color: highlight }]}>
                    Created: {task.task_created_at}
                  </Text>
                </View>

                <View style={styles.taskDetails}>
                  <View style={styles.detailRow}>
                    <MaterialIcons
                      name="location-on"
                      size={16}
                      color={highlight}
                    />
                    <Text style={[styles.detailText, { color: highlight }]}>
                      {task.contract_address}, {task.contract_postcode}
                    </Text>
                  </View>

                  <View style={styles.detailRow}>
                    <MaterialIcons name="person" size={16} color={highlight} />
                    <Text style={[styles.detailText, { color: highlight }]}>
                      Created by: {task.created_by}
                    </Text>
                  </View>

                  <View style={styles.dateContainer}>
                    <View style={styles.detailRow}>
                      <MaterialIcons name="event" size={16} color={highlight} />
                      <Text style={[styles.detailText, { color: highlight }]}>
                        Start: {task.task_start_date}
                      </Text>
                    </View>
                    <View style={styles.detailRow}>
                      <MaterialIcons name="event" size={16} color={highlight} />
                      <Text style={[styles.detailText, { color: highlight }]}>
                        End: {task.task_end_date}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={[styles.detailText, { color: highlight }]}>
                      Required: {`${task.required_number_of_staff}`}
                    </Text>
                    <Text style={[styles.detailText, { color: highlight }]}>
                      Total: {`${task.total_number_of_staff}`}
                    </Text>
                  </View>
                </View>

                {/* Open the assign task modal to display the task details and assign the task to a user or list of users */}
                <TouchableOpacity
                  style={styles.assignButton}
                  onPress={() => openAssignTaskModal(task)}
                >
                  <MaterialIcons
                    name="assignment-ind"
                    size={20}
                    color="white"
                  />
                  <Text style={styles.buttonText}>Assign Task</Text>
                </TouchableOpacity>
              </View>
            )
          )}
        </View>
      </ScrollView>
    </View>
  );
};

export default OpenTaskComponents;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 5,
    backgroundColor: "white",
  },
  header: {
    marginBottom: 5,
  },
  headerTitle: {
    fontSize: Platform.OS === "web" ? 24 : 28,
    fontWeight: "bold",
    fontFamily: "BarlowRegular",
    marginBottom: 5,
  },
  searchWrapper: {
    marginBottom: 16,
  },
  scrollContainer: {
    flex: 1,
  },
  container: {
    flex: 1,
    gap: 16,
  },
  taskCard: {
    borderRadius: 5,
    padding: 16,
    marginVertical: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
    backgroundColor: "white",
    borderWidth: 1,
  },
  taskHeader: {
    marginBottom: 12,
  },
  taskTitleContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  taskTitle: {
    fontSize: Platform.OS === "web" ? 16 : 18,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },
  priorityBadge: {
    padding: 10,
    borderRadius: 20,
    borderWidth: 1,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  highPriority: {
    backgroundColor: "rgba(255, 59, 48, 0.15)",
  },
  mediumPriority: {
    backgroundColor: "rgba(255, 204, 0, 0.15)",
  },
  lowPriority: {
    backgroundColor: "rgba(52, 199, 89, 0.15)",
  },
  priorityText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#666",
  },
  dateText: {
    fontSize: 12,
    opacity: 0.8,
  },
  taskDetails: {
    gap: 12,
  },

  detailRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  detailText: {
    fontSize: 14,
    flex: 1,
  },

  dateContainer: {
    gap: 8,
  },

  assignButton: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#007AFF",
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
    gap: 8,
  },

  buttonText: {
    color: "white",
    fontSize: Platform.OS === "web" ? 14 : 16,
    fontWeight: "600",
    fontFamily: "OswaldVariable",
  },
});
