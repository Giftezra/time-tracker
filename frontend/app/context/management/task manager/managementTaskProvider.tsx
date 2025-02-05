import PopupButton from "@/app/component/helper/popupButton";
import { EmployeeType } from "@/app/types/management/employee";
import {
  ActiveTaskContextType,
  ActiveTaskType,
  ContractListType,
  CreateTaskType,
  OpenTaskProps,
} from "@/app/types/management/task";
import { loadToken } from "@/app/utils/loadData";
import { BASE_URL } from "@/app/utils/urls";
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
import { useAuth } from "../authentication";

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

  // Data to be retrieved from the server
  const [employeeList, setEmployeeList] = useState<EmployeeType[]>([]);
  const [contractList, setContractList] = useState<ContractListType[]>([]);
  const [unassignedTask, setUnassignedTask] = useState<OpenTaskProps[]>([]);
  const [activeTasks, setActiveTasks] = useState<ActiveTaskType[]>([]);

  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [isTaskClicked, setIsTaskClicked] = useState<boolean>(false);
  const [employee, setEmployee] = useState<EmployeeType[] | undefined>(
    undefined
  );
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const [modalVisible, setModalVisible] = useState(false);
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

  const [selectedContract, setSelectedContract] =
    useState<ContractListType | null>(null);
  const [employeeSelected, setEmployeeSelected] = useState<EmployeeType | null>(
    null
  );

  /**
   * This effect is used to fetch the data's from the servers.
   * The data retrieved are the active tasks, the contracts and the employees list.
   * The effect is called when the component mounts and is async to allow for the data to be fetched.
   * The effect sets the active tasks, the contracts and the employees list in the state.
   */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const activeTasks = await get_active_tasks();
        const contracts = await getContractList();
        const employees = await get_available_employees();
        const unassignedTasks = await get_unassigned_task();

        // Set the active tasks, contracts, employees, unassigned_task in the state.
        // Check if the data is available before setting the state.
        if (activeTasks && contracts && employees && unassignedTasks) {
          setActiveTasks(activeTasks);
          setContractList(contracts);
          setEmployeeList(employees);
          setUnassignedTask(unassignedTasks);
        }
      } catch (e) {
        console.error("Error fetching data", e);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  /**
   * The method is used to confirm the time selected by the user, and
   * sets the time selected in the state.
   * The method is called only when the time time visible state is set to true.
   */
  const on_confirm_start_time = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      seStartTimeVisible(false);
      setStartTime({ hours, minutes });
      console.log({ hours, minutes });
    },
    [seStartTimeVisible]
  );

  /**
   * Method is used to handle how the task end time is seleced by the user.
   */
  const on_confirm_end_time = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setEndTimeVisible(false);
      setEndTime({ hours, minutes });
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
   * Method signature is designed to get all the contracts from the user given the users token.
   * The server returns a list of only available contracts that has not been assigned to any employee.
   * @returns {Promise<ContractListType>}
   */
  const getContractList = async (): Promise<ContractListType[] | undefined> => {
    try {
      const response = await axiosInstance.get("/api/get/all/contracts/");
      console.log("[getContractList] Raw response:", response);
      const contracts: ContractListType[] = response.data.contract_list;
      console.log("[getContractList] Success:", {
        status: response.status,
        contracts,
      });
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
  const get_available_employees = async (): Promise<EmployeeType[]> => {
    try {
      const response = await axiosInstance.get("/api/get/available/employees/");
      const employees: EmployeeType[] = response.data.employees;
      console.log("[get_available_employees] Success:", {
        status: response.status,
        employees,
      });
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
  const get_active_tasks = async (): Promise<ActiveTaskType[]> => {
    try {
      const response = await axiosInstance.get("/api/get/active/tasks/");
      const tasks: ActiveTaskType[] = response.data.active_tasks;
      console.log("[get_active_tasks] Success:", {
        status: response.status,
        tasks,
      });
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
  const get_unassigned_task = async () => {
    try {
      const response = await axiosInstance.get("/api/get/unassigned/tasks/");
      const unassignedTasks: OpenTaskProps[] = response.data.unassigned_tasks;
      console.log("[get_unassigned_task] Success:", {
        status: response.status,
        unassignedTasks,
      });
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
  const create_shift = async (task: CreateTaskType) => {
    try {
      const response = await axiosInstance.post("/api/create/shift/", task);
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
   */
  const create_task = async (task: CreateTaskType) => {
    try {
      const response = await axiosInstance.post("/api/create/task/", task);
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
   * Method is used to send transit to the message screen given the employee id
   */
  const goto_message_screen = (employee: EmployeeType) => {
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
  const handle_is_task_clicked = (employee: EmployeeType[]) => {
    setIsTaskClicked(!isTaskClicked);
    setEmployee(employee);
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
    goto_message_screen,
    handle_is_task_clicked,
    isModalVisible,
    isTaskClicked,
    employee,
    hideModal,
    render_popup_button: renderPopupButton,
    isLoading,
    get_contract_list: getContractList,
    get_available_employees,
    onConfirmDate: on_confirm_date,
    onConfirmStartTime: on_confirm_start_time,
    onConfirmEndTime: on_confirm_end_time,
    onDateDismiss: on_date_dismiss,
    onStartTimeDismiss: on_start_time_dismiss,
    onEndTimeDismiss: on_end_time_dismiss,
    handle_date_display,
    handle_time_display,
    dateVisible,
    start_time_visible: startTimeVisible,
    endTimeVisible,
    create_shift,
    create_task,
    start_time,
    end_time,
    dates,
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
