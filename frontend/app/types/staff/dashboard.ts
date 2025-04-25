export default interface StaffDashboardContextType {
  progress: number;
  setProgress: (progress: number) => void;
  dashboardData: DashboardDataInterface | undefined;
  chartData: StatisticItem[];
  chartYear: number;
  
}

export interface CurrentOngoingTaskInterface {
  contract_name: string;
  shift_start_time: string;
  task_end_time: string;
}

export interface DashboardDataInterface {
  total_shifts?: number;
  total_hours?: number;
  total_earnings?: number;
  completed_shifts?: number;
  cancelled_shifts?: number;
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

export interface ChartDataInterface {
  labels: string[];
  data: number[];
}

export interface StatisticItem {
  value: number;
  label: string;
  spacing: number;
  labelWidth: number;
  frontColor: string;
}

export interface StatisticsResponse {
  statistics: StatisticItem[];
  year: number;
}
