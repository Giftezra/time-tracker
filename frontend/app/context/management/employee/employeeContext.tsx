import {
  Employee,
  EmployeeAnalyticInterface,
  EmployeeContextType,
  EmployeeDetailsType,
  EmployeeOverviewInterface,
  TaskDetailsProps, 
  WorklogInterface,
} from "@/app/types/management/employee";
import { BASE_URL } from "@/app/utils/urls";
import {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "@/app/authentication";
import { Axios, AxiosError } from "axios";

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

const EmployeeProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  // Get the axois instance
  const { axiosInstance } = useAuth();

  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shiftError, setShiftError] = useState<string | undefined>(undefined);

  const [employees, setEmployees] = useState<Employee>();
  const [employeelist, setEmployeeList] = useState<EmployeeDetailsType[]>();
  const [error, setError] = useState<Employee | undefined>(undefined);

  // Set the employee id to the state so its accessible by all the components
  const [employeeId, setEmployeeId] = useState<string>("");
  const [employeeData, setEmployeeData] = useState<EmployeeOverviewInterface>(
    {
      role: "",
      name: "",
      email: "",
      phone: "",
      dob: "",
      date_hired: "",
    }
  );
  const [taskDetails, setTaskDetails] = useState<TaskDetailsProps>({
    total_tasks: 0,
    total_selected_tasks: 0,
    total_assigned_tasks: 0,
    total_completed_tasks: 0,
    total_cancelled_tasks: 0,
  });
  const [workLog, setWorkLog] = useState<WorklogInterface>({
    id: "",
    name: "",
    task_start_date: "",
    shift_start_time: "",
    task_start_time: "",
    task_end_time: "",
    status: "",
  });

  const [search, setSearch] = useState<string>("");
  const [filteredEmployeeList, setFilteredEmployeeList] =
    useState<EmployeeDetailsType[]>();

  const handleAddEmployeeInput = (key: string, value: string) => {
    setEmployees(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        } as Employee)
    );
  };

  /**
   * Clear all data from the state when the modal is closed.
   */
  const clearData = () => {
    setEmployeeData({
      role: "",
      name: "",
      email: "",
      phone: "",
      dob: "",
      date_hired: "",
    });
    setTaskDetails({
      total_tasks: 0,
      total_selected_tasks: 0,
      total_assigned_tasks: 0,
      total_completed_tasks: 0,
      total_cancelled_tasks: 0,
    });
    setWorkLog({
      id: "",
      name: "",
      task_start_date: "",
      shift_start_time: "",
      task_start_time: "",
      task_end_time: "",
      status: "",

    });
  };

  /**
   * Load the different methods when the employee id is set.
   * 1. Retrieve the employee analytics
   * 2. Retrieve the employee work log
   * 3. Retrieve the employee details
   */
  useEffect(() => {
    const loadData = async () => {
      if (employeeId) {
        try {
          setIsLoading(true);
          const workLogData = await retrieveEmployeeWorkLog(employeeId);
          const employeeDetails = await retrieveEmployeeWithId(employeeId);
          const taskDetails = await retrieveEmployeeTaskDetails(employeeId);
          setTaskDetails(taskDetails);
          setWorkLog(workLogData);
          setEmployeeData(employeeDetails);
        } catch (error: any) {
          console.error("Error fetching employee data:", error);
        } finally {
          setIsLoading(false);
        }
      }
    };
    loadData();
  }, [employeeId]);
  /** Use the hook to retrieve all the employess when the page loads.
   * Set the employee list to the employees state.
   */
  useEffect(() => {
    const fetchEmployees = async () => {
      setIsLoading(true);
      try {
        const employee_list = await getAllEmployees();
        setEmployeeList(employee_list);
      } catch (error: any) {
        console.error("Error fetching employees:", error);
        throw new Error("Failed to fetch employees");
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  /** The method is used to retrieve all of the employees associated with the user from the server.
   * Note that the server is designed to only return the employees if the request is made by an admin or the owner of the company.
   */
  const getAllEmployees = async (): Promise<EmployeeDetailsType[]> => {
    try {
      const response = await axiosInstance.get(
        `/api/get/employees/with/details/`
      );
      return response.data.employees;
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      throw new Error("Failed to fetch employees");
    }
  };

  const retrieveEmployeeWithId = async (id: string) => {
    try {
      const response = await axiosInstance.get(`/api/get/employee/with/id/`, {
        params: { employee_id: id },
      });
      return response.data.employee_details;
    } catch (error: any) {
      console.error("Error fetching employee details:", error);
      throw new Error("Failed to fetch employee details");
    }
  };

  /**
   * This method is used to get the details of the particular employee given the employee id.
   * @params id: string The id of the employee to be fetched.
   */
  const retrieveEmployeeTaskDetails = async (id: string) => {
    try {
      const response = await axiosInstance.get(
        "/api/get/employee/task/details/",
        {
          params: { employee_id: id },
        }
      );
      return response.data.task_details;
    } catch (error: any) {
      console.error("Error fetching employee details:", error);
      throw new Error("Failed to fetch employee details");
    }
  };

  /**
   * Retrieves the work log for a specific employee
   */
  const retrieveEmployeeWorkLog = async (id: string) => {
    try {
      const response = await axiosInstance.get("/api/get/employee/work/log/", {
        params: { employee_id: id },
      });
      return response.data.work_log;
    } catch (error: any) {
      console.error("Error fetching employee work log:", error);
      throw new Error("Failed to fetch employee work log");
    }
  };

  /**
   * Given the shift id, start the shift of a for a particular employee.
   * @params shiftId: string The id of the shift to be started.
   */
  const startShift = async (shiftId: string) => {
    try {
      const response = await axiosInstance.patch("/api/start/shift/", {
        shift_id: shiftId,
      });
      console.log(response.data.message);
      return response.data.message;
    } catch (error: any) {
      console.error("Error starting shift:", error);
      setShiftError(error.response.data.message);
    }
  };

  /**
   * Given the shift id, end the shift of a for a particular employee.
   * @params shiftId: string The id of the shift to be ended.
   */
  const endShift = async (shiftId: string) => {
    try {
      const response = await axiosInstance.patch("/api/terminate/shift/", {
        shift_id: shiftId,
      });
      console.log(response.data.message);
      return response.data.message;
    } catch (error: any) {
      console.error("Error ending shift:", error);
      setShiftError(error.response.data.message);
    }
  };

  /** Method is used to filter the employeelist given the search params.
   * If the search finds the employee given the search params, return the employee.
   * Search based on the name, email, phone and id of the employee.
   */
  const filterEmployeeList = () => {
    // Check the list is not undefined before filtering
    if (employeelist === undefined) {
      return;
    }
    setFilteredEmployeeList(
      employeelist.filter((employee) => {
        let filtered =
          employee.name.toLowerCase().includes(search.toLowerCase()) ||
          employee.email.toLowerCase().includes(search.toLowerCase()) ||
          employee.phone.toLowerCase().includes(search.toLowerCase()) ||
          employee.id.toLowerCase().includes(search.toLowerCase());
        return filtered;
      })
    );
  };

  /** This method is used to submit the employee details to the server.
   * The method uses no params but simply send the employee details stored in the states to the server.
   * The method returns a boolean value to indicate if the request was successful or not.
   */
  const onboardNemEmployee = async () => {
    /** Filter the employee data to ensure that none of the data is undefined.
     * If any of the data is undefined, return an error message that tallies with the data that is undefined.
     * Set the error state to the error message.
     */
    for (const key in employees) {
      if (employees[key as keyof Employee] === undefined) {
        setError(
          (prev) =>
            ({
              ...prev,
              [key]: `${key} is required`,
            } as Employee)
        );
        return false;
      }
    }

    try {
      const response = await axiosInstance.post(
        `${BASE_URL}/api/onboard/employee/`
      );
    } catch (error: any) {
      console.error("Error adding employee:", error);
    }
  };

  /** Method simply filters the employee list given the search params in the state */
  const value: EmployeeContextType = {
    employees,
    handleAddEmployeeInput,
    submitEmployee: onboardNemEmployee,
    error,
    isLoading,
    isModalVisible,
    setIsModalVisible,
    employeelist,
    search,
    setSearch,
    filteredEmployeeList,
    filterEmployeeList,
    setEmployeeId,
    taskDetails,
    workLog,
    employeeData,
    clearData,
    startShift,
    endShift,
    shiftError,
    retrieveEmployeeWithId,
    retrieveEmployeeTaskDetails,
    retrieveEmployeeWorkLog,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
};

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error(
      "useEmployeeContext must be used within an EmployeeProvider"
    );
  }
  return context;
};

export default EmployeeProvider;
