/**
 * The types here are used to define the structure of the types passed from the server and the client.
 * The types are used for the task manager context and other functionalities.
 */

import { EmployeeType } from "./employee";

export type ActiveTaskType = {
  shift_id: string;
  task_serial: string;
  client_name: string;
  employee: EmployeeType[];
  start_time: string;
};

export type OpenTaskContextType = {
  getUnassignedTask: () => Promise<OpenTaskProps[] | undefined>;
  filteredTask: OpenTaskProps[] | undefined;
  unassignedTask: OpenTaskProps[] | undefined;
};

export type OpenTaskProps = {
  task_id: string;
  contract_name: string;
  task_serial: string;
  contract_address: string;
  contract_postcode: string;
  task_description: string;
  task_status: string;
  task_start_date: string;
  task_end_date: string;
  created_by: string;
  task_priority: string;
  task_created_at: string;
};

export type TaskDetailsProps = {
  id: string;
  name: string;
  address: string;
  postcode: string;
  start_time: string;
  end_time: string;
  start_date: string;
  information: string;
  pay: number;
  serial: number;
};

export type EmployeeDetailsComponentType = {
  id: string;
  name: string;
  email: string;
  phone: string;
};

export type CreateTaskContextType = {
  employeeList: EmployeeType[] | undefined;
  contractList: ContractListType[] | undefined;
  onDateDismiss: () => void;
  onTimeDismiss: () => void;
  onConfirmDate: (params: any) => void;
  onConfirmTime: ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => void;
  handleDateDisplay: () => void;
  handleTimeDisplay: () => void;
  dateVisible: boolean;
  timeVisible: boolean;
  getContractList: () => Promise<ContractListType[] | undefined>;
  getAvailableEmployees: () => Promise<EmployeeType[] | undefined>;
};

export type ContractListType = {
  contract_id: string;
  contract_name: string;
  contract_address: string;
  contract_city: string;
  client_name: string;
};

export type ActiveTaskContextType = {
  gotoMessageScreen: (employee: EmployeeType) => void;
  handleIsTaskClicked: (employee: EmployeeType[]) => void;
  isModalVisible: boolean;
  isTaskClicked: boolean;
  employee: EmployeeType[] | undefined;
  hideModal: () => void;
  renderPopupButton: (id: string, onPress: () => void) => JSX.Element;
  activeTasks: ActiveTaskType[] | undefined;
  isLoading: boolean;
};
