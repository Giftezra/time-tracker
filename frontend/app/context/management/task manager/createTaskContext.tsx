import {
  useContext,
  createContext,
  useState,
  useCallback,
  useEffect,
} from "react";
import axios from "axios";

import {
  ContractListType,
  CreateTaskContextType,
} from "@/app/types/management/task";

import { BASE_URL } from "@/app/utils/urls";
import { useAuth } from "../authentication";
import { EmployeeType } from "@/app/types/management/employee";

import { loadToken } from "@/app/utils/loadData";

const ManagementTaskContext = createContext<CreateTaskContextType | undefined>(
  undefined
);

const ManagementTaskProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [selectedContract, setSeleectedContract] =
    useState<ContractListType | null>(null);
  const [employeeSelected, setEmployeeSelected] = useState<EmployeeType | null>(
    null
  );
  const [employeeList, setEmployeeList] = useState<EmployeeType[]>([]);
  const [contractList, setContractList] = useState<ContractListType[]>([]);

  const [dates, setDates] = useState<Date[]>([]);
  const [time, setTime] = useState({ hours: 0, minutes: 0 });
  const [dateVisible, setDateVisible] = useState(false);
  const [timeVisible, setTimeVisible] = useState(false);

  const [contracts, setContracts] = useState<ContractListType[]>([]);
  const [employees, setEmployees] = useState<EmployeeType[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState<boolean>(false);
  const [tok, setToken] = useState<string | null>(null);

  /**
   * Method signature is designed to get all the contracts from the user given the users token.
   * The server returns a list of only available contracts that has not been assigned to any employee.
   * @returns {Promise<ContractListType>}
   */
  const getContractList = async (): Promise<ContractListType[] | undefined> => {
    const token = await loadToken();
    try {
      const response = await fetch(`${BASE_URL}/api/get/all/contracts/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });
      /**
       * If the response status is 200, get the returnned data from the server.
       * return the data if it exists. or return an error message.
       */

      if (!response.ok) {
        const status = response.status;
        if (status === 401) {
          throw new Error("Unauthorized");
        }
      }

      const data = await response.json();

      if (!data) {
        return [];
      }

      // Return the contracts from the server
      const contracts: ContractListType[] = data.contracts;
      console.log("contracts", contracts);
      return contracts;
    } catch (error) {
      console.error("Error fetching contracts:", error);
      throw error;
    }
  };

  /**
   * Method signature is designed to get all the employees from the user given the users token.
   * The server returns a list of all employees that are available to be assigned to a task.
   * Users are filtered by the request users company associations.
   * @returns {Promise<EmployeeType[]>}
   */
  const getAvailableEmployees = async (): Promise<
    EmployeeType[] | undefined
  > => {
    const token = await loadToken();
    console.log("entered token for create task ", token);
    try {
      const response = await fetch(`${BASE_URL}/api/get/available/employees/`, {
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application / json",
        },
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 401) {
          throw new Error("Unauthorized");
        }
      }

      console.log("response", response);
      const data = await response.json();
      console.log("response", response);
      console.log("data", data);

      if (!data) {
        return [];
      }

      const employees: EmployeeType[] = data.employees;
      console.log("employees", employees);
      return employees;
    } catch (error) {
      console.error("Error fetching employees:", error);
      throw error;
    }
  };

  const onConfirmTime = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setTimeVisible(false);
      setTime({ hours, minutes });
      console.log({ hours, minutes });
    },
    [setTimeVisible]
  );

  /**
   * Method to confirm the date selected.
   * @param params is used to get the dates selected as an array
   */
  const onConfirmDate = useCallback((params: any) => {
    setDates(params.dates);
    setDateVisible(false);
    console.log("[on-change-multi]", params);
  }, []);

  const onDateDismiss = useCallback(() => {
    setDateVisible(false);
  }, [setDateVisible]);

  const onTimeDismiss = useCallback(() => {
    setTimeVisible(false);
  }, [setTimeVisible]);

  const handleDateDisplay = () => {
    setDateVisible(!dateVisible);
  };

  const handleTimeDisplay = () => {
    setTimeVisible(!timeVisible);
  };

  const value = {
    employeeList,
    contractList,
    onDateDismiss,
    onTimeDismiss,
    onConfirmDate,
    onConfirmTime,
    handleDateDisplay,
    handleTimeDisplay,
    dateVisible,
    timeVisible,
    getContractList,
    getAvailableEmployees,
  };

  return (
    <ManagementTaskContext.Provider value={value}>
      {children}
    </ManagementTaskContext.Provider>
  );
};

export const useManagementTask = () => {
  const context = useContext(ManagementTaskContext);
  if (context === undefined) {
    throw new Error(
      "useManagementTask must be used within a ManagementTaskProvider"
    );
  }
  return context;
};

export default ManagementTaskProvider;
