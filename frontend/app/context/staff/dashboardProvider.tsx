import {
  CompletedShiftsInterface,
  CurrentOngoingTaskInterface,
  StaffDashboardContextType,
} from "@/app/types/staff/dashboard";
import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "@/app/authentication";
const DashboardContext = createContext<StaffDashboardContextType | undefined>(
  undefined
);

/**
 * Create the provider for the dashboard consumer.
 * The provider is used to fetch the data from the server and to also manipulate other data that would be consumed by the dashboard and its child components.
 */
const StaffDashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const { axiosInstance } = useAuth();

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [ongoingTask, setOngoingTask] = useState<
    CurrentOngoingTaskInterface | undefined
  >(undefined);

  const [completedShifts, setCompletedShifts] = useState<
    CompletedShiftsInterface | undefined
  >({
    total_shifts: 0,
    total_hours: 0,
    total_earnings: 0,
    pending_tasks: 0,
  });

  // useEffect(() => {
  //   // Update progress every minute
  //   const calculateProgress = () => {
  //     const now = new Date().getTime();
  //     if (!ongoingTask) return;
  //     const taskEndTime = new Date(ongoingTask.task_end_time).getTime();
  //     const taskStartTime = new Date(ongoingTask.shift_start_time).getTime();

  //     // Calculate progress
  //     const totalDuration = taskEndTime - taskStartTime;
  //     const elapsedTime = now - taskStartTime;
  //     const newProgress = Math.max(0, Math.min(elapsedTime / totalDuration, 1));

  //     setProgress(newProgress);
  //   };

  //   // Calculate initial progress
  //   calculateProgress();

  //   // Set up interval to update progress
  //   const intervalId = setInterval(calculateProgress, 60000); // Update every minute

  //   // Cleanup interval on unmount
  //   return () => clearInterval(intervalId);
  // }, [ongoingTask?.shift_start_time, ongoingTask?.task_end_time]);

  /* Load the users current shift when the page mounts  */
  // useEffect(() => {
  //   const fetchData = async () => {
  //     setIsLoading(true);
  //     try {
  //       const completedShiftsData = await getCompletedShiftsData();
  //       setCompletedShifts(completedShiftsData);
  //       const ongoingTaskData = await getCurrentShiftData();
  //       setOngoingTask(ongoingTaskData);
  //     } catch (error) {
  //       console.error("Error fetching data:", error);
  //     } finally {
  //       setIsLoading(false);
  //     }
  //   };
  //   fetchData();
  // }, []);

  /**
   * Retrieve the users current shift data from the server.
   * Set the ongoing task data to the state.
   */
  const getCurrentShiftData = async () => {
    const response = await axiosInstance.get("/api/get/current/ongoing/shift/");
    if (response.status === 200) {
      return response.data.shift_data;
    } else {
      return undefined;
    }
  };

  /**
   * Get the user completed shifts data from the server
   * Contains the total shifts, total hours, total earnings and pending tasks
   * Set the completed shifts data to the state
   */
  const getCompletedShiftsData = async () => {
    const response = await axiosInstance.get("/api/get/completed/shifts/");
    if (response.status === 200) {
      return response.data.shift_data;
    } else {
      return undefined;
    }
  };

  /**
   *  This method is used to retrieve the ongoing task data from the server.
   * @param null
   * @returns Promise<DashboardOngoingTaskType>
   */
  const value: StaffDashboardContextType = {
    ongoingTask,
    setOngoingTask,
    progress,
    setProgress,
    completedShifts,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * This is a custom hook that is used to consume the dashboard context.
 * It is used to access the data that is provided by the dashboard provider.
 */
export const useStaffDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export default StaffDashboardProvider;
