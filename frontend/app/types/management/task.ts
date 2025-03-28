/**
 * The types here are used to define the structure of the types passed from the server and the client.
 * The types are used for the task manager context and other functionalities.
 */

import { EmployeeType } from "./employee";

export type ResponseType = {
  message: string;
};

export interface ActiveTaskType {
  shift_id: string;
  task_serial: string;
  contract_name: string;
  employee_id: string;
  employee_name: string;
  start_time: string;
}

export interface OpenTaskProps {
  task_id?: string;
  contract_name?: string;
  task_serial?: string;
  contract_address?: string;
  contract_postcode?: string;
  task_description?: string;
  task_start_date?: string;
  task_end_date?: string;
  task_start_time?: string;
  task_end_time?: string;
  created_by?: string;
  task_created_at?: string;
}

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
}

export interface EmployeeDetailsComponentType {
  id: string;
  name: string;
  email: string;
  phone: string;
}

export interface CreateTaskInterface {
  contract_id: string;
  employee_id: string;
  task_serial?: string;
  description?: string;
  start_time: { hours: number; minutes: number };
  end_time: { hours: number; minutes: number };
  dates: Date[];
  amount: number;
}

export interface ContractListType {
  contract_id?: string;
  contract_name?: string;
  contract_address?: string;
  contract_postcode?: string;
  contract_city?: string;
  client_name?: string;
}

export interface ActiveTaskContextType {
  contractList: ContractListType[] | undefined;
  unassignedTask: OpenTaskProps[] | undefined;
  activeTasks: ActiveTaskType[] | undefined;
  employeeList: EmployeeType[] | undefined;
  gotoMessageScreen: (task: ActiveTaskType) => void;
  handleIsTaskClicked: (task: ActiveTaskType) => void;
  isModalVisible: boolean;
  isTaskClicked: boolean;
  activeTaskClicked: ActiveTaskType | undefined;
  hideModal: () => void;
  render_popup_button: (id: string, onPress: () => void) => JSX.Element;
  isLoading: boolean;
  getContractList: () => Promise<ContractListType[]>;
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
  handleDateDisplay: () => void;
  handleStartTimeDisplay: () => void;
  handleEndTimeDisplay: () => void;
  getAvailableEmployees: () => Promise<EmployeeType[] | undefined>;
  dateVisible: boolean;
  startTimeVisible: boolean;
  endTimeVisible: boolean;
  createShift: (params: CreateTaskInterface) => Promise<void>;
  create_task: (params: CreateTaskInterface) => Promise<void>;
  startTime: { hours: number; minutes: number };
  endTime: { hours: number; minutes: number };
  dates: Date[];
  collectNewTaskData: (key: keyof CreateTaskInterface, value: string) => void;
  taskData: CreateTaskInterface | undefined;
  terminateTask: (task: ActiveTaskType | undefined) => void;
  assignTaskModalVisible: boolean;
  openAssignTaskModal: (task: OpenTaskProps) => void;
  selectedTask: OpenTaskProps | null;
  closeAssignTaskModal: () => void;
  setAssignTaskModalVisible: (visible: boolean) => void;
  editTask: OpenTaskProps | null;
  isEditTaskModalVisible: boolean;
  setIsEditTaskModalVisible: (visible: boolean) => void;
  setEditTask: (task: OpenTaskProps | null) => void;
  updateTask: (task: OpenTaskProps) => Promise<ResponseType>;
  handleTaskCreation: (taskData: CreateTaskInterface) => Promise<any>;
}
