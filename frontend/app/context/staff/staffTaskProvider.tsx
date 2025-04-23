import { useContext, createContext, useState, ReactNode, useMemo } from "react";
import TaskProviderInterface, {
  TaskDetailsInterface,
  TaskInterface,
} from "@/app/types/staff/task";
import { useAuth } from "@/app/authentication";
import { MarkedDatesType } from "@/app/types/staff/availability";
const TaskContext = createContext<TaskProviderInterface | undefined>(undefined);

/**
 * Create the provider to serve the context.
 */
const StaffTaskProvider = ({ children }: { children: ReactNode }) => {
  // Import the axiosInstance from the AuthProvider
  const { axiosInstance, setAlertConfig, setIsAlertVisible } = useAuth();
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskDates, setTaskDates] = useState<any[]>([]);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [taskDetails, setTaskDetails] = useState<
    TaskDetailsInterface | undefined
  >(undefined);

  /**
   * Toggle the modal display
   */
  const handleModalDisplay = () => {
    setIsModalVisible(false);
  };

  /**
   * The method is used to handle the events that happens when the user triggers the month change event.
   * When the user moves to the next month, the method will send a server request to get all dates within that month, where the staffs associated company has unassigned tasks.
   * The unassigned tasks will then be marked on the calendar with a different color to indicate that the user can apply for the task.
   * @param month: The month selected by the user
   */
  const handleMonthChangeEvent = async (month: any) => {
    try {
      const response = await axiosInstance.get("/api/get/monthly/tasks/", {
        params: { year: month.year, month: month.month },
      });

      setIsAlertVisible(true);
      setAlertConfig({
        title: "Success",
        message: response.data.message || "Tasks fetched successfully",
        onConfirm() {
          setIsAlertVisible(false);
          setMarkedDates(response.data.marked_dates || {});
        },
        isVisible: true,
        type: "success",
      });
    } catch (error: any) {
      console.log(error);
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: error.response?.data?.error || "Failed to fetch tasks",
        onConfirm() {
          setIsAlertVisible(false);
          setMarkedDates({});
        },
        isVisible: true,
        type: "error",
      });
    }
  };

  /**
   * This method is used to get all available tasks for the selected day.
   * The method will be triggered when the user clicks on a day in the calendar.
   * The method will then send a request to the server to get all tasks available for the selected day.
   * @param day is the selected day by the user
   */
  const handleDaySelectedEvent = async (day: any) => {
    if (isDateDisabled(day.dateString, markedDates)) {
      return; // Ignore press on disabled dates
    }
    
    try {
      const response = await axiosInstance.get("/api/get/day/tasks/", {
        params: {
          day: day.day,
        },
      });

      setIsAlertVisible(true);
      setAlertConfig({
        title: "Success",
        message: response.data.message || "Tasks fetched successfully",
        onConfirm() {
          setIsAlertVisible(false);
          setTasks(response.data.tasks || []);
        },
        isVisible: true,
        type: "success",
      });
    } catch (error: any) {
      console.log(error);
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: error.response?.data?.error || "Failed to fetch tasks",
        onConfirm() {
          setIsAlertVisible(false);
          setTasks([]);
        },
        isVisible: true,
        type: "error",
      });
    }
  };

  /**
   * This method is designed to get the task details of the selected task.
   * When the user clicks on the view more button, the method will be triggered to
   * fetch the task details from the server and display the task details to the user.
   * @param id is the task id assigned to the user
   */
  const getCompleteTaskDetails = async (id: string) => {
    console.log("id", id);
    try {
      const response = await axiosInstance.get("/api/get/task/details", {
        params: {
          task_id: id,
        },
      });
      if (response.data.task_details) {
        setTaskDetails(response.data.task_details);
        setIsModalVisible(true);
      } else {
      }
    } catch (error) {
      console.log(error);
    }
  };

  /**
   * This method is used to calculate the time difference between the start time and the end time of the task assigned to the user.
   * It returns the time difference in hours and minutes.
   */
  const calculateTimeDifference = () => {
    if (!taskDetails?.start_time || !taskDetails?.end_time)
      return "0 hours 0 minutes";

    const [startHour, startMinute] = taskDetails.start_time
      .split(":")
      .map(Number);
    const [endHour, endMinute] = taskDetails.end_time.split(":").map(Number);

    const startTimeInMinutes = startHour * 60 + startMinute;
    const endTimeInMinutes = endHour * 60 + endMinute;

    const timeDifferenceInMinutes = endTimeInMinutes - startTimeInMinutes;
    const hours = Math.floor(timeDifferenceInMinutes / 60);
    const minutes = timeDifferenceInMinutes % 60;

    return `${hours} hours ${minutes} minutes`;
  };

  /***
   * This methood is used to calculate when the shift is bound to start, given the current date and time.
   */
  const calculateTaskStartTime = () => {
    if (!taskDetails?.start_time || !taskDetails?.start_date)
      return "0 hours 0 minutes";
    const currentDateTime = new Date();
    const taskStartDate = new Date(taskDetails?.start_date || "");
    const [startHour, startMinute] = taskDetails?.start_time
      .split(":")
      .map(Number);

    taskStartDate.setHours(startHour, startMinute, 0, 0);

    const differenceInMilliseconds =
      taskStartDate.getTime() - currentDateTime.getTime();

    const differenceInMinutes = Math.floor(
      differenceInMilliseconds / 1000 / 60
    );
    const differenceInHours = Math.floor(differenceInMinutes / 60);
    const remainingMinutes = differenceInMinutes % 60;

    if (differenceInMilliseconds > 0) {
      return `The task starts in ${differenceInHours} hours and ${remainingMinutes} minutes.`;
    } else {
      return `The task has already started or is overdue.`;
    }
  };

  /**
   * This method is used to send a post request to the server to apply for the task with the given id.
   * The method only returns a confirmaion message from the server.
   */
  const applyForTask = async (id: string) => {
    try {
      const response = await axiosInstance.patch(
        `/api/apply/task/?task_id=${id}`
      );
      alert(response.data.message);
    } catch (error: any) {
      console.log(error);
      alert(error.response?.data?.error || "Failed to apply for task");
    }
  };

  const isDateDisabled = (dateString: string, markedDates: any) => {
    return markedDates[dateString]?.marked;
  };

  const value: TaskProviderInterface = {
    isModalVisible,
    getCompleteTaskDetails,
    handleModalDisplay,
    markedDates,
    tasks,
    taskDetails,
    calculateTimeDifference,
    calculateTaskStartTime,
    applyForTask,
    handleMonthChangeEvent,
    handleDaySelectedEvent,
    isDateDisabled,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

/**
 * Export the context and the provider.
 * Throw an error when the context is not used within the provider.
 * @returns
 */
export const useStaffTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export default StaffTaskProvider;
