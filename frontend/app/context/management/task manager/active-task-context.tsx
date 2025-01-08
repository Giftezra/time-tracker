import PopupButton from "@/app/component/helper/popupButton";
import { EmployeeType } from "@/app/types/management/employee";
import {
  ActiveTaskContextType,
  ActiveTaskType,
} from "@/app/types/management/task";
import { loadToken } from "@/app/utils/loadData";
import { BASE_URL } from "@/app/utils/urls";
import axios from "axios";
import { router } from "expo-router";
import Storage from "expo-storage";
import { useContext, createContext, useState, useEffect } from "react";

const ActiveTaskContext = createContext<ActiveTaskContextType | undefined>(
  undefined
);

const ActiveTaskProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isTaskClicked, setIsTaskClicked] = useState<boolean>(false);
  const [employee, setEmployee] = useState<EmployeeType[] | undefined>(
    undefined
  );
  const [activeTasks, setActiveTasks] = useState<ActiveTaskType[] | undefined>(
    []
  );
  const [filteredTasks, setFilteredTasks] = useState<
    ActiveTaskType[] | undefined
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchActiveTasks = async () => {
      try {
        setIsLoading(true);
        const tasks = await getActiveTasks();
        console.log("active task", tasks);
        setActiveTasks(tasks);
      } catch (e: any) {
        console.error(e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchActiveTasks();
  }, []);

  /**
   * Method is designed to retrive a list of active tasks and the employees associated with the task.
   * Only tasks with ongoing status are returned.
   * @returns an array of active tasks
   */
  const getActiveTasks = async () => {
    const token = await loadToken();

    if (!token) {
      throw new Error("Token not found");
    }

    try {
      const response = await axios.get(`${BASE_URL}/api/get/active/shifts/`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (response.status === 200) {
        const data: ActiveTaskType[] = response.data.active_shifts;
        console.log("active shift data", data);
        return data;
      } else {
        throw new Error("Error fetching active tasks");
      }
    } catch (e: any) {
      throw new Error(e);
    }
  };

  /**
   * Method is used to send transit to the message screen given the employee id
   */
  const gotoMessageScreen = (employee: EmployeeType) => {
    if (!employee) {
      return;
    }
    router.push({
      pathname: "/management/(drawer)/messages/main",
      params: {
        employee_id: employee.employee_id,
        employee_name: employee.employee_name,
      },
    });
    setIsModalVisible(false);
  };

  /**
   * Method is used to handle the task clicked event.
   * the method sets the task clicked state to true and sets the employee details
   * selected in the state
   * @param employee is the object that contains the employee details
   *
   */
  const handleIsTaskClicked = (employee: EmployeeType[]) => {
    setIsTaskClicked(!isTaskClicked);
    setEmployee(employee);
    setIsModalVisible(true);
  };

  const renderPopupButton = (task_id: string, onPress: () => void) => {
    return <PopupButton text="terminate" onPress={onPress} />;
  };

  const hideModal = () => setIsModalVisible(false);

  const value = {
    gotoMessageScreen,
    handleIsTaskClicked,
    isModalVisible,
    isTaskClicked,
    employee,
    hideModal,
    renderPopupButton,
    activeTasks,
    isLoading,
  };

  return (
    <ActiveTaskContext.Provider value={value}>
      {children}
    </ActiveTaskContext.Provider>
  );
};

export const useActiveTask = () => {
  const context = useContext(ActiveTaskContext);
  if (context === undefined) {
    throw new Error("useActiveTask must be used within an ActiveTaskProvider");
  }
  return context;
};

export default ActiveTaskProvider;
