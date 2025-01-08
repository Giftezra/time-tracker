export type TimeSheetType = {
  taskSerial: string;
  contractName?: string;
  status?: string;
  startTime?: string;
  endTime?: string;
  loggedTime?: string;
  startDate: string;
}

type WeekGroupType = {
  title: string;
  data: TimeSheetType[];
}


export type TimesheetContextType = {
  groupByWeek: (data: TimeSheetType[]) => WeekGroupType[];
  data: TimeSheetType[];
};
