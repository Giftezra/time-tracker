import {
  Employee,
  EmployeeContextType,
  EmployeeDetailsType,
} from "@/app/types/management/employee";
import { loadToken } from "@/app/utils/loadData";
import { BASE_URL } from "@/app/utils/urls";
import {
  useContext,
  createContext,
  useState,
  ReactNode,
  useEffect,
} from "react";

const EmployeeContext = createContext<EmployeeContextType | undefined>(
  undefined
);

export default function EmployeeProvider({
  children,
}: {
  children: ReactNode;
}) {
  const [employees, setEmployees] = useState<Employee>();
  const [employeelist, setEmployeeList] = useState<EmployeeDetailsType[]>();
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<Employee | undefined>(undefined);

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

  /** Use the hook to retrieve all the employess when the page loads.
   * Set the employee list to the employees state.
   */
  useEffect(() => {
    const fetchEmployees = async () => {
      setLoading(true);
      try {
        const employee_list = await getAllEmployees();
        setEmployeeList(employee_list);
      } catch (error: any) {
        console.error("Error fetching employees:", error);
        throw new Error("Failed to fetch employees");
      } finally {
        setLoading(false);
      }
    };
    fetchEmployees();
  }, []);

  /** The method is used to retrieve all of the employees associated with the user from the server.
   * Note that the server is designed to only return the employees if the request is made by an admin or the owner of the company.
   */
  const getAllEmployees = async (): Promise<
    EmployeeDetailsType[] | undefined
  > => {
    const token = await loadToken();
    // Create a request to the server
    try {
      const response = await fetch(`${BASE_URL}/api/get/employee/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      /** Check the response.
       * if ok get the data from the response.
       * check the data is valid
       */
      if (!response.ok) {
        throw new Error("Failed to get employees");
      }
      const data = await response.json();
      if (!data) {
        return [];
      }
      // Return the employees from the server
      const employee_list: EmployeeDetailsType[] = data.employees;
      return employee_list;
    } catch (error: any) {
      console.error("Error fetching employees:", error);
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
  const submitEmployee = async () => {
    // Get the token from the local storage
    const token = await loadToken();

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
      const response = await fetch(`${BASE_URL}/api/onboard/employee/`, {
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(employees),
      });

      // Check the response if ok.
      // Throw an error if the response is not ok
      if (!response.ok) {
        throw new Error("Failed to add employee");
      }
      // Get the response data to retrieve the status of the request
      const data = await response.json();
      const message = data.message;
      if (message === "Employee added successfully") {
        return true;
      }
      return false;
    } catch (error: any) {
      console.error("Error adding employee:", error);
    }
  };

  /** Method simply filters the employee list given the search params in the state */
  const value = {
    employees,
    handleAddEmployeeInput,
    submitEmployee,
    error,
    loading,
    employeelist,
    search,
    setSearch,
    filteredEmployeeList,
    filterEmployeeList,
  };

  return (
    <EmployeeContext.Provider value={value}>
      {children}
    </EmployeeContext.Provider>
  );
}

export const useEmployeeContext = () => {
  const context = useContext(EmployeeContext);
  if (!context) {
    throw new Error(
      "useEmployeeContext must be used within an EmployeeProvider"
    );
  }
  return context;
};
