import {
  ClientContextType,
  ClientDetailsType,
  ContractDetailsType,
  JobDetailsType,
  NewClientDetailsInterface,
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
}): React.ReactElement => {
  const { axiosInstance } = useAuth();

  const [countDown, setCountdown] = useState<string | null>(null);
  const [timeElapsed, setTimeElapsed] = useState<string>("");
  // Loading states
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUpdateContractLoading, setIsUpdateContractLoading] =
    useState<boolean>(false);
  const [isEditClientLoading, setIsEditClientLoading] =
    useState<boolean>(false);

  // Modal visibility states
  const [isCreateContractModalVisible, setIsCreateContractModalVisible] =
    useState<boolean>(false);
  const [isCreateClientModalVisible, setIsCreateClientModalVisible] =
    useState<boolean>(false);
  const [isEditClientModalVisible, setIsEditClientModalVisible] =
    useState<boolean>(false);
  const [isEditContractModalVisible, setIsEditContractModalVisible] =
    useState<boolean>(false);
  const [isNewClientLoading, setIsNewClientLoading] = useState<boolean>(false);

  const [clientId, setClientId] = useState<string | undefined>(undefined);
  const [clientDetailsData, setClientDetailsData] = useState<
    ClientDetailsType[]
  >([]);
  const [clientJobDetailsData, setClientJobDetailsData] = useState<
    JobDetailsType[]
  >([]);
  const [newContract, setNewContract] = useState<
    ContractDetailsType | undefined
  >(undefined);

  const [activeContract, setActiveContract] = useState<
    ContractDetailsType | undefined
  >(undefined);
  const [activeClient, setActiveClient] = useState<
    ClientDetailsType | undefined
  >(undefined);

  const toggleCreateContractModal = (client_id: string | undefined) => {
    setIsCreateContractModalVisible(true);
    setClientId(client_id);
  };

  /* Set the active contract to the contract details */
  const editContract = (contract: ContractDetailsType) => {
    setActiveContract(contract);
    setIsEditContractModalVisible(true);
  };

  const editClient = (client: ClientDetailsType) => {
    setActiveClient(client);
    setIsEditClientModalVisible(true);
  };

  /**
   * The hook is used to fetch details
   * - Client contract details: would contain the details of all contracts associated with the client
   * - Contract job details: would contain the details of all jobs associated with the contract
   */
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      try {
        const clientContractDetails = await fetchClientContractDetails();
        const contractJobDetails = await fetchContractAndJobDetails();
        setClientDetailsData(clientContractDetails);
        setClientJobDetailsData(contractJobDetails);
      } catch (error) {
        console.error("Error fetching data:", error);
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
   * @param {string} client_id is the id of the client to which the contract is to be created.
   * Update the client details data if the response from the server is valid.
   * Call the fetchClientContractDetails method to update the client details data.
   */
  const createContract = async () => {
    // Ensure the new contract start date is before the end date
    if (
      newContract?.start_date &&
      newContract?.end_date &&
      new Date(newContract.start_date) > new Date(newContract.end_date)
    ) {
      Alert.alert("Error", "Start date must be before end date");
      return;
    }
    try {
      const response = await axiosInstance.post("/api/create/contract/", {
        new_contract: newContract,
        client_id: clientId,
      });
      if (response.status === 201) {
        const updatedClientDetails = await fetchClientContractDetails();
        setClientDetailsData(updatedClientDetails);
        setIsCreateContractModalVisible(false);
        Alert.alert("Success", response.data.message);
      }
    } catch (error) {
      console.error("Error creating contract", error);
    }
  };

  /**
   * Delete the contract from the server given the contract id gotten from the contract details.
   * @param {ContractDetailsType} contract is the contract details object to be deleted.
   * Update the client details data if the response from the server is valid.
   * Call the fetchClientContractDetails method to update the client details data.
   */
  const deleteContract = async (contract_id: ContractDetailsType) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete("/api/delete/contract/", {
        data: { contract_id: contract_id.contract_id },
      });
      if (response.status === 200) {
        const updatedClientDetails = await fetchClientContractDetails();
        setClientDetailsData(updatedClientDetails);
        Alert.alert("Success", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting contract:", error);
      Alert.alert("Error", "Failed to delete contract. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  /** Method is used to retrieve the client list from the server
   * which will be retrieved using the loadToken method.
   * @returns {Promise<ClientDetailsType[]>} which is the list of clients returned from the server.
   * The method will return an empty array if no valid data is returned from the server.
   */
  const fetchClientContractDetails = async (): Promise<ClientDetailsType[]> => {
    try {
      const response = await axiosInstance.get("/api/get/client/contracts/");
      const clientDetails: ClientDetailsType[] = response.data.client_details;
      return clientDetails;
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
      const response = await axiosInstance.get(
        "/api/get/contract/shifts/details/"
      );
      const contractJobDetails: JobDetailsType[] =
        response.data.client_job_list;
      return contractJobDetails;
    } catch (error) {
      console.error("Error fetching job details:", error);
      return [];
    }
  };

  /**
   *  Update the contract details on the server and update the client details data if the response from the server is valid.
   *  Call the fetchClientContractDetails method to update the client details data.
   * @param {ContractDetailsType} contract is the contract details object to be updated.
   */
  const updateContract = async (contract: ContractDetailsType) => {
    try {
      setIsUpdateContractLoading(true);
      const response = await axiosInstance.patch("/api/update/contract/", {
        contract: contract,
      });
      if (response.status === 200) {
        // Call the fetchClientContractDetails method to update the client details data.
        // This will update the client details data in the context and the client details data in the state.
        // Close the edit contract modal after the update is successful.
        const updatedClientDetails = await fetchClientContractDetails();
        setClientDetailsData(updatedClientDetails);
        setIsEditContractModalVisible(false);
      }
      Alert.alert("Contract Update Data", response.data.message);
    } catch (error) {
      console.error("Error updating contract:", error);
    } finally {
      setIsUpdateContractLoading(false);
    }
  };

  /**
   * Create a new client with the details provided in the component.
   * @param {NewClientDetailsInterface} newClientDetails is the new client details object to be created.
   * Update the client details data if the response from the server is valid.
   * Call the fetchClientContractDetails method to update the client details data.
   * Close the modal after successfull response
   */
  const createClient = async (newClientDetails: NewClientDetailsInterface) => {
    try {
      setIsNewClientLoading(true);
      const response = await axiosInstance.post("/api/create/client/", {
        new_client: newClientDetails,
      });
      if (response.status === 201) {
        const updatedClientDetails = await fetchClientContractDetails();
        setClientDetailsData(updatedClientDetails);
        setIsCreateClientModalVisible(false);
        Alert.alert("Success", response.data.message);
      }
    } catch (error) {
      console.error("Error creating client", error);
    } finally {
      setIsNewClientLoading(false);
    }
  };

  /**
   * Update the client details on the server and update the client details data if the response from the server is valid.
   * Call the fetchClientContractDetails method to update the client details data.
   * @param {ClientDetailsType} client is the client details object to be updated.
   * Call the fetchClientContractDetails method to update the client details data if the response from the server is valid.
   */
  const updateClient = async (client: ClientDetailsType) => {
    try {
      setIsEditClientLoading(true);
      const response = await axiosInstance.patch("/api/update/client/", {
        client: client,
      });
      if (response.status === 200) {
        const updatedClientDetails = await fetchClientContractDetails();
        setClientDetailsData(updatedClientDetails);
        setIsEditClientModalVisible(false);
      }
      Alert.alert("Client Update Data", response.data.message);
    } catch (error) {
      console.error("Error updating client:", error);
    } finally {
      setIsEditClientLoading(false);
    }
  };

  /**
   * Delete the client from the server given the client id gotten from the client details.
   * @param {string} client_id is the client id to be deleted.
   * Update the client details data if the response from the server is valid.
   * Call the fetchClientContractDetails method to update the client details data.
   */
  const deleteClient = async (client_id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.delete("/api/delete/client/", {
        data: { client_id: client_id },
      });
      if (response.status === 200) {
        const updatedClientDetails = await fetchClientContractDetails();
        setClientDetailsData(updatedClientDetails);
        const updatedJobDetails = await fetchContractAndJobDetails();
        setClientJobDetailsData(updatedJobDetails);
        Alert.alert("Success", response.data.message);
      }
    } catch (error) {
      console.error("Error deleting client:", error);
      Alert.alert("Error", "Failed to delete client. Please try again.");
    } finally {
      setIsLoading(false);
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

  /** Navigate to message component and create new conversation if none exists */
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

  /** Calculate time until task starts */
  const calculateTaskStartTime = (jobDetails: JobDetailsType): number => {
    const { task_start_date, task_start_time } = jobDetails; // Get the type required from the job details

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
    isLoading,
    clientDetailsData,
    isCreateContractModalVisible,
    toggleCreateContractModal,
    isCreateClientModalVisible,
    setIsCreateClientModalVisible,
    activeContract,
    editContract,
    isEditContractModalVisible,
    setIsEditContractModalVisible,
    deleteContract,
    updateContract,
    isUpdateContractLoading,
    editClient,
    isEditClientLoading,
    isEditClientModalVisible,
    setIsEditClientModalVisible,
    activeClient,
    updateClient,
    deleteClient,
    setIsCreateContractModalVisible,
    createClient,
    isNewClientLoading,
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
