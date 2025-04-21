import PopupButton from "@/app/component/helper/popupButton";
import { EmployeeType } from "@/app/types/management/employee";
import ActiveTaskContextType, {
  ActiveTaskType,
  ContractListType,
  CreateTaskInterface,
  OpenTaskProps,
} from "@/app/types/management/task";
import { router } from "expo-router";
import {
  useContext,
  createContext,
  useState,
  useEffect,
  useCallback,
} from "react";
import { Alert } from "react-native";
import { useAuth } from "@/app/authentication";
import AlertConfig from "@/app/types/management/AlertConfig";
import AlertModal from "@/app/component/helper/AlertModal";
import { en, registerTranslation } from "react-native-paper-dates";
import { Platform } from "react-native";

// Register the English locale
registerTranslation("en", en);

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
  const { axiosInstance, setIsAlertVisible, setAlertConfig } = useAuth();
  // Create a date object for the current date
  const currentDate = new Date();
  const [taskData, setTaskData] = useState<CreateTaskInterface | undefined>(
    undefined
  );
  const [taskDataError, setTaskDataError] = useState<
    CreateTaskInterface | undefined
  >(undefined);

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
  const [assignTaskModalVisible, setAssignTaskModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState<OpenTaskProps | null>(null);
  const [startTime, setStartTime] = useState({ hours: 0, minutes: 0 });
  const [endTime, setEndTime] = useState({ hours: 0, minutes: 0 });
  const [startTimeVisible, seStartTimeVisible] = useState(false);
  const [endTimeVisible, setEndTimeVisible] = useState(false);
  // Add new state for start and end dates
  const [startDateVisible, setStartDateVisible] = useState(false);
  const [endDateVisible, setEndDateVisible] = useState(false);
  const [startDates, setStartDates] = useState<Date | null>(null);
  const [endDates, setEndDates] = useState<Date | null>(null);

  /**
   * Method opens the modal and sets the task selected
   */
  const openAssignTaskModal = (task: OpenTaskProps) => {
    setSelectedTask(task);
    setAssignTaskModalVisible(true);
  };

  // Close the modal and display an alert modal to the user
  // Make them aware that the task has been assigned to the employee
  const closeAssignTaskModal = () => {
    setAssignTaskModalVisible(false);
    setAlertConfig({
      title: "Task Assigned",
      message: "Task has been assigned to the employee",
      onConfirm() {
        setAssignTaskModalVisible(false);
      },
      isVisible: true,
    });
    setIsAlertVisible(true);
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
    try {
      const response = await axiosInstance.get("/api/get/available/employees/");
      const employees: EmployeeType[] = response.data.available_employees;
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
   * This method is used to terminate a task when the user clicks the terminate button.
   * @param task ActiveTaskType is the object that contains the task details to be terminated.
   * The details to be sent to the server would be the shift id and the employee id.
   */
  const terminateTask = async (task: ActiveTaskType | undefined) => {
    try {
      if (!task) {
        setAlertConfig({
          title: "Error",
          message: "Task is undefined",
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
        setIsAlertVisible(true);
        return;
      }
      const response = await axiosInstance.patch("/api/terminate/shift/", {
        shift_id: task.shift_id,
        employee_id: task.employee_id,
      });
      if (response.status === 200) {
        setAlertConfig({
          title: "Task Terminated",
          message: response.data.message,
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
        setIsAlertVisible(true);
        const updatedActiveTasks = await getActiveTasks();
        setActiveTasks(updatedActiveTasks);
      }
    } catch (error: any) {
      setAlertConfig({
        title: "Error",
        message: error.response?.data.error,
        onConfirm() {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
      setIsAlertVisible(true);
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
      if (response.status === 200) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Task Updated Status",
          message: response.data.message,
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
        // After successful update, refetch the open tasks
        const updatedOpenTasks = await getOpenTasks();
        setUnassignedTask(updatedOpenTasks);
      }
    } catch (error: any) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: error.response?.data.error,
        onConfirm() {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
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
      pathname: "/management/(drawer)/messages/ManagementMessages",
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

  /**
   * Create a new task or shift based on the employee selection.
   * if the selected employee is not null, then create a shift otherwise, create a task.
   * Check the fields for accuracy and display an alert for incorrect fields and fields that are missing.
   * If all fields are correct, then create a the task or shift and display a success alert.
   */
  const formatDates = (dates: Date) => {
    return dates.toISOString().split("T")[0];
  };

  const formatTimes = (times: { hours: number; minutes: number }) => {
    return `${times.hours.toString().padStart(2, "0")}:${times.minutes
      .toString()
      .padStart(2, "0")}`;
  };

  const handleTaskCreation = async () => {
    if (!taskData) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: "Task data is undefined",
        onConfirm() {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
      return;
    }

    try {
      // Check if the amount is greater than 0 or display an error if it is not
      if (!taskData.amount || taskData.amount <= 0) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Error",
          message: "Amount must be greater than 0",
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
        return;
      }

      // Check if the dates exist in taskData
      if (!taskData.start_date || !taskData.end_date) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Error",
          message: "Please select start and end dates",
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
        return;
      }

      // Check if all dates are in the future
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      // Check if start_date or end_date is in the past
      const startDate = new Date(taskData.start_date);
      const endDate = new Date(taskData.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (
        taskData.start_date &&
        taskData.end_date &&
        (startDate < now || endDate < now)
      ) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Invalid Dates",
          message: "Task dates cannot be in the past",
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
        return;
      }

      // Check if the start and end time are not null or display an error if they are
      if (!taskData.start_time || !taskData.end_time) {
        setTaskDataError({
          ...taskData,
          start_time: { hours: 0, minutes: 0 },
          end_time: { hours: 0, minutes: 0 },
        });
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Error",
          message: "Start and end time are required",
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
        return;
      }

      // Validate that end time is after start time
      const startMinutes =
        taskData.start_time.hours * 60 + taskData.start_time.minutes;
      const endMinutes =
        taskData.end_time.hours * 60 + taskData.end_time.minutes;

      // Check if the start date and end date are the same date then ensure that the start time is before the end time
      const isSameDate =
        taskData.start_date.toISOString().split("T")[0] ===
        taskData.end_date.toISOString().split("T")[0];
      if (isSameDate) {
        const startMinutes = taskData.start_time.minutes;
        const endMinutes = taskData.end_time.minutes;
        const endHours = taskData.end_time.hours;
        const startHours = taskData.start_time.hours;
        if (
          startHours > endHours ||
          (startHours === endHours && startMinutes >= endMinutes)
        ) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Invalid Times",
            message: "Start time must be before end time",
            onConfirm() {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
          return;
        }
      }

      const formattedData = {
        ...taskData,
        start_date: formatDates(taskData.start_date),
        end_date: formatDates(taskData.end_date),
        start_time: formatTimes(taskData.start_time),
        end_time: formatTimes(taskData.end_time),
      };
      const response = await axiosInstance.post("/api/create/task/", {
        data: formattedData,
      });

      console.log("Response received:", response.data); // Add logging

      if (response.status === 201) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Success",
          message: response.data.message,
          onConfirm() {
            setIsAlertVisible(false);
            setTaskData(undefined);
          },
          isVisible: true,
        });

        // Refresh data after creation
        const unassignedTasks = await getOpenTasks();
        setUnassignedTask(unassignedTasks);
      }
    } catch (error: any) {
      console.error("Error creating task/shift:", error); // Add error logging
      const message =
        error.response?.data?.error ||
        "An error occurred while creating the task/shift";
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: message,
        onConfirm() {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
    }
  };

  /**
   * Create a new shift on the server based on the data passed in the taskData state.
   * Check all inputs are validated before creating the shift.
   * Display an alert for any errors in the inputs.
   * If all inputs are valid, create the shift and display a success alert.
   * Refresh the data after creation.
   */
  const handleShiftCreation = async () => {
    if (!taskData) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: "Task data is undefined",
        onConfirm() {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
      return;
    }

    try {
      // Check if the amount is greater than 0 or display an error if it is not
      if (!taskData.amount || taskData.amount <= 0) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Error",
          message: "Amount must be greater than 0",
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
        return;
      }

      // Check if the dates exist in taskData
      if (!taskData.start_date || !taskData.end_date) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Error",
          message: "Please select start and end dates",
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
        return;
      }

      // Check if all dates are in the future
      const now = new Date();
      now.setHours(0, 0, 0, 0);

      // Check if start_date or end_date is in the past
      const startDate = new Date(taskData.start_date);
      const endDate = new Date(taskData.end_date);
      startDate.setHours(0, 0, 0, 0);
      endDate.setHours(0, 0, 0, 0);

      if (
        taskData.start_date &&
        taskData.end_date &&
        (startDate < now || endDate < now)
      ) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Invalid Dates",
          message: "Task dates cannot be in the past",
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
        return;
      }

      // Check if the start date and end date are the same date then ensure that the start time is before the end time
      const isSameDate =
        taskData.start_date.toISOString().split("T")[0] ===
        taskData.end_date.toISOString().split("T")[0];
      if (isSameDate) {
        const startMinutes = taskData.start_time.minutes;
        const endMinutes = taskData.end_time.minutes;
        const endHours = taskData.end_time.hours;
        const startHours = taskData.start_time.hours;
        if (
          startHours > endHours ||
          (startHours === endHours && startMinutes >= endMinutes)
        ) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Invalid Times",
            message: "Start time must be before end time",
            onConfirm() {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
          return;
        }
      }

      // Validate that end time is after start time
      const startMinutes =
        taskData.start_time.hours * 60 + taskData.start_time.minutes;
      const endMinutes =
        taskData.end_time.hours * 60 + taskData.end_time.minutes;

      if (taskData.start_date < taskData.end_date) {
        if (endMinutes <= startMinutes) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Invalid Times",
            message: "End time must be after start time",
            onConfirm() {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
          return;
        }
      }

      const formattedData = {
        ...taskData,
        start_date: formatDates(taskData.start_date),
        end_date: formatDates(taskData.end_date),
        start_time: formatTimes(taskData.start_time),
        end_time: formatTimes(taskData.end_time),
        employee_id: taskData.employee_id,
      };
      const response = await axiosInstance.post("/api/create/shift/", {
        data: formattedData,
      });
      if (response.status === 201) {
        // Format the success and failure messages
        const successMessage =
          response.data.successful_assignments?.length > 0
            ? `Successfully assigned employees: ${response.data.successful_assignments.join(
                ", "
              )}`
            : "";

        const failureMessage =
          response.data.failed_assignments?.length > 0
            ? `Failed assignments:\n${response.data.failed_assignments
                .map(
                  (failure: { employee_id: string; reason: string }) =>
                    `- Employee ${failure.employee_id}: ${failure.reason}`
                )
                .join("\n")}`
            : "";

        const message = [response.data.message, successMessage, failureMessage]
          .filter(Boolean)
          .join("\n\n");

        setIsAlertVisible(true);
        setAlertConfig({
          title: "Shift Creation Status",
          message: message,
          onConfirm() {
            setIsAlertVisible(false);
            setTaskData(undefined);
          },
          isVisible: true,
        });

        // Refresh data after creation
        const unassignedTasks = await getOpenTasks();
        setUnassignedTask(unassignedTasks);
      }
    } catch (error: any) {
      console.error("Error creating task/shift:", error); // Add error logging
      const message =
        error.response?.data?.error ||
        "An error occurred while creating the task/shift";
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: message,
        onConfirm() {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
    }
  };

  const deleteTask = async (taskId: string) => {
    if (!taskId) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: "Task ID is undefined",
        onConfirm() {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
      return;
    }

    // Show confirmation dialog first
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Delete Task",
      message: "Are you sure you want to delete this task?",
      onConfirm: async () => {
        try {
          setIsLoading(true); // Add loading state
          const response = await axiosInstance.delete(`/api/delete/task/`, {
            data: {
              task_id: taskId,
            },
          });

          if (response.status === 200) {
            // Optimistically update the UI by filtering out the deleted task
            setUnassignedTask((prev) =>
              prev.filter((task) => task.task_id !== taskId)
            );

            // Then fetch the latest data from server
            const unassignedTasks = await getOpenTasks();
            setUnassignedTask(unassignedTasks);

            setIsAlertVisible(true);
            setAlertConfig({
              title: "Success",
              message: response.data.message,
              onConfirm() {
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
          }
        } catch (error: any) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Error",
            message:
              error.response?.data?.error ||
              "An error occurred while deleting the task",
            onConfirm() {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
        } finally {
          setIsLoading(false); // Clear loading state
        }
      },
      onClose: () => {
        setIsAlertVisible(false);
      },
      isVisible: true,
    });
  };
  

  // Update the handlers to match DatePickerModal's expected types
  const onConfirmStartDate = useCallback((params: { date?: Date }) => {
    if (params.date) {
      setStartDates(params.date);
      collectNewTaskData("start_date", params.date);
    }
    setStartDateVisible(false);
  }, []);

  const onConfirmEndDate = useCallback((params: { date?: Date }) => {
    if (params.date) {
      setEndDates(params.date);
      collectNewTaskData("end_date", params.date);
    }
    setEndDateVisible(false);
  }, []);

  const onStartDateDismiss = useCallback(() => {
    setStartDateVisible(false);
  }, []);

  const onEndDateDismiss = useCallback(() => {
    setEndDateVisible(false);
  }, []);

  const handleStartDateDisplay = () => {
    setStartDateVisible(!startDateVisible);
  };

  const handleEndDateDisplay = () => {
    setEndDateVisible(!endDateVisible);
  };
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

  const on_start_time_dismiss = useCallback(() => {
    seStartTimeVisible(false);
  }, [seStartTimeVisible]);

  const on_end_time_dismiss = useCallback(() => {
    setEndTimeVisible(false);
  }, [setEndTimeVisible]);

  const handleStartTimeDisplay = () => {
    seStartTimeVisible(!startTimeVisible);
  };

  const handleEndTimeDisplay = () => {
    setEndTimeVisible(!endTimeVisible);
  };

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
    onConfirmStartTime,
    onConfirmEndTime,
    onStartTimeDismiss: on_start_time_dismiss,
    onEndTimeDismiss: on_end_time_dismiss,
    handleStartTimeDisplay,
    handleEndTimeDisplay,
    startTimeVisible,
    endTimeVisible,
    startTime,
    endTime,
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
    handleTaskCreation,
    startDateVisible,
    endDateVisible,
    startDates,
    endDates,
    onConfirmStartDate,
    onConfirmEndDate,
    onStartDateDismiss,
    onEndDateDismiss,
    handleStartDateDisplay,
    handleEndDateDisplay,
    handleShiftCreation,
    deleteTask,
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
