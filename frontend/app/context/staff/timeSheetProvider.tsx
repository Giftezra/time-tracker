import TimesheetContextType, {
  TimeSheetType,
} from "@/app/types/staff/timeSheet";
import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "@/app/authentication";

const TimeSheetContext = createContext<TimesheetContextType | undefined>(
  undefined
);

const TimeSheetProvider = ({ children }: { children: React.ReactNode }) => {
  const { axiosInstance } = useAuth();

  const [selectedStatus, setSelectedStatus] = useState<string>("approved");
  const [timesheets, setTimesheets] = useState<TimeSheetType[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  /* Filter the data based on the selected status */
  const filteredData = timesheets.filter(
    (item) => item.status === selectedStatus
  );

  /* Handle the change of the selected status */
  const handleStatusChange = (status: string) => {
    setSelectedStatus(status);
  };

  /* Fetch the timesheet data from the server */
  useEffect(() => {
    const fetchTimesheetData = async () => {
      try{
        setIsLoading(true);
        const timesheets = await getTimesheetData();
        setTimesheets(timesheets);
      }catch(error){
        console.error("Error fetching timesheet data:", error);
      }finally{
        setIsLoading(false);
      }
    };
    fetchTimesheetData();
  }, []);

  // Helper function to get the start of the week for a given date
  const getWeekStart = (date: Date) => {
    const dayOfWeek = date.getDay();
    const diff = date.getDate() - dayOfWeek + (dayOfWeek === 0 ? -6 : 1);
    const startOfWeek = new Date(date.setDate(diff));
    startOfWeek.setHours(0, 0, 0, 0);
    return startOfWeek;
  };

  // Helper function to format a date range for a week
  const formatWeekRange = (start: Date) => {
    const end = new Date(start);
    end.setDate(start.getDate() + 6);
    return `${start.toISOString().slice(0, 10)} - ${end
      .toISOString()
      .slice(0, 10)}`;
  };

  // Function to group data by week
  const groupByWeek = (data: TimeSheetType[]) => {
    // Sort data by date first
    const sortedData = [...data].sort(
      (a, b) =>
        new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
    );

    const grouped = sortedData.reduce((acc, item) => {
      const date = new Date(item.start_date);
      const weekStart = getWeekStart(new Date(date)).toISOString();

      if (!acc[weekStart]) {
        acc[weekStart] = [];
      }
      acc[weekStart].push(item);
      return acc;
    }, {} as Record<string, TimeSheetType[]>);

    // Sort the weeks in descending order
    return Object.entries(grouped)
      .sort(
        ([weekA], [weekB]) =>
          new Date(weekB).getTime() - new Date(weekA).getTime()
      )
      .map(([weekStart, tasks]) => ({
        title: formatWeekRange(new Date(weekStart)),
        // Sort tasks within each week
        data: tasks.sort(
          (a, b) =>
            new Date(b.start_date).getTime() - new Date(a.start_date).getTime()
        ),
      }));
  };


  /**
   * Get the timesheet data from the server.
   * Set the timesheet data to the state if status is 200 or undefined.
   */
  const getTimesheetData = async () => {
    try{
      const response = await axiosInstance.get("/api/get/timesheet/data/");
      console.log(response.data.timesheets);
      return response.data.timesheets;
    }catch(error){
      console.error("Error fetching timesheet data:", error);
      return [];
    }

  }


  const value: TimesheetContextType = {
    timesheets,
    filteredData,
    groupByWeek,
    handleStatusChange,
    selectedStatus,
  };

  return (
    <TimeSheetContext.Provider value={value}>
      {children}
    </TimeSheetContext.Provider>
  );
};

const useTimeSheetContext = () => {
  const context = useContext(TimeSheetContext);
  if (!context) {
    throw new Error(
      "useTimeSheetContext must be used within a TimeSheetProvider"
    );
  }
  return context;
};

export default TimeSheetProvider;
export { useTimeSheetContext };
