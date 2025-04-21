import { UserResponseType } from "./onboarding";

export interface OrderSummaryType {
  employee?: number;
  cost_per_employee?: number;
  duration: number;
}

export interface ContractChartDataType {
  value: number;
  label: string;
  frontColor?: string;
  topLabelComponent?: React.FC<ContractChartTopLevelComponentType>;
}

export interface ContractChartTopLevelComponentType {
  totalContracts?: number;
}

// Add this type definition at the top with your other imports
export interface BarData {
  value: number;
  label: string;
  frontColor: string;
  spacing?: number;
  labelWidth?: number;
  stacks?: { value: number; color: string }[];
}

export interface EmployeeOnLeaveInterface {
  employee_id: string;
  name: string;
  email: string;
  type: string;
  status: string;
  start_date: string;
  end_date: string;
}

export interface BarDat {
  clients: number;
  contracts: number;
  label: string;
}

export interface TaskStatistics {
  completed: number;
  ongoing: number;
  pending: number;
  assigned: number;
  total: number;
}

export default interface DashboardContextType {
  user: any;
  contractStats: BarData[];
  isLoading: boolean;
  fetchContractStatistics: (year: number) => Promise<BarData[]>;
  setSelectedYear: (year: number) => void;
  selectedYear: number;
  unavailableEmployees: EmployeeOnLeaveInterface[];
  taskStats?: TaskStatistics;
  fetchTaskStatistics: () => Promise<void>;
  topPerformers: LeaderBoardData[];
  todayEvents: EventItem[];
  employeeId: string;
  setEmployeeId: (id: string) => void;
  isModalVisible: boolean;
  setIsModalVisible: (visible: boolean) => void;
}

export interface LeaderBoardData {
  id?: string;
  name?: string;
  email?: string;
  phone?: string;
  role?: string;
  taskCompleted?: number;
  rank?: number;
}

export interface EventItem {
  name: string;
}
