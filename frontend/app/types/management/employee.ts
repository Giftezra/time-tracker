import AlertConfig from "./AlertConfig";

export interface EmployeeAnalyticInterface extends EmployeeDetailsInterface {
  image?: any | undefined;
  department: string;
  total_hours_worked: number;
  number_of_unassigned_tasks: number;
  number_of_assigned_tasks: number;
  total_cancellations: number;
  total_number_of_project_completed: number;
}

export interface EmployeeDetailsInterface {
  id?: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  date_hired: string;
  is_active: boolean;
  dob?: string;
}

export interface NewEmployeeInterface {
  first_name?: string;
  last_name?: string;
  email?: string;
  phone?: string;
  dob?: string;
  role?: string;
  password?: string;
  address?: string;
  city?: string;
  postcode?: string;
  country?: string;
}

export interface EmployeeType {
  employee_name: string;
  employee_id: string;
}

export default interface EmployeeContextType {
  newEmployee: NewEmployeeInterface | undefined;
  handleAddEmployeeInput: (key: string, value: string) => void;
  onboardNemEmployee: () => Promise<void>;
  error: NewEmployeeInterface | undefined;
  isLoading: boolean;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  employeelist: EmployeeDetailsInterface[] | undefined;
  setEmployeeId: (id: string) => void;
  taskDetails: TaskDetailsProps | undefined;
  workLog: WorklogInterface | undefined;
  employeeData: EmployeeDetailsInterface | undefined;
  clearData: () => void;
  startShift: (shiftId: string) => Promise<void>;
  endShift: (shiftId: string) => Promise<void>;
  shiftError: string | undefined;
  retrieveEmployeeWithId: (id: string) => Promise<void>;
  retrieveEmployeeTaskDetails: (id: string) => Promise<void>;
  retrieveEmployeeWorkLog: (id: string) => Promise<void>;
  isAlertVisible: boolean;
  alertConfig: AlertConfig | undefined;
  setAlertConfig: (config: AlertConfig) => void;
  setIsAlertVisible: (visible: boolean) => void;
  removeEmployee: (id: string) => Promise<void>;
}

export interface WorklogInterface {
  id?: string;
  name: string;
  task_start_date?: string;
  shift_start_time?: string;
  task_start_time?: string;
  task_end_time?: string;
  status?: string;
}

export interface TaskDetailsProps {
  total_tasks: number;
  total_selected_tasks: number;
  total_assigned_tasks: number;
  total_completed_tasks: number;
  total_cancelled_tasks: number;
}
