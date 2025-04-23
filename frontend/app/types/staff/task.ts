/**
 * The props defines the properties of the TaskDetails component. the type will also be used in other parts of the application especially in cases that handles the calender day clieck for shifts, task, and previous tasks.
 */
export interface TaskDetailsInterface {
  id: string;
  task_serial: string | undefined;
  site_name: string | undefined;
  site_address: string | undefined;
  site_postcode: string | undefined;
  site_city: string | undefined;
  start_time: string;
  end_time: string;
  start_date: string;
  description: string | undefined;
  pay: string | undefined;
  department?: string | undefined;
}

export interface TaskInterface {
  id: string;
  site_name: string;
  site_address: string;
  site_postcode?: string;
  start_time?: string;
  end_time?: string;
  start_date?: string;
}

interface Response {
  message: string;
}

export default interface TaskProviderInterface {
  isModalVisible: boolean;
  getCompleteTaskDetails: (id: string) => Promise<void>;
  handleModalDisplay: () => void;
  markedDates: any;
  tasks: TaskInterface[];
  taskDetails: TaskDetailsInterface | undefined;
  calculateTimeDifference: () => string;
  calculateTaskStartTime: () => string;
  applyForTask: (id: string) => Promise<void>;
  handleMonthChangeEvent: (month: Date) => Promise<void>;
  handleDaySelectedEvent: (day: any) => Promise<void>;
  isDateDisabled: (dateString: string, markedDates: any) => boolean;
}
