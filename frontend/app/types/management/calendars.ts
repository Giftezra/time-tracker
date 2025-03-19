import { Status } from "@/constants/Status";
import { Dayjs } from "dayjs";
import { EmployeeType } from "./employee";

export interface CalendarContextType {
  schedule: string;
  timeFrame: string;
  search: string;
  handleSchedule: (value: string) => void;
  handleWeekSeleced: (value: string) => void;
  setSearch: (value: string) => void;
  gotoPreviousWeek: () => void;
  gotoNextWeek: () => void;
  currentWeek: Dayjs;
  weekDays: Dayjs[];
  weekRange: string;
  employees: EmployeeType[];
  getShift: (
    employeeId: number,
    date: Dayjs
  ) => CalendarShiftType[] | "No shift";
  cancelShift: () => Promise<void>;
  emailShiftReport: (startDate: string, endDate: string) => Promise<void>;
  activeShift: CalendarShiftType | undefined;
  setActiveShift: (shift: CalendarShiftType | undefined) => void;
  showEditShiftModal: boolean;
  setShowEditShiftModal: (value: boolean) => void;
  handleActiveShift: (shift: CalendarShiftType) => void;
  updateShift: (
    formattedDate: string,
    formattedStartTime: string,
    formattedEndTime: string
  ) => Promise<void>;
  approveShift: () => Promise<void>;
}

export interface CalendarShiftType {
  shiftId?: number;
  employeeId?: number;
  start_time?: string;
  end_time?: string;
  start_date?: string;
  end_date?: string;
  status?: string;
  client?: string;
  task_serial?: string;
}
