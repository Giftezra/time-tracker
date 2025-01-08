import {
  CalendarContextType,
  CalendarShiftType,
} from "@/app/types/management/calendars";
import { EmployeeDetailsType } from "@/app/types/management/employee";
import { loadToken } from "@/app/utils/loadData";
import { BASE_URL } from "@/app/utils/urls";
import dayjs from "dayjs";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { th } from "react-native-paper-dates";

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

const CalendarContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [schedule, setSchedule] = useState<string>("shifts");
  const [timeFrame, setTimeFrame] = useState<string>("week");
  const [search, setSearch] = useState("");
  const [currentWeek, setCurrentWeek] = useState(dayjs().startOf("week"));
  const [employees, setEmployees] = useState<EmployeeDetailsType[]>([]);
  const [shifts, setShifts] = useState<CalendarShiftType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /** Use a hook to call the methods as soon as the page is opened.
   * Set the loading state while the context loads
   */
  useEffect(() => {
    const fetchDate = async () => {
      setLoading(true);
      try {
        const employees = await getAllEmployees();
        setEmployees(employees);
        const shifts = await getAllShifts();
        setShifts(shifts);
      } catch (error) {
        console.log(error);
      } finally {
        setLoading(false);
      }
    };
    fetchDate();
  }, []);

  const weekDays = Array.from({ length: 7 }, (_, i) =>
    currentWeek.add(i, "day")
  );

  const weekRange = `${weekDays[0].format("MMM DD")} - ${weekDays[6].format(
    "MMM DD"
  )}`;

  const gotoPreviousWeek = () => {
    setCurrentWeek(currentWeek.subtract(1, "week"));
  };

  const gotoNextWeek = () => {
    setCurrentWeek(currentWeek.add(1, "week"));
  };

  const handleSchedule = (value: string) => {
    setSchedule(value);
  };

  const handleWeekSeleced = (value: string) => {
    setTimeFrame(value);
  };

  /** The method is used to get all the list of employees from the server side using the fetch.
   * The token is retrieved and passed to authenticate the user.
   */
  const getAllEmployees = async (): Promise<EmployeeDetailsType[]> => {
    const token = await loadToken();
    console.log("calendar employee token:", token);
    const response = await fetch(`${BASE_URL}/api/get/all/employees/`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    // Check the response status ok then throw an error if not
    if (!response.ok) {
      console.log("response not ok", response.statusText);
    }

    // Get the response in json format
    const data = await response.json();
    if (!data) {
      throw new Error("No employees found");
    }
    const employees: EmployeeDetailsType[] = data.employees;
    return employees;
  };

  /** MEthod fetches all shifts that is associated with the request user only if they are an admin or the owner */
  const getAllShifts = async (): Promise<CalendarShiftType[]> => {
    // Get the token from the local storage
    const token = await loadToken();
    console.log("calendar shift token:", token);
    // Send the request to the server to get all the shifts
    const response = await fetch(`$BASE_URL/api/get/shifts`, {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });
    // Check the response status ok then throw an error if not
    if (!response.ok) {
      console.log("response not ok", response.statusText);
      throw new Error(response.statusText);
      ``;
    }
    /* Get the data, then validate it before retrieving its content */
    const data = await response.json();
    if (!data) {
      throw new Error("No shifts found");
    }
    const shifts: CalendarShiftType[] = data.shifts;
    return shifts;
  };

  /** This method is used to search the shifts for employees with the same id as those returned in the shift list.
   * @returns the shift for the employee or a no shift texts if the user had (have) no shift for that day
   */
  const getShift = (employeeId: number, date: dayjs.Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD"); // Format the date to match 'YYYY-MM-DD'
    const shift = shifts.find(
      (shift) => shift.employeeId === employeeId && shift.startdate === dateStr // Check date only
    );
    return shift || "No shift";
  };

  /** #
   * This method is designed to cancel the shift with the given id.
   * @params shift id is the id of the shift to be cancelled.
   * The  */
  const cancelShift = async (shiftId: number) => {
    const token = await loadToken();
    const response = await fetch(`${BASE_URL}/api/cancel/shift/`, {
      method: "UPDATE",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ shift_id: shiftId }),
    });

    if (!response.ok) {
      console.log("response not ok", response.statusText);
      throw new Error(response.statusText);
    }
    const data = await response.json();
  };

  const value = {
    schedule,
    timeFrame,
    search,
    handleSchedule,
    handleWeekSeleced,
    setSearch,
    gotoPreviousWeek,
    gotoNextWeek,
    currentWeek,
    weekDays,
    weekRange,
    loading,
    employees,
    getShift,
    cancelShift,
  };

  return (
    <CalendarContext.Provider value={value}>
      {children}
    </CalendarContext.Provider>
  );
};

export const useCalendar = () => {
  const context = useContext(CalendarContext);
  if (context === undefined) {
    throw new Error("useCalender must be used within a CalenderProvider");
  }
  return context;
};

export default CalendarContextProvider;
