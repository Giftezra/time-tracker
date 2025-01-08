import { UserResponseType } from "./onboarding"

export type OrderSummaryType = {
  employee? :number,
  cost_per_employee? :number,
  duration : number,
}

export type ContractChartDataType = {
  value: number,
  label: string,
  frontColor?: string,  
  topLabelComponent?: React.FC<ContractChartTopLevelComponentType>
}

export type ContractChartTopLevelComponentType = {
  totalContracts?: number,
}

export type DashboardContextType = {
  user: UserResponseType | null,
}