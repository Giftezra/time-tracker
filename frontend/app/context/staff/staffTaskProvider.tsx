import { useContext, createContext, useState, ReactNode, useMemo } from "react";
import { TaskDetailsType, TaskProps, TaskProviderProps } from "@/app/types/staff/task";
import { loadToken } from "@/app/utils/loadData";
import { BASE_URL } from "@/app/utils/urls";
import { Alert } from "react-native";
import {TaskDetailsProps} from "@/app/types/management/task";

/**
 * Creata  new context for the task.
 */
const TaskContext = createContext<TaskProviderProps | undefined>(undefined);

/**
 * Create the provider to serve the context.
 */
const StaffTaskProvider = ({ children }: { children: ReactNode }) => {
  const tasks: TaskProps[] = [
    {
      task_id: "1",
      site_name: "site 1",
      site_address: "address 1",
      start_time: "10:00",
      end_time: "11:00",
      start_date: "2025-01-09",
    },
    {
      task_id: "2",
      site_name: "site 2",
      site_address: "address 2",
      start_time: "11:00",
      end_time: "12:00",
      start_date: "2025-01-10",
    },
    {
      task_id: "3",
      site_name: "site 3",
      site_address: "address 3",
      start_time: "12:00",
      end_time: "13:00",
      start_date: "2025-01-13",
    },
  ];

  const taskDetials: TaskDetailsType = {
    id: "1",
    site_serial: "sd-123",
    site_name: "sky dunfermline",
    site_address: "31 high street",
    site_postcode: "KY12 7DL",
    site_city: "Dunfermline",
    start_time: "10:00",
    end_time: "18:00",
    information: "The task is to clean the site doors and windows, Please ensure to clean the windows and doors properly",
    pay: "20",
    department: "cleaning",
    start_date: "2025-01-09",
  };

  const [isModalVisible, setIsModalVisible] = useState(false);

  const initDate = "2024-01-01";
  const [selected, setSelected] = useState(initDate);

  const setSelectedDate = (date: string) => {
    setSelected(date);
    console.log(date);
  };

  /**
   * This is the marked dates object that is used to mark the days returned from the server as occupied days where there is an active task.
   * The selected date is marked with a red color to indicate that the user has a task on that day.
   */
  const markedDates = useMemo(() => {
    return {
      [selected]: {
        selected: true,
        selectedColor: "red",
      },
    };
  }, [selected]);

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
   *
   * @param id
   * @returns
   */
  const handleTaskDetails = (id: string | null) => {
    if (!id) {
      return;
    }
    setIsModalVisible(true);
    console.log("isModalVisible");
    console.log(id);
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
    const token = loadToken();
    const response = await fetch(`${BASE_URL}/api/apply/task`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ task_id: id }),
    });

    if (!response.ok) {
      throw new Error(`Error: ${response.status}, ${response.statusText}`);
    }

    const data = await response.json();
    Alert.alert(data.message);
    return data;
  }


  // /**
  //  * This method is designed to get the task details of the selected task.
  //  * When the user clicks on the view more button, the method will be triggered to
  //  * fetch the task details from the server and display the task details to the user.
  //  * @param id is the task id assigned to the user
  //  */
  // const handleTaskDetails = async (id: string | null) => {
  //   const token = loadToken();
  //   if (!id) {
  //     // Check if the id is not null
  //     return;
  //   }
  //   const response = await fetch(`BASE_URL/api/task/details`, {
  //     method: "GET",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `Bearer ${token}`,
  //     },
  //     body: JSON.stringify({ task_id: id }),
  //   });

  //   // Check if the response is not ok and throw an error with the status and status text
  //   if (!response.ok) {
  //     throw new Error(`Error: ${response.status}, ${response.statusText}`);
  //   }

  //   const data: TaskDetailsType = await response.json();
  //   // Complete this method to display the task details to the user
  // setIsModalVisible(true);
  // };

  /**
   * Toggle the modal display
   */
  const handleModalDisplay = () => {
    setIsModalVisible(false);
  };

  /**
   * This method is used to start the task assigned to the user
   * @param id is the task id assigned to the user
   * @returns void
   */
  const handleStartTask = async (id: string) => {
    const token = loadToken();
    const response = await fetch(`BASE_URL/api/task/start`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shift_id: id }),
    });

    // Throw an error if the response is not ok with the status and status text
    if (!response.ok) {
      throw new Error(`Error: ${response.status}, ${response.statusText}`);
    }

    // Return the response message if the response is ok
    /**
     * This method will be modified so that when the response is ok, the task time will be started
     */
    const data = await response.json();
    Alert.alert(data.message); // Alert the user with the response message
    return data;
  };

  /**
   * The method is used to cancel the task assigned to the user by sending the shift id to the server.
   * The method returns the data from the server for further processing
   * @param id is the shift id assigned to the user
   */
  const handleEndTask = async (id: string) => {
    const token = loadToken();
    const response = await fetch(`BASE_URL/api/task/cancel`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shift_id: id }),
    });

    // Throw an error if the response is not ok with the status and status text
    if (!response.ok) {
      throw new Error(`Error: ${response.status}, ${response.statusText}`);
    }
    const data = await response.json();
    Alert.alert(data.message);
    return data;
  };

  /**
   * This method is used to handle the users break time
   * When clicked the user will be able to take a break from the task assigned to them.
   * If the data returns true, the break time will be triggered notifying the user that the break time has started and the shift time will be paused given the kind of task assigned to the user.
   */
  const handleBreakTime = async (id: string) => {
    const token = loadToken();
    const response = await fetch(`BASE_URL/api/task/break`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ shift_id: id }),
    });

    // Throw an error if the response is not ok with the status and status text
    if (!response.ok) {
      throw new Error(`Error: ${response.status}, ${response.statusText}`);
    }
    const data = await response.json();
    Alert.alert(data.message);
    return data;
  };

  const value = {
    isModalVisible,
    handleTaskDetails,
    handleModalDisplay,
    handleDayPressEvent,
    markedDates,
    setSelectedDate,
    handleStartTask,
    handleEndTask,
    handleBreakTime,
    tasks,
    taskDetials,
    calculateTimeDifference,
    calculateTaskStartTime,
    applyForTask,
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
