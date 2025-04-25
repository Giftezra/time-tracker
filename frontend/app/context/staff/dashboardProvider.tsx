import StaffDashboardContextType, {
  ChartDataInterface,
  CurrentOngoingTaskInterface,
  DashboardDataInterface,
  StatisticsResponse,
  StatisticItem,
} from "@/app/types/staff/dashboard";
import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "@/app/authentication";
import { useSideComponentContext } from "./sideComponentProvider";
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
  const { event } = useSideComponentContext();

  const [progress, setProgress] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [dashboardData, setDashboardData] = useState<
    DashboardDataInterface | undefined
  >(undefined);
  const [chartData, setChartData] = useState<StatisticItem[]>([]);
  const [chartYear, setChartYear] = useState<number>(new Date().getFullYear());

  useEffect(() => {
    // Update progress every minute
    const calculateProgress = () => {
      const now = new Date().getTime();
      if (!event) return;
      const taskEndTime = new Date(event.end_time || "").getTime();
      const taskStartTime = new Date(event.start_time || "").getTime();

      // Calculate progress
      const totalDuration = taskEndTime - taskStartTime;
      const elapsedTime = now - taskStartTime;
      const newProgress = Math.max(0, Math.min(elapsedTime / totalDuration, 1));

      setProgress(newProgress);
    };

    // Calculate initial progress
    calculateProgress();

    // Set up interval to update progress
    const intervalId = setInterval(calculateProgress, 60000); // Update every minute

    // Cleanup interval on unmount
    return () => clearInterval(intervalId);
  }, [event?.start_time, event?.end_time]);

  /* Load the users current shift when the page mounts  */
  useEffect(() => {
    const fetchAllData = async () => {
      setIsLoading(true);
      try {
        const [dashboardData, statistics] = await Promise.all([
          getDashboardData(),
          getShiftStatistics(),
        ]);

        setDashboardData(dashboardData);
        if (statistics) {
          setChartData(statistics.statistics);
          setChartYear(statistics.year);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAllData();
  }, []);

  /**
   * Get the user completed shifts data from the server
   * Contains the total shifts, total hours, total earnings and pending tasks
   * Set the completed shifts data to the state
   */
  const getDashboardData = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/get/staff/dashboard/data/"
      );
      if (response.status === 200) {
        const dashboardData: DashboardDataInterface = response.data.shift_data;
        return dashboardData;
      } else {
        return undefined;
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  const getShiftStatistics = async () => {
    try {
      const response = await axiosInstance.get(
        "/api/get/staff/growth/statistics/"
      );
      if (response.status === 200) {
        return response.data as StatisticsResponse;
      }
      return undefined;
    } catch (error) {
      console.error("Error fetching statistics:", error);
      return undefined;
    }
  };

  /**
   *  This method is used to retrieve the ongoing task data from the server.
   * @param null
   * @returns Promise<DashboardOngoingTaskType>
   */
  const value: StaffDashboardContextType = {
    progress,
    setProgress,
    dashboardData,
    chartData,
    chartYear,
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
