import { EmployeeDetailsComponentType } from "./task";

export type ContractDetailsType = {
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

export type ClientDetail = {
  client_id: string;
  name: string;
  address: string;
  postcode: string;
  email: string;
  phone: string;
  city: string;
  country: string;
};

export type ClientDetailsType = {
  clients: ClientDetail;
  contracts: ContractDetailsType[];
};

export type ClientContextType = {
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
};

export type JobDetailsType = {
  client?: string;
  task_serial?: string;
  task_start_time?: string;
  task_end_time?: string;
  task_start_date?: Date;
  pay?: number;
  contract_name?: string;
  contract_address?: string;
  contract_postcode?: string;
  employee: EmployeeDetailsComponentType[];

};
