export type TimeSheetType = {
  task_serial: string;
  contract_name: string;
  status: string;
  start_time: string;
  end_time: string;
  task_start_time: string;
  start_date: string;
}

type WeekGroupType = {
  title: string;
  data: TimeSheetType[];
}

export type OngoingShiftType = {
  shift_start_time: string;
  task_end_time: string;
}


export type TimesheetContextType = {
  groupByWeek: (data: TimeSheetType[]) => WeekGroupType[];
  timesheets: TimeSheetType[];
  filteredData: TimeSheetType[];
  handleStatusChange: (status: string) => void;
  selectedStatus: string;
  ongoingShift: OngoingShiftType | null;
};
