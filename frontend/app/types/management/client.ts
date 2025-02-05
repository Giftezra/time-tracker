import { EmployeeDetailsComponentType } from "./task";

export interface ContractDetailsType {
  contract_id?: string;

  name?: string;
  address?: string;
  postcode?: string;
  description?: string;
  city?: string;
  country?: string;
  start_date?: string;
  end_date?: string;
  information?: string;
  contract_type?: string;
};

export interface ClientDetail {
  client_id: string;
  name: string;
  address: string;
  postcode: string;
  email: string;

  phone: string;
  city: string;
  country: string;
};

export interface ClientDetailsType {
  clients: ClientDetail;
  contracts: ContractDetailsType[];
};


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
  handleAddContractInput: (key: string, value:string) => void;
  createContract: () => void;
  clients: ClientDetail[];
  isLoading: boolean;
};
  
export interface JobDetailsType {
  client?: string;
  task_serial?: string;
  task_start_time?: string;
  task_end_time?: string;
  task_start_date?: string;

  pay?: number;
  contract_name?: string;
  contract_address?: string;
  contract_postcode?: string;
  employee: EmployeeDetailsComponentType[];
};
