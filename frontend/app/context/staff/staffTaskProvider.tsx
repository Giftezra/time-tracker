import { useContext, createContext, useState, ReactNode, useMemo } from "react";
import {
  TaskDetailsInterface,
  TaskInterface,
  TaskProviderInterface,
} from "@/app/types/staff/task";
import { BASE_URL } from "@/app/utils/urls";
import { Alert } from "react-native";
import { TaskDetailsProps } from "@/app/types/management/task";
import { useAuth } from "@/app/authentication";

/**
 * Creata  new context for the task.
 */
const TaskContext = createContext<TaskProviderInterface | undefined>(undefined);

/**
 * Create the provider to serve the context.
 */
const StaffTaskProvider = ({ children }: { children: ReactNode }) => {
  // Import the axiosInstance from the AuthProvider
  const { axiosInstance } = useAuth();

  const [isModalVisible, setIsModalVisible] = useState(false);
  const [taskDates, setTaskDates] = useState<any[]>([]);
  const [tasks, setTasks] = useState<TaskInterface[]>([]);
  const [taskDetials, setTaskDetials] = useState<TaskDetailsInterface>({
    id: "",
    task_serial: "",
    site_name: "",
    site_address: "",
    site_postcode: "",
    site_city: "",
    start_time: "",
    end_time: "",
    start_date: "",
    description: "",
    pay: "",
    department: "",
  });

  /**
   * This is the marked dates object that is used to mark the days returned from the server as occupied days where there is an active task.
   * The selected date is marked with a red color to indicate that the user has a task on that day.
   */
  const markedDates = useMemo(() => {
    // Convert taskDates array into an object for react-native-calendars
    return taskDates.reduce((acc: { [key: string]: any }, date) => {
      acc[date] = {
        marked: true, // Show a dot
        dotColor: "blue", // Customize dot color
      };
      return acc;
    }, {});
  }, [taskDates]); // Only depend on taskDates

  /**
   * Manage the state of the selected date
   * @param id
   * @returns
   */
  const handleDayPressEvent = (day: Date) => {
    return {
      date: day,
      tasks: [], // Assuming tasks is an empty array for now
    };
  };

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
  const handleMonthChangeEvent = async (month: any): Promise<any[]> => {
    try {
      const response = await axiosInstance.get("/api/get/task/dates/", {
        params: { year: month.year, month: month.month },
      });

      if (response.data.task_dates) {
        setTaskDates(response.data.task_dates); // Update taskDates state
      } else {
        alert(response.data.message);
        setTaskDates([]); // Clear if no dates
      }

      return response.data.task_dates || [];
    } catch (error) {
      console.log(error);
      setTaskDates([]); // Clear on error
      return [];
    }
  };

  /**
   * This method is used to get all available tasks for the selected day.
   * The method will be triggered when the user clicks on a day in the calendar.
   * The method will then send a request to the server to get all tasks available for the selected day.
   * @param day is the selected day by the user
   */
  const handleDaySelectedEvent = async (day: any) => {
    try {
      // Create the response object to get the available tasks for the selected day
      const response = await axiosInstance.get("/api/get/available/tasks/", {
        params: {
          // Pass the day params
          day: day.day,
        },
      });
      if (response.data.tasks) {
        setTasks(response.data.tasks);
      } else {
        alert(response.data.message);
        setTasks([]);
      }
    } catch (error) {
      console.log(error);
      setTasks([]);
    }
  };

  /**
   * This method is designed to get the task details of the selected task.
   * When the user clicks on the view more button, the method will be triggered to
   * fetch the task details from the server and display the task details to the user.
   * @param id is the task id assigned to the user
   */
  const handleTaskDetails = async (id: string) => {
    console.log("id", id);
    try {
      const response = await axiosInstance.get("/api/get/task/details", {
        params: {
          task_id: id,
        },
      });
      if (response.data.task_details) {
        setTaskDetials(response.data.task_details);
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
    const [startHour, startMinute] = taskDetials.start_time
      .split(":")
      .map(Number);
    const [endHour, endMinute] = taskDetials.end_time.split(":").map(Number);

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
    const currentDateTime = new Date();
    const taskStartDate = new Date(taskDetials.start_date);
    const [startHour, startMinute] = taskDetials.start_time
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
    } catch (error:any) {
      console.log(error);
      // Add better error handling
      alert(error.response?.data?.error || "Failed to apply for task");
    }
  };

  const value: TaskProviderInterface = {
    isModalVisible,
    handleTaskDetails,
    handleModalDisplay,
    markedDates,
    tasks,
    taskDetials,
    calculateTimeDifference,
    calculateTaskStartTime,
    applyForTask,
    handleMonthChangeEvent,
    handleDaySelectedEvent,
  };

  return <TaskContext.Provider value={value}>{children}</TaskContext.Provider>;
};

/**
 * Export the context and the provider.
 * Throw an error when the context is not used within the provider.
 * @returns
 */
export const useTask = () => {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error("useTask must be used within a TaskProvider");
  }
  return context;
};

export default StaffTaskProvider;
