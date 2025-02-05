/**
 * The types here are used to define the structure of the types passed from the server and the client.
 * The types are used for the task manager context and other functionalities.
 */

import { EmployeeType } from "./employee";

export type ResponseType = {
  message:string;
}

export interface ActiveTaskType {
  shift_id: string;
  task_serial: string;
  client_name: string;
  employee: EmployeeType[];
  start_time: string;
};


export interface OpenTaskContextType {
  getUnassignedTask: () => Promise<OpenTaskProps[] | undefined>;
  filteredTask: OpenTaskProps[] | undefined;
  unassignedTask: OpenTaskProps[] | undefined;
};


export interface OpenTaskProps {
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

export interface TaskDetailsProps {
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

export interface EmployeeDetailsComponentType {
  id: string;
  name: string;
  email: string;
  phone: string;
};


export interface CreateTaskType {
  task_serial?: string;
  description?: string;
  contract_id?: string;
  employee_id?: string;
  start_time: { hours: number; minutes: number };

  end_time: { hours: number; minutes: number };
  dates: Date[];
  amount?: number;
};

export interface ContractListType {
  contract_id?: string;
  contract_name?: string;
  contract_address?: string;
  contract_postcode?: string;
  contract_city?: string;

  client_name?: string;
};

export interface ActiveTaskContextType {
  contractList: ContractListType[] | undefined;
  unassignedTask: OpenTaskProps[] | undefined;
  activeTasks: ActiveTaskType[] | undefined;
  employeeList: EmployeeType[] | undefined;
  goto_message_screen: (employee: EmployeeType) => void;

  handle_is_task_clicked: (employee: EmployeeType[]) => void;
  isModalVisible: boolean;
  isTaskClicked: boolean;
  employee: EmployeeType[] | undefined;
  hideModal: () => void;
  render_popup_button: (id: string, onPress: () => void) => JSX.Element;
  isLoading: boolean;
  get_contract_list: () => Promise<ContractListType[] | undefined>;
  onDateDismiss: () => void;
  onStartTimeDismiss: () => void;
  onEndTimeDismiss: () => void;
  onConfirmDate: (params: any) => void;
  onConfirmStartTime: ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => void;
  onConfirmEndTime: ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => void;
  handle_date_display: () => void;
  handle_time_display: () => void;
  get_available_employees: () => Promise<EmployeeType[] | undefined>;
  dateVisible: boolean;
  start_time_visible: boolean;
  endTimeVisible: boolean;
  create_shift: (params: CreateTaskType) => Promise<void>;
  create_task: (params: CreateTaskType) => Promise<void>;
  start_time: {hours: number, minutes: number};
  end_time: {hours: number, minutes: number};
  dates: Date[];
};
