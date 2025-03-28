export type StaffDashboardContextType = {
  ongoingTask: CurrentOngoingTaskInterface | undefined;
  setOngoingTask: (task: CurrentOngoingTaskInterface) => void;
  progress: number;
  setProgress: (progress: number) => void;
  completedShifts: CompletedShiftsInterface | undefined;
};

export interface CurrentOngoingTaskInterface {
  contract_name: string;
  shift_start_time: string;
  task_end_time: string;
}

export interface CompletedShiftsInterface {
  total_shifts: number;
  total_hours: number;
  total_earnings: number;
  pending_tasks: number;
}

export interface TaskChartProps {
  width: number;
  title: string;
  taskStats: TaskStatistics;
}

export interface TaskStatistics {
  completed: number;
  ongoing: number;
  pending: number;
  assigned: number;
  total: number;
}
