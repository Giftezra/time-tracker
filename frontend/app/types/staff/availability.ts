export default interface AvailibityProviderInterface {
  handleRepeatStatus: (value: string) => void;
  onConfirmStartDate: (params: any) => void;
  onConfirmEndDate: (params: any) => void;
  onStartTimeDismiss: () => void;
  onEndTimeDismiss: () => void;
  onStartTimeConfirm: ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => void;
  onEndTimeConfirm: ({
    hours,
    minutes,
  }: {
    hours: number;
    minutes: number;
  }) => void;
  onDismiss: () => void;
  startDateOpen: boolean;
  setStartDateOpen: (value: boolean) => void;
  endDateOpen: boolean;
  setEndDateOpen: (value: boolean) => void;
  startTimeOpen: boolean;
  setStartTimeOpen: (value: boolean) => void;
  endTimeOpen: boolean;
  setEndTimeOpen: (value: boolean) => void;
  noteOpen: boolean;
  setNoteOpen: (value: boolean) => void;
  overlayVisible: boolean;
  setOverlayVisible: (value: boolean) => void;
  repeatStatus: string;
  markedDates: any;
  setMarkedDates: (value: any) => void;
  fetchAvailabilityDates: () => void;
  handleAvailabilityCreation: () => void;
  error: ErrorInterface | undefined;
  setError: (value: ErrorInterface | undefined) => void;
  availability: AvailabilityInterface | null;
  handleAvailability: (key: keyof AvailabilityInterface, value: any) => void;
  isLoading: boolean;
  isDateDisabled: (dateString: string, markedDates: any) => boolean;
  getDayAvailability: (dateString: string) => Promise<void>;
  deleteAvailability: (id: number) => Promise<void>;
  updateAvailability: (id: number, startTime: string, endTime: string) => Promise<void>;
  dayAvailability: DayAvailabilityInterface | undefined;
  showDayAvailability: boolean;
  setShowDayAvailability: (value: boolean) => void;
}

export interface ErrorInterface {
  start_date: string;
  end_date: string;
  start_time: string;
  end_time: string;
  repeat: string;
  note: string;
}

export interface AvailabilityInterface {
  start_date: Date;
  end_date: Date;
  start_time: any;
  end_time: any;
  repeat: string;
  note: string;
  all_day: boolean;
}

export interface MarkedDatesType {
  [key: string]: {
    startingDay?: boolean;
    endingDay?: boolean;
    color?: string;
    textColor?: string;
  };
}

export interface DayAvailabilityInterface {
  id: number;
  start_time?: string;
  end_time?: string;
  all_day?: boolean;
  note?: string;
}
