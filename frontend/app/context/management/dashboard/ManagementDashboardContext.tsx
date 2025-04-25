import {
  BarData,
  EmployeeOnLeaveInterface,
  EventItem,
  LeaderBoardData,
  TaskStatistics,
} from "@/app/types/management/dashboard";
import DashboardContextType from "@/app/types/management/dashboard";
import { loadUserData, userData } from "@/app/utils/loadData";
import { useContext, createContext, useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "@/app/authentication";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Linking } from "react-native";
import { useEmployeeContext } from "../employee/employeeContext";
import {
  EmployeeDetailsInterface,
  TaskDetailsProps,
  WorklogInterface,
} from "@/app/types/management/employee";
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
  const {
    axiosInstance,
    user,
    isAuthenticated,
    setIsAlertVisible,
    setAlertConfig,
  } = useAuth();
  const {
    retrieveEmployeeTaskDetails,
    retrieveEmployeeWithId,
    retrieveEmployeeWorkLog,
    setEmployeeData,
    setWorkLog,
    setTaskDetails,
  } = useEmployeeContext();

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
  const [leaderboardEmployeeid, setLeaderboardEmployeeid] = useState<
    string | undefined
  >(undefined);
  const [taskStats, setTaskStats] = useState<TaskStatistics | undefined>(
    undefined
  );
  const [employeeAnalyticsData, setEmployeeAnalyticsData] = useState<{
    employeeData: EmployeeDetailsInterface | undefined;
    workLog: WorklogInterface | undefined;
    taskDetails: TaskDetailsProps | undefined;
  }>({
    employeeData: undefined,
    workLog: undefined,
    taskDetails: undefined,
  });
  /**
   * Fetch the contract statistics for the selected year when the component mounts.
   * The state uses the new Date().getFullYear() to get the current year.
   * Run this effect when the selectedYear changes, and only when the user has been associated with a company.
   * @param year
   * @returns
   */
  useEffect(() => {
    const fetchData = async () => {
      if (!isAuthenticated || !user?.company_name) {
        return;
      }
      setIsLoading(true);
      try {
        const [stats, tasks, performers, events] = await Promise.all([
          fetchContractStatistics(selectedYear),
          fetchTaskStatistics(),
          fetchTopPerformers(),
          fetchTodayEvents(),
        ]);
        setContractStats(stats);
        setTaskStats(tasks);
        setTopPerformers(performers);
        setTodayEvents(events);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [selectedYear, isAuthenticated, user?.company_name]);

  const handleEmployeeAnalytics = async (employeeId: string) => {
    try {
      const [employeeData, workLog, taskDetails] = (await Promise.all([
        retrieveEmployeeWithId(employeeId),
        retrieveEmployeeWorkLog(employeeId),
        retrieveEmployeeTaskDetails(employeeId),
      ])) as [any, any, any];
      setEmployeeAnalyticsData({ employeeData, workLog, taskDetails });
    } catch (error) {
      console.error("Error fetching employee analytics:", error);
    }
  };

  /**
   * Fetches contract statistics from the API for a given year
   * Uses current year if no year is provided
   * @param year - The year for which to fetch statistics (optional)
   * @returns Promise<BarData[]> - Transformed contract statistics data
   */
  const fetchContractStatistics = async (year?: number) => {
    if (!isAuthenticated) {
      return [];
    }

    setIsLoading(true);
    try {
      const yearToUse = year || new Date().getFullYear();
      const response = await axiosInstance.get("api/get/contract/statistics/", {
        params: { year: yearToUse },
        headers: {
          Authorization: `Bearer ${await AsyncStorage.getItem("token")}`,
        },
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
    try {
      const response = await axiosInstance.get("api/get/employees/on/leave/");
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
      return response.data.statistics;
    } catch (error) {
      console.error("Error fetching task statistics:", error);
      return undefined;
    }
  };

  /**
   * Fetches the top performers from the API and updates the topPerformers state
   * @returns Promise<LeaderBoardData[]> - List of top performers
   */
  const fetchTopPerformers = async () => {
    try {
      const response = await axiosInstance.get("api/get/top/performers/");
      return response.data.top_performers;
    } catch (error) {
      console.error("Error fetching top performers:", error);
      return [];
    }
  };

  /**
   * Fetches the today events from the API and updates the todayEvents state
   * @returns Promise<string> - List of today events
   */
  const fetchTodayEvents = async () => {
    try {
      const response = await axiosInstance.get("api/get/today/events/");
      return response.data.events;
    } catch (error) {
      console.error("Error fetching today events:", error);
      return [];
    }
  };

  const handlePhone = (phone: string) => {
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Confirmation",
      message: `Are you sure you want to call ${phone}?`,
      onConfirm: async () => {
        await Linking.openURL(`tel:${phone}`);
        setIsAlertVisible(false);
      },
      onClose: () => {
        setIsAlertVisible(false);
      },
      type: "success",
      isVisible: true,
    });
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
    isModalVisible,
    setIsModalVisible,
    handlePhone,
    handleEmployeeAnalytics,
    employeeAnalyticsData,
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
