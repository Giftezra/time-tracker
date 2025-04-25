import {
  NewEmployeeInterface,
  EmployeeDetailsInterface,
  TaskDetailsProps,
  WorklogInterface,
} from "@/app/types/management/employee";
import EmployeeContextType from "@/app/types/management/employee";
import {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";
import { useAuth } from "@/app/authentication";
import AlertConfig from "@/app/types/management/AlertConfig";
import AlertComponent from "@/app/component/helper/AlertModal";
const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);
const EmployeeProvider: React.FC<{
  children: ReactNode;
}> = ({ children }) => {
  const { axiosInstance, setIsAlertVisible, setAlertConfig } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [shiftError, setShiftError] = useState<string | undefined>(undefined);
  const [newEmployee, setNewEmployee] = useState<NewEmployeeInterface>();
  const [employeelist, setEmployeeList] =
    useState<EmployeeDetailsInterface[]>();
  const [error, setError] = useState<NewEmployeeInterface | undefined>(
    undefined
  );
  const [employeeId, setEmployeeId] = useState<string>("");
  const [employeeData, setEmployeeData] = useState<
    EmployeeDetailsInterface | undefined
  >(undefined);
  const [taskDetails, setTaskDetails] = useState<TaskDetailsProps | undefined>(
    undefined
  );
  const [workLog, setWorkLog] = useState<WorklogInterface | undefined>(
    undefined
  );

  /**
   * Handle the users ability to add a new employee to the company. using the employee context.
   * @param key: string The key of the employee to be added.
   * @param value: string The value of the employee to be added.
   */
  const handleAddEmployeeInput = (key: string, value: string) => {
    setNewEmployee(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        } as NewEmployeeInterface)
    );
  };

  /* Clear the data stats when the method is called */
  const clearData = () => {
    setEmployeeData({
      id: "",
      role: "",
      name: "",
      email: "",
      phone: "",
      dob: "",
      date_hired: "",
      is_active: false,
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
          const [workLogData, employeeDetails, taskDetails] = await Promise.all([
            retrieveEmployeeWorkLog(employeeId),
            retrieveEmployeeWithId(employeeId),
            retrieveEmployeeTaskDetails(employeeId),
          ]);
          setTaskDetails(taskDetails);
          setWorkLog(workLogData);
          setEmployeeData(employeeDetails);
        } catch (error: any) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Error",
            message:
              error.response.data.message || "Failed to fetch employee data",
            onConfirm: () => {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
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
      } finally {
        setIsLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  /** The method is used to retrieve all of the employees associated with the user from the server.
   * Note that the server is designed to only return the employees if the request is made by an admin or the owner of the company.
   */
  const getAllEmployees = async (): Promise<EmployeeDetailsInterface[]> => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(`/api/get/employee/display/`);
      console.log("response", response.data.employee_list);
      return response.data.employee_list;
    } catch (error: any) {
      console.error("Error fetching employees:", error);
      throw new Error("Failed to fetch employees");
    } finally {
      setIsLoading(false);
    }
  };
  /**
   * Get the employee details given the employee id from the server.
   * @param id: string The id of the employee to be fetched.
   * @returns The employee details.
   */
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

  /** This method is used to submit the employee details to the server.
   * The method uses no params but simply send the employee details stored in the states to the server.
   * The method returns a boolean value to indicate if the request was successful or not.
   */
  const onboardNemEmployee = async () => {
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Confirmation",
      message: `You are about to onboard a new employee. with the following details: ${JSON.stringify(
        newEmployee
      )}. Do you wish to continue?`,
      onConfirm: async () => {
        setIsAlertVisible(false);
        try {
          setIsLoading(true);
          const response = await axiosInstance.post(
            `/api/onboard/employee/`,
            newEmployee
          );
          // Set the alert config to display the alert with the message from the server if the request was successful or created
          if (response.status === 200 || response.status === 201) {
            setAlertConfig({
              title: "Message",
              message: response.data.message,
              onConfirm: async () => {
                const employee_list = await getAllEmployees();
                setEmployeeList(employee_list);
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
            setIsAlertVisible(true);
            setNewEmployee(undefined);
          }
        } catch (error: any) {
          console.error(
            "Error adding employee:",
            error.response?.data || error
          );
          setAlertConfig({
            title: "Error",
            message: error.response?.data?.error || "Failed to add employee",
            onConfirm: () => {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
          setIsAlertVisible(true);
        } finally {
          setIsLoading(false);
        }
      },
      onClose: () => {
        setIsAlertVisible(false);
      },
      isVisible: true,
    });
  };

  /**
   * Remove or deactivate an employee from the company.
   * This will mean the employee data can nolonger be retrieved from the server.
   * @params id: string The id of the employee to be removed.
   */
  const removeEmployee = async (id: string) => {
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Confirmation",
      message: `You are about to remove an employee, this action is irreversible. Do you wish to continue?`,
      onConfirm: async () => {
        setIsAlertVisible(false);
        try {
          const response = await axiosInstance.delete("/api/remove/employee/", {
            params: { employee_id: id },
          });
          if (response.status === 200) {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Message",
              message: response.data.message,
              onConfirm: async () => {
                const employee_list = await getAllEmployees();
                setEmployeeList(employee_list);
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
          } else if (response.status === 400) {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Error",
              message: response.data.error,
              onConfirm: async () => {
                const employee_list = await getAllEmployees();
                setEmployeeList(employee_list);
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
          }
        } catch (error: any) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Error",
            message: error.response.data.message,
            onConfirm: () => {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
        } finally {
          setIsLoading(false);
        }
      },
      isVisible: true,
    });
  };

  /** Method simply filters the employee list given the search params in the state */
  const value: EmployeeContextType = {
    newEmployee,
    handleAddEmployeeInput,
    onboardNemEmployee,
    error,
    isLoading,
    isModalVisible,
    setIsModalVisible,
    employeelist,
    setEmployeeId,
    taskDetails,
    workLog,
    employeeData,
    clearData,
    shiftError,
    retrieveEmployeeWithId,
    retrieveEmployeeTaskDetails,
    retrieveEmployeeWorkLog,
    removeEmployee,
    setEmployeeData: async (employeeData: EmployeeDetailsInterface) => {
      setEmployeeData(employeeData);
    },
    setWorkLog: async (workLog: WorklogInterface) => {
      setWorkLog(workLog);
    },
    setTaskDetails: async (taskDetails: TaskDetailsProps) => {
      setTaskDetails(taskDetails);
    },
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
