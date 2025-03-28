import {
  BarData,
  DashboardContextType,
  EmployeeOnLeaveInterface,
  EventItem,
  LeaderBoardData,
  TaskStatistics,
} from "@/app/types/management/dashboard";
import { loadUserData, userData } from "@/app/utils/loadData";
import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { useEmployeeContext } from "../employee/employeeContext";
import { useAuth } from "@/app/authentication";

/**
 * DashboardContext - React Context for managing dashboard-related state and operations
 * Provides data and functionality for:
 * - Contract statistics
 * - Employee availability
 * - Task statistics
 * - Year selection for statistics
 */
const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

/**
 * DashboardProvider - Component that provides dashboard context to its children
 * Manages the state and data fetching for the dashboard features
 */
const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  // Import the useEmployeeContext hook and import the methods from the context to be used in the component
  const {
    retrieveEmployeeWithId,
    retrieveEmployeeTaskDetails,
    retrieveEmployeeWorkLog,
  } = useEmployeeContext();

  // Authentication instance for API calls
  const { axiosInstance } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState<boolean>(false);
  const [unavailableEmployees, setUnavailableEmployees] = useState<
    EmployeeOnLeaveInterface[]
  >([]);

  const [contractStats, setContractStats] = useState<BarData[]>([]);
  const [selectedYear, setSelectedYear] = useState<number>(
    new Date().getFullYear()
  );

  const [topPerformers, setTopPerformers] = useState<LeaderBoardData[]>([]);
  const [todayEvents, setTodayEvents] = useState<EventItem[]>([]);

  const [employeeId, setEmployeeId] = useState<string>("");

  // State for task statistics
  const [taskStats, setTaskStats] = useState<TaskStatistics>({
    completed: 0,
    ongoing: 0,
    pending: 0,
    assigned: 0,
    total: 0,
  });

  // Add state for employee data
  const [selectedEmployeeData, setSelectedEmployeeData] = useState<any>(null);
  const [employeeTaskDetails, setEmployeeTaskDetails] = useState<any>(null);
  const [employeeWorkLog, setEmployeeWorkLog] = useState<any>(null);

  /**
   * Fetch the data for the selected employee when the employeeId changes.
   * The hook ensures that the data is fetched only when the employeeId changes, and not on every render.
   * It also requires the methods from the useEmployeeContext hook to be passed in as dependencies which are used in the fetchEmployeeData function.
   * @param employeeId - The id of the employee to fetch data for
   * @returns void
   */
  useEffect(() => {
    if (employeeId) {
      const fetchEmployeeData = async () => {
        try {
          setIsLoading(true);
          const employeeData = await retrieveEmployeeWithId(employeeId);
          const taskDetails = await retrieveEmployeeTaskDetails(employeeId);
          const workLog = await retrieveEmployeeWorkLog(employeeId);

          setSelectedEmployeeData(employeeData);
          setEmployeeTaskDetails(taskDetails);
          setEmployeeWorkLog(workLog);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        } finally {
          setIsLoading(false);
        }
      };
      fetchEmployeeData();
    }
  }, [
    employeeId,
    retrieveEmployeeWithId,
    retrieveEmployeeTaskDetails,
    retrieveEmployeeWorkLog,
  ]);

  /**
   * Fetch the contract statistics for the selected year when the component mounts.
   * The state uses the new Date().getFullYear() to get the current year.
   * @param year
   * @returns
   */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const stats = await fetchContractStatistics(selectedYear);
        setContractStats(stats);
        const unavailableEmployees = await fetchUnavailableEmployees();
        setUnavailableEmployees(unavailableEmployees);
        await fetchTaskStatistics();
        await fetchTopPerformers();
        await fetchTodayEvents();
      } catch (error) {
        console.error("Error fetching data:", error);
        // If there's an authentication error, try refreshing the data once
        if (axios.isAxiosError(error) && error.response?.status === 401) {
          try {
            const stats = await fetchContractStatistics(selectedYear);
            setContractStats(stats);
          } catch (retryError) {
            console.error("Error after retry:", retryError);
          }
        }
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedYear]);

  /**
   * Fetches contract statistics from the API for a given year
   * Transforms the backend data into the required BarData format
   * @param year - The year for which to fetch statistics
   * @returns Promise<BarData[]> - Transformed contract statistics data
   */
  const fetchContractStatistics = async (year: number) => {
    setIsLoading(true);
    try {
      const response = await axiosInstance.get("api/get/contract/statistics/", {
        params: { year: year },
      });

      // Transform the backend data into the BarData format
      const transformedData: BarData[] = [];
      // Backend sends data in pairs (clients and contracts for each month)
      for (let i = 0; i < response.data.statistics.length; i += 2) {
        const clientData = response.data.statistics[i];
        const contractData = response.data.statistics[i + 1];

        transformedData.push({
          value: clientData.value,
          label: clientData.label,
          frontColor: "#177AD5",
          spacing: clientData.spacing,
          labelWidth: clientData.labelWidth,
          stacks: [
            { value: clientData.value, color: "#177AD5" }, // Clients
            { value: contractData.value, color: "#ED6665" }, // Contracts
          ],
        });
      }
      return transformedData;
    } catch (error) {
      console.error("Error fetching contract statistics:", error);
      return [];
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Fetches the list of employees who are unavailable/on leave for the current date
   * @returns Promise<EmployeeOnLeaveInterface[]> - List of unavailable employees
   */
  const fetchUnavailableEmployees = async () => {
    const currentDate = new Date().toISOString().split("T")[0];
    try {
      const response = await axiosInstance.get("api/get/employees/on/leave/", {
        params: { date: currentDate },
      });
      return response.data.unavailable_employees;
    } catch (error) {
      console.error("Error fetching unavailable employees:", error);
      return [];
    }
  };

  /**
   * Fetches task statistics from the API and updates the taskStats state
   * Includes counts for completed, ongoing, pending, and assigned tasks
   */
  const fetchTaskStatistics = async () => {
    try {
      const response = await axiosInstance.get("api/get/task/statistics/");
      setTaskStats(response.data.statistics);
    } catch (error) {
      console.error("Error fetching task statistics:", error);
    }
  };

  /**
   * Fetches the top performers from the API and updates the topPerformers state
   * @returns Promise<LeaderBoardData[]> - List of top performers
   */
  const fetchTopPerformers = async () => {
    try {
      const response = await axiosInstance.get("api/get/top/performers/");
      const topPerformers: LeaderBoardData[] = response.data.top_performers;
      setTopPerformers(topPerformers);
    } catch (error) {
      console.error("Error fetching top performers:", error);
    }
  };

  /**
   * Fetches the today events from the API and updates the todayEvents state
   * @returns Promise<string> - List of today events
   */
  const fetchTodayEvents = async () => {
    try {
      const response = await axiosInstance.get("api/get/today/events/");
      setTodayEvents(response.data.events);
    } catch (error) {
      console.error("Error fetching today events:", error);
    }
  };

  // Update the context value to include the new state
  const value: DashboardContextType = {
    user: userData(),
    contractStats,
    isLoading,
    fetchContractStatistics,
    setSelectedYear,
    selectedYear,
    unavailableEmployees,
    taskStats,
    fetchTaskStatistics,
    topPerformers,
    todayEvents,
    employeeId,
    setEmployeeId,
    selectedEmployeeData,
    employeeTaskDetails,
    employeeWorkLog,
    isModalVisible,
    setIsModalVisible,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * Custom hook to access the dashboard context
 * Must be used within a DashboardProvider component
 * @throws Error if used outside of DashboardProvider
 * @returns DashboardContextType - The dashboard context value
 */
export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};

export default DashboardProvider;
