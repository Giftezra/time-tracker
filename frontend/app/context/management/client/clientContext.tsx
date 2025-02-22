import {
  ClientContextType,
  ClientDetail,
  ClientDetailsResponseType,
  ClientDetailsType,
  ContractDetailsType,
  JobDetailsType,
} from "@/app/types/management/client";
import { BASE_URL } from "@/app/utils/urls";

import { router } from "expo-router";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { Alert, Linking, Platform } from "react-native";
import { useAuth } from "../../authentication";
import axios from "axios";

const ClientContext = createContext<ClientContextType | undefined>(undefined);

const ClientProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const clientDetailsData: ClientDetailsType[] = [
    {
      clients: {
        client_id: "1",
        name: "John Doe",
        address: "123 Main St",
        postcode: "12345",
        email: "john.doe@example.com",
        phone: "555-1234",
        city: "Anytown",
        country: "USA",
      },
      contracts: [
        {
          contract_id: "101",
          name: "Contract A",
          address: "123 Main St",
          postcode: "12345",
          city: "Anytown",
          start_date: "2025-01-20",
          end_date: "2025-01-21",
        },
        {
          contract_id: "102",
          name: "Contract B",
          address: "456 Elm St",
          postcode: "67890",
          city: "Othertown",
          start_date: "2025-01-20",
          end_date: "2025-01-21",
        },
      ],
    },
    {
      clients: {
        client_id: "2",
        name: "Jane Smith",
        address: "456 Elm St",
        postcode: "67890",
        email: "jane.smith@example.com",
        phone: "555-5678",
        city: "Othertown",
        country: "USA",
      },
      contracts: [
        {
          contract_id: "103",
          name: "Contract C",
          address: "789 Oak St",
          postcode: "11223",
          city: "Sometown",
          start_date: "2023-03-01",
          end_date: "2023-10-31",
        },
      ],
    },
  ];

  const clientJobDetailsData: JobDetailsType[] = [
    {
      client: "Acme Corp",
      task_serial: "TS3456",
      task_start_time: "09:00",
      task_end_time: "17:00",
      task_start_date: "2025-01-20",
      pay: 15,
      contract_name: "Acme Corp Contract",
      contract_address: "123 Acme St, Springfield",
      contract_postcode: "12345",
      employee: [
        {
          name: "John Doe",
          id: "E123",
          email: "johndoe@gmail.com",
          phone: "1234567890",
        },
        {
          name: "Jane Doe",
          id: "D123",
          email: "janedoe@gmail.com",
          phone: "1234567890",
        },
      ],
    },
    {
      client: "Amberstone Corp",
      task_serial: "TS1256",
      task_start_time: "09:00",
      task_end_time: "17:00",
      task_start_date: "2025-02-20",
      pay: 15,
      contract_name: "Acme Corp Contract",
      contract_address: "123 Acme St, Springfield",
      contract_postcode: "12345",
      employee: [
        {
          name: "John Doe",
          id: "E123",
          email: "johndoe@gmail.com",
          phone: "1234567890",
        },
        {
          name: "Jane Doe",
          id: "D123",
          email: "janedoe@gmail.com",
          phone: "1234567890",
        },
      ],
    },
  ];

  const [countDown, setCountdown] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<string>("");
  const [clients, setClients] = useState<ClientDetail[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  // const [clientDetailsData, setClientContractDetails] = useState<
  //   ClientDetailsType[]
  // >([]);
  const [contractJobDetails, setContractJobDetails] = useState<
    JobDetailsType[]
  >([]);
  // const [jobDetailsData, setJobDetailsData] = useState<JobDetailsType[]>([]);
  // const [clientDetailsData, setClientDetailsData] = useState<
  //   ClientDetailsType[]
  // >([]);

  // Manages the state of the user input for the contract creation
  const [newContract, setNewContract] = useState<
    ContractDetailsType | undefined
  >(undefined);

  // Import the axios instance from the authentication context
  const { axiosInstance } = useAuth();

  /**
   * The hook is used to fetch details
   * - Client contract details: would contain the details of all contracts associated with the client
   * - Contract job details: would contain the details of all jobs associated with the contract
   * After retrieving the data, it sets the data to the appropriate state.
   */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        console.log("Fetching data");
        // const shiftDetails = await fetchContractAndJobDetails();
        const clientContractDetails = await fetchClientContractDetails();
        console.log("clientContractDetails", clientContractDetails);

        if (clientContractDetails.length === 0) {
          console.log("No client contract details returned from the server");
        }
        // setClientContractDetails(clientContractDetails);
      } catch (error) {
        console.error("Error fetching data", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, []);

  /**
   * This hook is used to update the countdown timer for the task start time.
   * The countdown timer is updated only when the jobdetail is available.
   * if no job details are available, it sets the countdown to null and set the time elapsed to "No job details available"
   */

  useEffect(() => {
    const updateCountdown = () => {
      if (clientJobDetailsData.length === 0 || !clientJobDetailsData[0]) {
        setCountdown(null);
        setTimeElapsed("No job details available");
        return;
      }

      const timeDifference = calculateTaskStartTime(clientJobDetailsData[0]);
      if (timeDifference <= 0) {
        setTimeElapsed("Task has started");
        setCountdown(null);
        return;
      }

      // Calculate the time elapsed for the tasks for the seconds and the minutes and the hours.
      const totalseconds = Math.max(timeDifference / 1000, 0);
      const hours = Math.floor(totalseconds / 3600);
      const minutes = Math.floor((totalseconds % 3600) / 60);
      const seconds = Math.floor(totalseconds % 60);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000); // Set the interval to update the countdown every second
    return () => clearInterval(interval);
  }, [clientJobDetailsData]);

  /**
   * This method is used to collect the user data input required to create a new contract.
   * @param key is the string key of the input field
   * @param value  is the value of the input field to populate the contract details
   */
  const handleAddContractInput = (key: string, value: string) => {
    setNewContract(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        } as ContractDetailsType)
    );
  };

  /**
   * The method is used to create a new contract for the client.
   * Collects the inputed data and sends it to the server.
   */
  const createContract = async () => {
    try {
      const response = await axiosInstance.post("/api/create/contract/", {
        data: {
          newContract,
        },
      });
      const responseData: ClientDetailsResponseType = response.data;
      console.log("Contract created", responseData);
      return responseData;
    } catch (error) {
      console.error("Error creating contract", error);
    }
  };

  /** Method is used to retrieve the client list from the server
   * which will be retrieved using the loadToken method.
   * @returns {Promise<ClientDetailsType[]>} which is the list of clients returned from the server.
   * The method will return an empty array if no valid data is returned from the server.
   */
  const fetchClientContractDetails = async (): Promise<ClientDetailsType[]> => {
    try {
      console.log("Fetching client contract details...");
      const response = await axiosInstance.get("/api/get/client/contracts/");
      return response.data.client_details;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        console.error("Status:", error.response?.status);
      }
      console.error("Error fetching client details:", error);
      return [];
    }
  };

  /**
   * The method is used to fetch the clients and the task details associated with the client.
   * @returns a promise of the job details type which is the list of job details returned from the server.
   */
  const fetchContractAndJobDetails = async (): Promise<JobDetailsType[]> => {
    try {
      console.log("Fetching contract and job details...");
      const response = await axiosInstance.get(
        "/api/get/contract/shifts/details/"
      );
      console.log("Response received:", response);

      if (!response.data) {
        console.log("No valid data returned from the server");
        return [];
      }

      console.log(
        "Contract job details:",
        response.data.client_contract_details
      );
      return response.data.client_contract_details;
    } catch (error) {
      if (axios.isAxiosError(error)) {
        console.error("Axios error:", error.response?.data);
        console.error("Status:", error.response?.status);
      }
      console.error("Error fetching job details:", error);
      return [];
    }
  };

  /** Method is used to handle the calling of a staff member assigned to task directly.
   * The window confirm method is used for web platforms
   * The Alert method is used for mobile platforms.
   * @param {string} phone staff nuber to be dialed outside the app
   */
  const handlePhone = (phone: string) => {
    console.log("handle phone press", phone);
    if (Platform.OS === "web") {
      const confirmCall = window.confirm(
        `Do you want to call the number? ${phone}`
      );
      if (confirmCall) {
        window.location.href = `tel:${phone}`;
      }
    } else {
      Alert.alert("Call", `Do you want to call the number? ${phone} `, [
        {
          text: "Cancel",
          onPress: () => console.log("Cancel Pressed"),
          style: "cancel",
        },
        { text: "OK", onPress: () => Linking.openURL(`tel:${phone}`) },
      ]);
    }
  };

  /** The method is used to navigate to the message component given the user id.
   * This will create a new conversation with the user id if no conversation exists.
   */
  const handleMessage = (id: string, name: string) => {
    console.log("handle message press", id);
    if (Platform.OS === "web") {
      const confirmCall = window.confirm(
        `You're about to send a message to ${name}`
      );
    }
    router.push({
      pathname: "/management/messages/main",
      params: { id: id },
    });
  };

  /** Method is used to calulate the task task time given the start date and start time.
   * @param {JobDetailsType} jobDetais which contains the type of the job details
   * @returns number
   */
  const calculateTaskStartTime = (jobDetais: JobDetailsType) => {
    const { task_start_date, task_start_time } = jobDetais; // Get the type required from the job details

    // Split the task start time into hours and minutes
    const [hours, minutes] = task_start_time
      ? task_start_time.split(":").map(Number)
      : [0, 0];
    // Set the task start date and time setting the hours and minutes to the task start date
    const taskStartDateTime = task_start_date
      ? new Date(task_start_date)
      : new Date();
    taskStartDateTime.setHours(hours, minutes);

    // Get the current time and calculate the time difference between both times
    const currentTime = new Date();
    const timeDifference = taskStartDateTime.getTime() - currentTime.getTime();
    return timeDifference > 0 ? timeDifference : 0;
  };

  const value: ClientContextType = {
    jobDetailsData: clientJobDetailsData,
    handlePhone,
    handleMessage,
    calculateTaskStartTime,
    countDown,
    timeElapsed,
    newContract,
    handleAddContractInput,
    createContract,
    clients,
    isLoading,
    clientDetailsData,
  };

  return (
    <ClientContext.Provider value={value}>{children}</ClientContext.Provider>
  );
};

export const useClientContext = () => {
  const context = useContext(ClientContext);
  if (context === undefined) {
    throw new Error("useClient must be used within a ClientProvider");
  }
  return context;
};

export default ClientProvider;
