export interface EmployeeAnalyticInterface {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  image?: any | undefined;
  date_hired: string;
  department: string;
  total_hours_worked: number;
  number_of_unassigned_tasks: number;
  number_of_assigned_tasks: number;
  total_cancellations: number;
  total_number_of_project_completed: number;

}

export interface EmployeeDetailsType {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  date_hired: string;
  is_active: boolean;
  dob?: string;
}

export interface Employee {
  first_name?: string;
  last_name?: string;
  email?: string;
  phoneNumber?: string;
  dob?: string;
  id_type?: string | null;
  id_front?: any | null;
  id_back?: any | null;
  role?: string;
  password?: string;
  employmentType?: string;
}

export interface EmployeeType {
  employee_name: string;
  employee_id: string;
}

export interface EmployeeContextType {
  employees: Employee | undefined;
  handleAddEmployeeInput: (key: string, value: string) => void;
  submitEmployee: () => Promise<boolean | undefined>;
  error: Employee | undefined;
  isLoading: boolean;
  isModalVisible: boolean;
  setIsModalVisible: (value: boolean) => void;
  employeelist: EmployeeDetailsType[] | undefined;
  search: string;
  setSearch: (value: string) => void;
  filteredEmployeeList: EmployeeDetailsType[] | undefined;
  filterEmployeeList: () => void;
  setEmployeeId: (id: string) => void;
  taskDetails: TaskDetailsProps ;
  workLog: WorklogInterface ;
  employeeData: EmployeeOverviewInterface;
  clearData: () => void;
  startShift: (shiftId: string) => Promise<void>;
  endShift: (shiftId: string) => Promise<void>;
  shiftError: string | undefined;
  retrieveEmployeeWithId: (id: string) => Promise<void>;
  retrieveEmployeeTaskDetails: (id: string) =>  Promise<void>;
  retrieveEmployeeWorkLog: (id: string) => Promise<void>;
}

export interface EmployeeOverviewInterface {
  role: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  date_hired: string;
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
