import {
  CalendarContextType,
  CalendarShiftType,
} from "@/app/types/management/calendars";
import { EmployeeType } from "@/app/types/management/employee";
import { BASE_URL } from "@/app/utils/urls";
import dayjs from "dayjs";
import isSameOrBefore from "dayjs/plugin/isSameOrBefore";
import isSameOrAfter from "dayjs/plugin/isSameOrAfter";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { th } from "react-native-paper-dates";
import { useAuth } from "../../authentication";
import { Alert } from "react-native";

dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

const CalendarContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { axiosInstance } = useAuth();
  const [schedule, setSchedule] = useState<string>("shifts");
  const [timeFrame, setTimeFrame] = useState<string>("week");
  const [search, setSearch] = useState("");
  const [currentWeek, setCurrentWeek] = useState(dayjs().startOf("week"));
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [shifts, setShifts] = useState<CalendarShiftType[]>([]);
  const [loading, setLoading] = useState<boolean>(true);

  /**
   * Use a hook to call the methods as soon as the page is opened.
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
  // Manage the active shift which is the shift that is currently being edited
  const [activeShift, setActiveShift] = useState<CalendarShiftType | undefined>(
    undefined
  );
  const [showEditShiftModal, setShowEditShiftModal] = useState<boolean>(false);

  /** The method is used to get all the list of employees from the server side using axios.
   */
  const getAllEmployees = async (): Promise<EmployeeType[]> => {
    try {
      const response = await axiosInstance.get("/api/get/all/employees/");
      const employees = response.data.employees;
      return employees;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  };

  /** Method fetches all shifts that is associated with the request user only if they are an admin or the owner */
  const getAllShifts = async (): Promise<CalendarShiftType[]> => {
    try {
      const response = await axiosInstance.get("/api/get/shifts");
      const shifts = response.data.shifts;
      return shifts;
    } catch (error) {
      console.error("Error fetching shifts:", error);
      throw error;
    }
  };

  /** This method is used to search the shifts for employees with the same id as those returned in the shift list.
   * Returns all shifts for the employee that overlap with the given date
   * @param employeeId - The ID of the employee to find shifts for
   * @param date - The date to check for shifts
   * @returns Array of matching shifts for the employee or "No shift" if none found
   */
  const getShift = (employeeId: number, date: dayjs.Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");

    // Find all shifts where:
    // 1. The employee is assigned AND
    // 2. The date falls within the shift's start_date to end_date range
    const matchingShifts = shifts.filter(
      (shift) =>
        shift.employeeId === employeeId &&
        dayjs(shift.start_date).isSameOrBefore(dateStr) &&
        dayjs(shift.end_date).isSameOrAfter(dateStr)
    );

    // Sort shifts by start time
    matchingShifts.sort((a, b) => {
      return (a.start_time || "").localeCompare(b.start_time || "");
    });

    return matchingShifts.length > 0 ? matchingShifts : "No shift";
  };

  /** Method is used to cancel the shift on the server.
   * The method is called when the user clicks the cancel button on the edit shift modal
   * Call the getAllShifts method to update the shifts state after the shift is cancelled
   * @returns the message from the server
   */
  const cancelShift = async () => {
    try {
      const response = await axiosInstance.patch("/api/cancel/shift/", {
        shift_id: activeShift?.shiftId,
        employee_id: activeShift?.employeeId,
      });
      if (response.status === 200) {
        Alert.alert("Shift cancellation status", response.data.message);
        await getAllShifts();
        setShowEditShiftModal(false);
      }
    } catch (error) {
      console.error("Error cancelling shift:", error);
      throw error;
    }
  };

  /**
   * Approve the shift for the employee on the server side
   * The method is called when the user clicks the approve button on the edit shift modal
   * Call the getAllShifts method to update the shifts state after the shift is approved
   * The shift approval is used to update the time sheet status to approved if not already approved
   * @returns the message from the server
   */
  const approveShift = async () => {
    try {
      const response = await axiosInstance.patch("/api/approve/shift/", {
        shift_id: activeShift?.shiftId,
        employee_id: activeShift?.employeeId,
      });
      if (response.status === 200) {
        Alert.alert("Shift approval status", response.data.message);
        await getAllShifts();
        setShowEditShiftModal(false);
      }
    } catch (error) {
      console.error("Error approving shift:", error);
      throw error;
    }
  };

  /**
   * This method is used to filter the shifts bases on the name of the employee
   * @param name - the name of the employee
   * @returns the filtered shifts
   */
  const filterShifts = (name: string) => {
    const filteredShifts = employees.filter((employee) =>
      employee.employee_name
        .toString()
        .toLowerCase()
        .includes(name.toLowerCase())
    );
    return filteredShifts;
  };

  /**
   * Method is used to set the selected shift to the active shift
   * @param shift - The shift to be set as the active shift
   */
  const handleActiveShift = (shift: CalendarShiftType) => {
    setActiveShift(shift);
    setShowEditShiftModal(true);
  };

  /**
   * Handle how the shift is updated on the server side
   * The active shift contains the detaila of the shift and the employee assigned
   * @param formattedDate - The formatted date of the shift
   * @param formattedStartTime - The formatted start time of the shift
   * @param formattedEndTime - The formatted end time of the shift
   *
   * After the shift is successfully updated, the method calls the getAllShifts method to update the shifts state
   */
  const updateShift = async (
    formattedDate: string,
    formattedStartTime: string,
    formattedEndTime: string
  ) => {
    try {
      const response = await axiosInstance.patch("/api/update/shift/", {
        shift_id: activeShift?.shiftId,
        employee_id: activeShift?.employeeId,
        date: formattedDate,
        start_time: formattedStartTime,
        end_time: formattedEndTime,
      });
      if (response.status === 200) {
        Alert.alert("Shift update status", response.data.message);
        await getAllShifts();
        setShowEditShiftModal(false);
      }
    } catch (error) {
      console.error("Error updating shift:", error);
      throw error;
    }
  };
  /**
   * Request the server to generate and email a PDF report of shifts
   * @param startDate - Start date for the shift report
   * @param endDate - End date for the shift report
   */
  const emailShiftReport = async (startDate: string, endDate: string) => {
    console.log("start date", startDate);
    console.log("end date", endDate);
    try {
      const response = await axiosInstance.post("/api/email/shift/report/", {
        start_date: startDate,
        end_date: endDate,
      });
      return response.data;
    } catch (error) {
      console.error("Error requesting shift report:", error);
      throw error;
    }
  };

  const value: CalendarContextType = {
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
    employees,
    getShift,
    cancelShift,
    emailShiftReport,
    activeShift,
    setActiveShift,
    showEditShiftModal,
    setShowEditShiftModal,
    handleActiveShift,
    updateShift,
    approveShift,
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
