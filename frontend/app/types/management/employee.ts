export type EmployeeAnalyticProps = {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  dob: string;
  image: any | undefined;
  date_hired: string;
  department: string;
  number_of_hours: number;
  number_of_unassigned_tasks: number;
  number_of_assigned_tasks: number;
  total_cancellations: number;
  total_number_of_project_completed: number;
};

export type EmployeeDetailsType = {
  id: string;
  role: string;
  name: string;
  email: string;
  phone: string;
  date_hired: string;
  is_active: boolean;
};

export type Employee = {
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
};

export type EmployeeType = {
  employee_name: string;
  employee_id: string;
};

export type EmployeeContextType = {
  employees: Employee | undefined;
  handleAddEmployeeInput: (key: string, value: string) => void;
  submitEmployee: () => Promise<boolean | undefined>;
  error: Employee | undefined;
  loading: boolean;
  employeelist: EmployeeDetailsType[] | undefined;
  search: string;
  setSearch: (value: string) => void;
  filteredEmployeeList: EmployeeDetailsType[] | undefined;
  filterEmployeeList: () => void;
};
