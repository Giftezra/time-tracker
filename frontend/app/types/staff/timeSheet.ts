export interface TimeSheetType {
  task_serial: string;
  contract_name: string;
  status: string;
  start_time: string;
  end_time: string;
  task_start_time: string;
  start_date: string;
}
interface WeekGroupType {
  title: string;
  data: TimeSheetType[];
}

export interface OngoingShiftType {
  shift_start_time: string;
  task_end_time: string;
}


export default interface TimesheetContextType {
  groupByWeek: (data: TimeSheetType[]) => WeekGroupType[];
  timesheets: TimeSheetType[];
  filteredData: TimeSheetType[];
  handleStatusChange: (status: string) => void;
  selectedStatus: string;
};
