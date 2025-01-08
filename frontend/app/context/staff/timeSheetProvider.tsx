import {
  TimesheetContextType,
  TimeSheetType,
} from "@/app/types/staff/timeSheet";
import { createContext, useContext } from "react";

const TimeSheetContext = createContext<TimesheetContextType | undefined>(
  undefined
);

const TimeSheetProvider = ({ children }: { children: React.ReactNode }) => {
  const data: TimeSheetType[] = [
    {
      taskSerial: "SD-123",
      contractName: "contract1",
      status: "approved",
      startTime: "12:00",
      endTime: "12:00",
      loggedTime: "13:00",
      startDate: "2024-12-01",
    },
    {
      taskSerial: "SD-124",
      contractName: "contract2",
      status: "pending",
      startTime: "12:00",
      endTime: "12:00",
      loggedTime: "13:00",
      startDate: "2024-11-01",
    },
    {
      taskSerial: "SD-124",
      contractName: "contract2",
      status: "pending",
      startTime: "12:00",
      endTime: "12:00",
      loggedTime: "13:00",
      startDate: "2024-11-02",
    },
    {
      taskSerial: "SD-125",
      contractName: "contract3",
      status: "approved",
      startTime: "12:00",
      endTime: "12:00",
      loggedTime: "13:00",
      startDate: "2024-10-01",
    },
    {
      taskSerial: "SD-124",
      contractName: "contract2",
      status: "pending",
      startTime: "12:00",
      endTime: "12:00",
      loggedTime: "13:00",
      startDate: "2024-11-04",
    },
    {
      taskSerial: "SD-125",
      contractName: "contract3",
      status: "approved",
      startTime: "12:00",
      endTime: "12:00",
      loggedTime: "13:00",
      startDate: "2024-11-08",
    },
    {
      taskSerial: "SD-125",
      contractName: "contract3",
      status: "canceled",
      startTime: "12:00",
      endTime: "12:00",
      loggedTime: "13:00",
      startDate: "2024-10-02",
    },
    {
      taskSerial: "SD-125",
      contractName: "contract3",
      status: "approved",
      startTime: "12:00",
      endTime: "12:00",
      loggedTime: "13:00",
      startDate: "2024-10-03",
    },
    {
      taskSerial: "SD-124",
      contractName: "contract2",
      status: "pending",
      startTime: "12:00",
      endTime: "12:00",
      loggedTime: "13:00",
      startDate: "2024-11-06",
    },
    {
      taskSerial: "SD-125",
      contractName: "contract3",
      status: "approved",
      startTime: "12:00",
      endTime: "12:00",
      loggedTime: "13:00",
      startDate: "2024-10-10",
    },
  ];

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
    const grouped = data.reduce((acc, item) => {
      const date = new Date(item.startDate);
      const weekStart = getWeekStart(new Date(date)).toISOString();

      if (!acc[weekStart]) {
        acc[weekStart] = [];
      }
      acc[weekStart].push(item);
      return acc;
    }, {} as Record<string, TimeSheetType[]>);

    return Object.entries(grouped).map(([weekStart, tasks]) => ({
      title: formatWeekRange(new Date(weekStart)),
      data: tasks,
    }));
  };


 

  const value = {
    data,
    groupByWeek,
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
