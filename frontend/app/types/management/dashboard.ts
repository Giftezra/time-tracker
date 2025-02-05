import { UserResponseType } from "./onboarding";

export interface OrderSummaryType {
  employee?: number;
  cost_per_employee?: number;
  duration: number;
};


export interface ContractChartDataType {
  value: number;
  label: string;
  frontColor?: string;
  topLabelComponent?: React.FC<ContractChartTopLevelComponentType>;
};


export interface ContractChartTopLevelComponentType {
  totalContracts?: number;
};


export interface ContractStatistic {
  value: number;
  label?: string;
  spacing?: number;
  labelWidth?: number;
  frontColor: string;
}

export interface DashboardContextType {
  user: any;
  contractStats: ContractStatistic[];
  isLoading: boolean;
  fetchContractStatistics: (year?: number) => Promise<ContractStatistic[]>;
}
