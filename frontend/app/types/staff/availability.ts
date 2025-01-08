export type AvailibityProviderType = {
  handleRepeatStatus: (value: string) => void;
  onConfirmStartDate: (params: any) => void;
  onConfirmEndDate: (params: any) => void;
  onTimeDimiss: () => void;
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

  overlayVisible: boolean;
  setOverlayVisible: (value: boolean) => void;

  startTime: string;
  setStartTime: (value: string) => void;

  startDate: Date | null;
  setStartDate: (value: Date | null) => void;

  endDate: Date | null;
  setEndDate: (value: Date | null) => void;

  noteText: string;
  setNoteText: (value: string) => void;

  endTime: string;
  setEndTime: (value: string) => void;

  note: boolean;
  setNote: (value: boolean) => void;

  repeatStatus: string;

  allDay: boolean;
  setAllDay: (value: boolean) => void;

  markedDates: any;
  setMarkedDates: (date: string) => void;
};

