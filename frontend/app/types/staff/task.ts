/**
 * The props defines the properties of the TaskDetails component. the type will also be used in other parts of the application especially in cases that handles the calender day clieck for shifts, task, and previous tasks.
 */
export type TaskDetailsType = {
  id: string;
  site_serial: string | undefined;
  site_name: string | undefined;
  site_address: string | undefined;
  site_postcode: string | undefined;
  site_city: string | undefined;
  start_time: string;
  end_time: string;
  start_date: string;
  information: string | undefined;
  pay: string | undefined;
  department: string | undefined;
};

export type TaskProps = {
  task_id: string;
  site_name: string;
  site_address: string;
  start_time: string;
  end_time: string;
  start_date: string;
};

type Response = {
  message: string;
};

export interface TaskProviderInterface {
  isModalVisible: boolean;
  handleTaskDetails: (id: string | null) => void;
  handleModalDisplay: () => void;
  handleDayPressEvent: (day: Date) => { date: Date; tasks: TaskProps[] };
  markedDates: any;
  setSelectedDate: (date: string) => void;
  handleStartTask: (id: string) => Promise<Response>;
  handleEndTask: (id: string) => Promise<Response>;
  handleBreakTime: (id: string) => Promise<Response>;
  tasks: TaskProps[];
  taskDetials: TaskDetailsType;
  calculateTimeDifference: () => string;
  calculateTaskStartTime: () => string;
  applyForTask: (id: string) => Promise<Response>;
}
