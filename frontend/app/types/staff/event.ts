export interface EventDisplayInterface {
  id: string;
  site_name: string;
  site_address: string;
  site_postcode: string;
  start_date?: string;
  start_time: string;
  end_time: string;
  information: string;
}

export interface EventDetailsInterface {
  id?: string;
  client: string;
  site_name: string;
  site_address: string;
  site_postcode: string;
  start_time: string;
  end_time: string;
  information: string;
  pay: string;
  colleagues?: Array<{ name: string; id: string }>;
  status?: string;
}

export interface Colleague {
  name: string;
  staff_id: string;
}

export default interface EventProviderInterface {
  isClicked: boolean;
  retrieveShiftDetails: (id: string) => Promise<void>;
  assignedShifts: EventDisplayInterface[];
  shiftDetails: EventDetailsInterface | undefined;
  isLoading: boolean;
  isModalOpen: boolean;
  setIsModalOpen: (isModalOpen: boolean) => void;
  acceptShift: (id: string) => Promise<void>;
  declineShift: (id: string) => Promise<void>;
  messageColleague: (id: string, name: string) => Promise<void>;
}

export interface AgendaItem {
  [key: string]: EventDisplayInterface[];
}
