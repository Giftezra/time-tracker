import {
  OpenTaskContextType,
  OpenTaskProps,
} from "@/app/types/management/task";
import axios from "axios";
import { useContext, createContext, useState, useEffect } from "react";

import { BASE_URL } from "@/app/utils/urls";
import { ca } from "react-native-paper-dates";
import { get } from "react-native/Libraries/TurboModule/TurboModuleRegistry";
import Storage from "expo-storage";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loadToken } from "@/app/utils/loadData";

/* Create a context of the valid type to validate data types */
const OpenTaskContext = createContext<OpenTaskContextType | undefined>(
  undefined
);

const OpenTaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OpenTaskProps | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedTime, setSelectedTime] = useState({ hours: 0, minutes: 0 });

  const [isLoading, setIsLoading] = useState(true);
  const [unassignedTask, setUnassignedTask] = useState<
    OpenTaskProps[] | undefined
  >(undefined);
  const [filteredTask, setFilteredTask] = useState<OpenTaskProps[] | undefined>(
    undefined
  );

  const [search, setSearch] = useState<string>("");

  /**
   * Use the hook to make the api call to the server to retrieve the unassigned tasks.
   * The method is called when the component mounts and simply returns the open tasks for further processing.
   * set the
   * @
   */
  useEffect(() => {
    const fetchUnassignedTask = async () => {
      try {
        setIsLoading(true);
        const tasks = await getUnassignedTask();
        setUnassignedTask(tasks);
        console.log("tasks", tasks);
      } catch (e) {
        console.log(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUnassignedTask();
  }, []);

  /**
   * Method opens the modal and sets the task selected
   */
  const openAssignTaskModal = (task: OpenTaskProps) => {
    setSelectedTask(task);
    setModalVisible(true);
  };

  const closeAssignTaskModal = () => {
    setModalVisible(false);
    alert("Task Assigne");
  };

  /**
   * Method is used to retrieve all the unassigned tasks from the server.
   * Only users with admina and owner roles can access this method and route.
   * The method is called when the component mounts and simply returns the open
   * tasks for further processing.
   */
  const getUnassignedTask = async () => {
    const token = await loadToken();
    try {
      if (!token) {
        throw new Error("Token is not available");
      }

      const response = await fetch(`${BASE_URL}/api/get/unassigned/tasks/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 401) {
          throw new Error("Unauthorized");
        }
      }

      // Retrieve the data
      const data = await response.json();

      if (!data) {
        return [];
      }

      const unassignedTasks: OpenTaskProps[] = data.unassigned_tasks;
    } catch (e) {
      console.log(e);
    }
  };

  const value = {
    getUnassignedTask,
    filteredTask,
    unassignedTask,
  };

  return (
    <OpenTaskContext.Provider value={value}>
      {children}
    </OpenTaskContext.Provider>
  );
};

export const useOpenTask = () => {
  const context = useContext(OpenTaskContext);
  if (context === undefined) {
    throw new Error("useOpenTask must be used within a OpenTaskProvider");
  }
  return context;
};

export default OpenTaskProvider;
