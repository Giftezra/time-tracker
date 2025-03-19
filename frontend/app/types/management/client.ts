import { EmployeeDetailsComponentType } from "./task";

export interface ContractDetailsType {
  contract_id?: string;
  name?: string;
  address?: string;
  postcode?: string;
  city?: string;
  start_date?: string;
  end_date?: string;
}

export interface NewClientDetailsInterface {
  name: string;
  address: string;
  postcode: string;
  email: string;
  phone: string;
  city: string;
  country: string;
}

export interface ClientDetailsType {
  client_id: string;
  name: string;
  address: string;
  postcode: string;
  email: string;
  phone: string;
  city: string;
  country: string;
  contracts: ContractDetailsType[];
}

export interface ResponseType {
  message: string;
}

export interface ClientDetailsResponseType {
  response: Promise<ResponseType>;
}

export interface ClientContextType {
  jobDetailsData: JobDetailsType[];
  clientDetailsData: ClientDetailsType[];
  handlePhone: (phone: string) => void;
  handleMessage: (id: string, name: string) => void;
  calculateTaskStartTime: (jobDetails: JobDetailsType) => number;
  countDown: string | null;
  timeElapsed: string;
  newContract: ContractDetailsType | undefined;
  handleAddContractInput: (key: string, value: string) => void;
  createContract: () => Promise<any>;  
  isLoading: boolean;
  isCreateContractModalVisible: boolean;
  toggleCreateContractModal: (client_id?: string | undefined) => void;
  isCreateClientModalVisible: boolean;
  setIsCreateClientModalVisible: (visible: boolean) => void;
  activeContract: ContractDetailsType | undefined;
  editContract: (contract: ContractDetailsType) => void;
  isEditContractModalVisible: boolean;
  setIsEditContractModalVisible: (visible: boolean) => void;
  deleteContract: (contract: ContractDetailsType) => Promise<any>;
  updateContract: (contract: ContractDetailsType) => Promise<any>;
  isUpdateContractLoading: boolean;
  editClient: (client: ClientDetailsType) => void;
  isEditClientLoading: boolean;
  isEditClientModalVisible: boolean;
  setIsEditClientModalVisible: (visible: boolean) => void;
  activeClient: ClientDetailsType | undefined;
  updateClient: (client: ClientDetailsType) => Promise<any>;
  deleteClient: (client_id: string) => Promise<any>;
  setIsCreateContractModalVisible: (visible: boolean) => void;
  createClient: (newClientDetails: NewClientDetailsInterface) => Promise<any>;
  isNewClientLoading: boolean;
}

export interface JobDetailsType {
  client_id: string;
  client_name?: string;
  task_serial?: string;
  task_start_time?: string;
  task_end_time?: string;
  task_start_date?: string;
  pay?: number;
  contract_name?: string;
  contract_address?: string;
  contract_postcode?: string;
  employee: EmployeeDetailsComponentType[];
}
