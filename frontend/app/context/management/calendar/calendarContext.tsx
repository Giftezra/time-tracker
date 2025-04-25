import {
  CalendarContextType,
  CalendarShiftType,
} from "@/app/types/management/calendars";
import { EmployeeType } from "@/app/types/management/employee";
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
import { useAuth } from "@/app/authentication";
import { View, Text } from "react-native";
import MaterialIcons from "@expo/vector-icons/MaterialIcons";
dayjs.extend(isSameOrBefore);
dayjs.extend(isSameOrAfter);

const CalendarContext = createContext<CalendarContextType | undefined>(
  undefined
);

const CalendarContextProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const { axiosInstance, setIsAlertVisible, setAlertConfig } = useAuth();
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
      try {
        setLoading(true);
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
  const getAllEmployees = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/get/all/employees/");
      const employees = response.data.employees;
      console.log("employees", employees);
      return employees;
    } catch (error) {
      console.log("Error fetching employees:", error);
    } finally {
      setLoading(false);
    }
  };

  /** Method fetches all shifts that is associated with the request user only if they are an admin or the owner */
  const getAllShifts = async () => {
    try {
      setLoading(true);
      const response = await axiosInstance.get("/api/get/shifts");
      const shifts = response.data.shifts;
      console.log("shifts", shifts);
      return shifts || [];
    } catch (error) {
      console.error("Error fetching shifts:", error);
    } finally {
      setLoading(false);
    }
  };

  /** This method is used to search the shifts for employees with the same id as those returned in the shift list.
   * Returns all shifts for the employee that overlap with the given date
   * @param employeeId - The ID of the employee to find shifts for
   * @param date - The date to check for shifts
   * @returns Array of matching shifts for the employee or null if none found
   */
  const getShift = (
    employeeId: number,
    date: dayjs.Dayjs
  ): CalendarShiftType[] | null => {
    if (!shifts || shifts.length === 0 || employeeId === undefined) {
      return null;
    }

    const dateStr = date.format("YYYY-MM-DD");
    const matchingShifts = shifts.filter(
      (shift) =>
        shift.employeeId === employeeId &&
        dayjs(shift.start_date).isSameOrBefore(dateStr) &&
        dayjs(shift.end_date).isSameOrAfter(dateStr)
    );

    return matchingShifts.length > 0 ? matchingShifts : null;
  };

  /** Method is used to cancel the shift on the server.
   * The method is called when the user clicks the cancel button on the edit shift modal
   * Call the getAllShifts method to update the shifts state after the shift is cancelled
   * @returns the message from the server
   */
  const cancelShift = async () => {
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Confirmation",
      message: "Are you sure you want to cancel this shift?",
      onConfirm: async () => {
        setIsAlertVisible(false);
        try {
          const response = await axiosInstance.patch("/api/cancel/shift/", {
            shift_id: activeShift?.shiftId,
            employee_id: activeShift?.employeeId,
          });
          if (response.status === 200) {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Status",
              message: response.data.message,
              onConfirm: async () => {
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
            const shifts = await getAllShifts();
            setShifts(shifts);
            setShifts(shifts);
            setShowEditShiftModal(false);
          } else {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Status",
              message: response.data.message,
              isVisible: true,
            });
          }
        } catch (error) {
          console.error("Error cancelling shift:", error);
          throw error;
        }
      },
      isVisible: true,
      onClose() {
        setIsAlertVisible(false);
      },
    });
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
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Status",
          message: response.data.message,
          onConfirm: async () => {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
      }
    } catch (error) {
      console.error("Error approving shift:", error);
    }
  };

  /**
   * This method is used to filter the shifts based on the name of the employee
   * @param name - the name of the employee to search for
   * @returns the filtered shifts for matching employees
   */
  const filterShifts = (name: string): CalendarShiftType[] => {
    if (!name.trim()) return shifts;
    const matchingEmployees = employees.filter((employee) =>
      employee.employee_name.toLowerCase().includes(name.toLowerCase())
    );
    const filteredShifts = shifts.filter((shift) =>
      matchingEmployees.some(
        (employee) =>
          shift?.employeeId !== undefined &&
          parseInt(employee.employee_id) === shift.employeeId
      )
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
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Confirmation",
      message: `Are you sure you want to update this shift? With the new details: ${formattedDate} ${formattedStartTime} - ${formattedEndTime} ? If you are sure, click confirm.`,
      onConfirm: async () => {
        setIsAlertVisible(false);
        try {
          const response = await axiosInstance.patch("/api/update/shift/", {
            shift_id: activeShift?.shiftId,
            employee_id: activeShift?.employeeId,
            date: formattedDate,
            start_time: formattedStartTime,
            end_time: formattedEndTime,
          });
          if (response.status === 200) {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Shift update status",
              message: response.data.message,
              onConfirm: async () => {
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
          } else {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Status",
              message: response.data.message,
              onConfirm: async () => {
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
          }
        } catch (error) {
          console.error("Error updating shift:", error);
        }
      },
      isVisible: true,
      onClose() {
        setIsAlertVisible(false);
      },
    });
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
    filterShifts,
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
