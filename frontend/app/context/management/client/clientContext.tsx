import {
  ClientContextType,
  ClientDetailsType,
  ContractDetailsType,
  JobDetailsType,
} from "@/app/types/management/client";
import { loadToken } from "@/app/utils/loadData";
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

const ClientContext = createContext<ClientContextType | undefined>(undefined);

const ClientProvider = ({ children }: { children: ReactNode }) => {
  const [countDown, setCountdown] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<string>("");
  const [jobDetailsData, setJobDetailsData] = useState<JobDetailsType[]>([]);
  const [clientDetailsData, setClientDetailsData] = useState<
    ClientDetailsType[]
  >([]);

  // Manages the state of the user input for the contract creation
  const [newContract, setNewContract] = useState<
    ContractDetailsType | undefined
  >(undefined);

  useEffect(() => {
    const updateCountdown = () => {
      if (jobDetailsData.length === 0 || !jobDetailsData[0]) {
        setCountdown(null);
        setTimeElapsed("No job details available");
        return;
      }

      const timeDifference = calculateTaskStartTime(jobDetailsData[0]);
      if (timeDifference <= 0) {
        setTimeElapsed("Task has started");
        setCountdown(null);
        return;
      }

      const totalseconds = Math.max(timeDifference / 1000, 0);
      const hours = Math.floor(totalseconds / 3600);
      const minutes = Math.floor((totalseconds % 3600) / 60);
      const seconds = Math.floor(totalseconds % 60);
      setCountdown(`${hours}h ${minutes}m ${seconds}s`);
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);
    return () => clearInterval(interval);
  }, [jobDetailsData]);

  useEffect(() => {
    const fetchClientAndJobDetails = async () => {
      try {
        const token = await loadToken();
        const jobDetails = await fetchJobDetails(token);
        const clientDetails = await fetchClientContractDetails(token);
        setJobDetailsData(jobDetails);
        setClientDetailsData(clientDetails);
      } catch (error) {
        console.error("Error fetching details:", error);
      }
    };
    fetchClientAndJobDetails();
  }, []);

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
    const token = await loadToken();
    if (!token) {
      return;
    }

    try {
      const response = await fetch(`${BASE_URL}/api/create/contract/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(newContract),
      });
      if (!response.ok) {
        throw new Error("Error creating contract");
      }
      const responseData = await response.json();
      console.log("Contract created", responseData);
      return responseData;
    } catch (error) {
      console.error("Error creating contract", error);
    }
  };

  /** Method is used to retrieve the client list from the server
   * @params {token} string is the token used to authenticate the user
   * which will be retrieved using the loadToken method.
   * @returns {Promise<ClientDetailsType[]>} which is the list of clients returned from the server.
   */
  const fetchClientContractDetails = async (
    token: string | null
  ): Promise<ClientDetailsType[]> => {
    console.log("fetching client details", token);
    // Create a fetch request to the server to get the client list
    if (!token) {
      return [];
    }

    try {
      const response = await fetch(`${BASE_URL}/api/get/client/contracts/`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
      });
      // Check the response ok.
      // Throw error if response is not ok
      if (!response.ok) {
        throw new Error("Error fetching client details");
      }

      // Get the data from the response
      // Check the data is valid not null.
      const responseData = await response.json();
      if (!responseData) {
        throw new Error("Error fetching client details");
      }
      // Return the data
      const data: ClientDetailsType[] = responseData.client_details;
      return data;
    } catch (error) {
      console.error("Error fetching client details", error);
      return [];
    }
  };

  const fetchJobDetails = async (
    token: string | null
  ): Promise<JobDetailsType[]> => {
    console.log("fetching job details", token);
    if (!token) {
      return [];
    }
    try {
      const response = await fetch(
        `${BASE_URL}/api/get/contract/shifts/details/`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        }
      );
      if (!response.ok) {
        throw new Error("Error fetching job details");
      }

      const responseData = await response.json();
      if (!responseData) {
        throw new Error("Error fetching job details");
      }
      const data: JobDetailsType[] = responseData.client_contract_details;
      return data;
    } catch (error) {
      console.error("Error fetching job details", error);
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

  const value = {
    jobDetailsData,
    clientDetailsData,
    handlePhone,
    handleMessage,
    calculateTaskStartTime,
    countDown,
    timeElapsed,
    newContract,
    handleAddContractInput,
    createContract,
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
