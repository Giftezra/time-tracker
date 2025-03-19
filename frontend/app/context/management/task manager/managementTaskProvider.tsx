import PopupButton from "@/app/component/helper/popupButton";
import { EmployeeType } from "@/app/types/management/employee";
import {
  ActiveTaskContextType,
  ActiveTaskType,
  ContractListType,
  CreateTaskInterface,
  OpenTaskProps,
} from "@/app/types/management/task";
import axios from "axios";
import { router } from "expo-router";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { FeTurbulence } from "react-native-svg";
import { useAuth } from "../../authentication";
import { Alert } from "react-native";

/**
 * Create a context for the management task context.
 * The context uses the ActiveTaskContextType as the type for the context.
 * The context is used to manage the state of the management task context.
 */
const ManagementTaskContext = createContext<ActiveTaskContextType | undefined>(
  undefined
);

/**
 * This context provider is used to manage the management task context which will be used across any of the task management components.
 * The context provider contains all the methods that are required to manage the task context in its entirety.
 * The provider will be used to wrap the main task management component to provide the context to the component.
 * @param param0
 * @returns
 */
const ManagementTaskProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { axiosInstance } = useAuth();
  // Create a date object for the current date
  const currentDate = new Date();

  // MAnage the state for the data collected which will be used to create a new task
  const [taskData, setTaskData] = useState<CreateTaskInterface | undefined>(
    undefined
  );

  // Data to be retrieved from the server
  const [employeeList, setEmployeeList] = useState<EmployeeType[]>([]);
  const [contractList, setContractList] = useState<ContractListType[]>([]);
  const [unassignedTask, setUnassignedTask] = useState<OpenTaskProps[]>([]);
  const [editTask, setEditTask] = useState<OpenTaskProps | null>(null);
  const [activeTasks, setActiveTasks] = useState<ActiveTaskType[]>([]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isEditTaskModalVisible, setIsEditTaskModalVisible] =
    useState<boolean>(false);
  const [isTaskClicked, setIsTaskClicked] = useState<boolean>(false);
  const [activeTaskClicked, setActiveTaskClicked] = useState<
    ActiveTaskType | undefined
  >();
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState(false);
  const [assignTaskModalVisible, setAssignTaskModalVisible] = useState(false);

  const [selectedTask, setSelectedTask] = useState<OpenTaskProps | null>(null);
  const [selectedDates, setSelectedDates] = useState<Date[]>([]);
  const [selectedStartTime, setSelectedStartTime] = useState({
    hours: 0,
    minutes: 0,
  });
  const [selectedEndTime, setSelectedEndTime] = useState({
    hours: 0,
    minutes: 0,
  });

  const [dates, setDates] = useState<Date[]>([]);
  const [start_time, setStartTime] = useState({ hours: 0, minutes: 0 });
  const [end_time, setEndTime] = useState({ hours: 0, minutes: 0 });
  const [dateVisible, setDateVisible] = useState(false);
  const [startTimeVisible, seStartTimeVisible] = useState(false);
  const [endTimeVisible, setEndTimeVisible] = useState(false);

  // The tasks entered by the user in the edit task component
  const [taskDetails, setTaskDetails] = useState({
    contract_name: editTask?.contract_name || "",
    contract_address: editTask?.contract_address || "",
    contract_postcode: editTask?.contract_postcode || "",
    task_description: editTask?.task_description || "",
    task_serial: editTask?.task_serial || "",
    task_start_date: editTask?.task_start_date || "",
    task_start_time: editTask?.task_start_time || "",
    task_end_date: editTask?.task_end_date || "",
    task_end_time: editTask?.task_end_time || "",
  });

  const [selectedContract, setSelectedContract] =
    useState<ContractListType | null>(null);
  const [employeeSelected, setEmployeeSelected] = useState<EmployeeType | null>(
    null
  );

  /**
   * Method opens the modal and sets the task selected
   */
  const openAssignTaskModal = (task: OpenTaskProps) => {
    setSelectedTask(task);
    setAssignTaskModalVisible(true);
  };

  const closeAssignTaskModal = () => {
    setAssignTaskModalVisible(false);
    Alert.alert("Task Assigned", "Task has been assigned to the employee", [
      {
        text: "OK",
        onPress: () => {
          setAssignTaskModalVisible(false);
        },
      },
    ]);
  };
  /**
   * This hook is used to fetch the users dat from the server when the page loads.
   * the data is fetches are
   * 1. The list of contracts
   * 2. The list of employees
   * 3. The list of unassigned tasks
   * 4. The list of active tasks
   */
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const contracts = await getContractList();
        const unassignedTasks = await getOpenTasks();
        const activeTask = await getActiveTasks();
        const availableEmployees = await getAvailableEmployees();

        // Set the contracts and employees in the state
        setContractList(contracts);
        setUnassignedTask(unassignedTasks);
        setActiveTasks(activeTask);
        setEmployeeList(availableEmployees);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  /**
   * This method is used to implement the @interface CreateTaskInterface
   * the interface contains the data type of the task to be created.
   * it uses a key value pair to set the task details.
   */
  const collectNewTaskData = (key: keyof CreateTaskInterface, value: any) => {
    setTaskData(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        } as CreateTaskInterface)
    );
  };

  /**
   * Method signature is designed to get all the contracts from the user given the users token.
   * The server returns a list of only available contracts that has not been assigned to any employee.
   * @returns {Promise<ContractListType>}
   */
  const getContractList = async (): Promise<ContractListType[]> => {
    try {
      const response = await axiosInstance.get("/api/get/all/contracts/");
      const contracts: ContractListType[] = response.data.contract_list;
      return contracts;
    } catch (error: any) {
      console.error("[getContractList] Error:", {
        status: error.response?.status,
        message: error.message,
        details: error.response?.data,
      });
      throw error;
    }
  };

  /**
   * Method signature is designed to get all the employees from the user given the users token.
   * The server returns a list of all employees that are available to be assigned to a task.
   * Users are filtered by the request users company associations.
   * @returns {Promise<EmployeeType[]>}
   */
  const getAvailableEmployees = async (): Promise<EmployeeType[]> => {
    // Format date as YYYY-MM-DD
    const formattedDate = currentDate.toISOString().split("T")[0];
    try {
      const response = await axiosInstance.get(
        "/api/get/available/employees/",
        {
          params: {
            current_date: formattedDate,
          },
        }
      );
      const employees: EmployeeType[] = response.data.employees;
      return employees;
    } catch (error: any) {
      console.error("[get_available_employees] Error:", {
        status: error.response?.status,
        message: error.message,
        details: error.response?.data,
      });
      throw error;
    }
  };

  /**
   * Method is designed to return all active and ongoing tasks from the server.
   * @returns an array of active tasks
   */
  const getActiveTasks = async (): Promise<ActiveTaskType[]> => {
    try {
      const response = await axiosInstance.get("/api/get/active/tasks/");
      const tasks: ActiveTaskType[] = response.data.active_shifts;
      return tasks;
    } catch (error: any) {
      console.error("[get_active_tasks] Error:", {
        status: error.response?.status,
        message: error.message,
        details: error.response?.data,
      });
      throw error;
    }
  };

  /**
   * Method is used to retrieve all the unassigned tasks from the server.
   * Only users with admin and owner roles can access this method and route.
   */
  const getOpenTasks = async () => {
    try {
      // Create the response using the axiosinstance which already has the token and the base url
      const response = await axiosInstance.get("/api/get/open/tasks/");
      // Get the response data from the response object
      // return the unassigned tasks
      const unassignedTasks: OpenTaskProps[] = response.data.unassigned_tasks;
      return unassignedTasks;
    } catch (error: any) {
      console.error("[get_unassigned_task] Error:", {
        status: error.response?.status,
        message: error.message,
        details: error.response?.data,
      });
      throw error;
    }
  };

  /**
   * The method is used to create a task when called.
   * @param task is the object that contains the task details to be created.
   */
  const create_shift = async (task: CreateTaskInterface) => {
    try {
      const response = await axiosInstance.post("/api/create/shift/", {
        data: task,
      });
      console.log("[create_shift] Success:", {
        status: response.status,
        data: response.data,
      });
      return response.data;
    } catch (error: any) {
      console.error("[create_shift] Error:", {
        status: error.response?.status,
        message: error.message,
        details: error.response?.data,
      });
      throw error;
    }
  };

  /**
   * This method is used to create a task when the user does not provide an employee.
   * @param task is the object that contains the task details to be created.
   */
  const create_task = async (task: CreateTaskInterface) => {
    try {
      const response = await axiosInstance.post("/api/create/task/", {
        data: task,
      });
      console.log("[create_task] Success:", {
        status: response.status,
        data: response.data,
      });
      return response.data;
    } catch (error: any) {
      console.error("[create_task] Error:", {
        status: error.response?.status,
        message: error.message,
        details: error.response?.data,
      });
      throw error;
    }
  };

  /**
   * This method is used to terminate a task when the user clicks the terminate button.
   * @param task ActiveTaskType is the object that contains the task details to be terminated.
   * The details to be sent to the server would be the shift id and the employee id.
   */
  const terminateTask = async (task: ActiveTaskType | undefined) => {
    try {
      if (!task) {
        throw new Error("Task is undefined");
      }
      const response = await axiosInstance.post("/api/terminate/task/", {
        shift_id: task.shift_id,
        employee_id: task.employee_id,
      });
      console.log("[terminate_task] Success:", {
        status: response.status,
        data: response.data,
      });
      return response.data;
    } catch (error: any) {
      console.error("[terminate_task] Error:", {
        status: error.response?.status,
        message: error.message,
        details: error.response?.data,
      });
      return error;
    }
  };

  /**
   * Update the task details with the new details and refetch open tasks
   * @param task is the object that contains the task details to be updated.
   */
  const updateTask = async (task: OpenTaskProps) => {
    try {
      const response = await axiosInstance.patch("/api/update/task/", {
        data: task,
      });

      // After successful update, refetch the open tasks
      const updatedOpenTasks = await getOpenTasks();
      setUnassignedTask(updatedOpenTasks);

      console.log("[update_task] Success:", {
        status: response.status,
        data: response.data,
      });
      return response.data.message;
    } catch (error: any) {
      return error;
    }
  };

  /**
   * Method is used to send transit to the message screen given the employee id
   */
  const gotoMessageScreen = (task: ActiveTaskType) => {
    if (!task) {
      return;
    }
    router.push({
      pathname: "/management/(drawer)/messages/main",
      params: {
        employee_id: task.employee_id,
        employee_name: task.employee_name,
      },
    });
    setIsModalVisible(false);
  };

  /**
   * The method is used to confirm the time selected by the user, and
   * sets the time selected in the state.
   * The method is called only when the time time visible state is set to true.
   */
  const onConfirmStartTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      seStartTimeVisible(false);
      setStartTime({ hours, minutes });
      collectNewTaskData("start_time", { hours, minutes });
      console.log({ hours, minutes });
    },
    [seStartTimeVisible]
  );

  /**
   * Method is used to handle how the task end time is seleced by the user.
   */
  const onConfirmEndTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setEndTimeVisible(false);
      setEndTime({ hours, minutes });
      collectNewTaskData("end_time", { hours, minutes });
      console.log({ hours, minutes });
    },
    [setEndTimeVisible]
  );

  /**
   * Method to confirm the date selected.
   * @param params is used to get the dates selected as an array
   */
  const on_confirm_date = useCallback((params: any) => {
    setDates(params.dates);
    setDateVisible(false);
    console.log("[on-change-multi]", params);
  }, []);

  const on_date_dismiss = useCallback(() => {
    setDateVisible(false);
  }, [setDateVisible]);

  const on_start_time_dismiss = useCallback(() => {
    seStartTimeVisible(false);
  }, [seStartTimeVisible]);

  const on_end_time_dismiss = useCallback(() => {
    setEndTimeVisible(false);
  }, [setEndTimeVisible]);

  const handle_date_display = () => {
    setDateVisible(!dateVisible);
  };

  const handle_time_display = () => {
    seStartTimeVisible(!startTimeVisible);
  };

  /**
   * Method is used to handle the task clicked event.
   * the method sets the task clicked state to true and sets the employee details
   * selected in the state
   * @param employee is the object that contains the employee details
   *
   */
  const handleIsTaskClicked = (task: ActiveTaskType) => {
    setIsTaskClicked(!isTaskClicked);
    setActiveTaskClicked(task);
    setIsModalVisible(true);
  };

  const renderPopupButton = (task_id: string, onPress: () => void) => {
    return <PopupButton text="terminate" onPress={onPress} />;
  };

  const hideModal = () => setIsModalVisible(false);

  const value: ActiveTaskContextType = {
    employeeList,
    contractList,
    unassignedTask,
    activeTasks,
    gotoMessageScreen,
    handleIsTaskClicked,
    isModalVisible,
    isTaskClicked,
    activeTaskClicked,
    hideModal,
    render_popup_button: renderPopupButton,
    isLoading,
    getContractList,
    getAvailableEmployees,
    onConfirmDate: on_confirm_date,
    onConfirmStartTime,
    onConfirmEndTime,
    onDateDismiss: on_date_dismiss,
    onStartTimeDismiss: on_start_time_dismiss,
    onEndTimeDismiss: on_end_time_dismiss,
    handle_date_display,
    handle_time_display,
    dateVisible,
    start_time_visible: startTimeVisible,
    endTimeVisible,
    createShift: create_shift,
    create_task,
    start_time,
    end_time,
    dates,
    collectNewTaskData,
    taskData,
    terminateTask,
    assignTaskModalVisible,
    openAssignTaskModal,
    selectedTask,
    closeAssignTaskModal,
    setAssignTaskModalVisible,
    editTask,
    isEditTaskModalVisible,
    setIsEditTaskModalVisible,
    setEditTask,
    updateTask,
  };

  return (
    <ManagementTaskContext.Provider value={value}>
      {children}
    </ManagementTaskContext.Provider>
  );
};

export const useManagementTask = () => {
  const context = useContext(ManagementTaskContext);
  if (context === undefined) {
    throw new Error("useActiveTask must be used within an ActiveTaskProvider");
  }
  return context;
};

export default ManagementTaskProvider;
