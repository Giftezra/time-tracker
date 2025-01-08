import { Status } from "@/constants/Status";
import { Dayjs } from "dayjs";
import { EmployeeDetailsType } from "./employee";

export type CalendarContextType = {
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
};

export type CalendarShiftType = {
  shiftId?: number;
  employeeId?: number;
  starttime?: string;
  endtime?: string;
  status?: string;
  client?: string;
  task_serial?: string;
  startdate?: string;
  loading?: boolean;
  employees?: EmployeeDetailsType[];
  getShift?: (employeeId: number, date: Dayjs) => CalendarShiftType | string;
  cancelShift?: (shiftId: number) => void;
};
