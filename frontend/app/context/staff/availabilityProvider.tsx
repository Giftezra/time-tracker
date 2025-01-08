import { AvailibityProviderType } from "@/app/types/staff/availability";
import {
  useContext,
  createContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { de } from "react-native-paper-dates";

const AvailabilityContext = createContext<AvailibityProviderType | undefined>(
  undefined
);

const AvailabilityProvider = ({ children }: { children: React.ReactNode }) => {
  const [startDateOpen, setStartDateOpen] = useState<boolean>(false);
  const [endDateOpen, setEndDateOpen] = useState<boolean>(false);
  const [startTimeOpen, setStartTimeOpen] = useState<boolean>(false);
  const [endTimeOpen, setEndTimeOpen] = useState<boolean>(false);

  const [startTime, setStartTime] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(null);

  const [endDate, setEndDate] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<string>("");

  const [repeatStatus, setRepeatStatus] = useState<string>("never");
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);

  const [allDay, setAllDay] = useState<boolean>(false);

  const [note, setNote] = useState<boolean>(false);
  const [noteText, setNoteText] = useState<string>("");

  const initDate = "2024-01-01";
  const [markedDate, setMarkedDates] = useState(initDate);

  const markedDates = useMemo(() => {
    return {
      [markedDate]: {
        selected: true,
        selectedColor: "red",
      },
    };
  }, [markedDate]);

  const handleRepeatStatus = (value: string) => {
    setRepeatStatus(value);
    setOverlayVisible(false);
  };

  const onConfirmStartDate = useCallback((params: any) => {
    setStartDate(params.date); // Update the selected start date
    setStartDateOpen(false); // Close the start date modal
  }, []);

  const onConfirmEndDate = useCallback((params: any) => {
    setEndDate(params.date); // Update the selected end date
    setEndDateOpen(false); // Close the end date modal
  }, []);

  /**
   * Method is used to dismiss the time modal
   */
  const onTimeDimiss = useCallback(() => {
    setStartTimeOpen(false);
  }, [setStartTimeOpen]);

  /**
   * Method is used to confirm the start time
   */
  const onStartTimeConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setStartTimeOpen(false);
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      setStartTime(formattedTime);
    },
    [setStartTimeOpen, setStartTime]
  );

  /**
   * Tis method is used to confirm the end time of the user availability.
   * It uses the call
   */
  const onEndTimeConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      setStartTimeOpen(false);
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      setEndTime(formattedTime);
    },
    [setStartTimeOpen, setStartTime]
  );

  const onDismiss = useCallback(() => {
    setStartDateOpen(false);
  }, [setStartDateOpen]);

  const value = {
    handleRepeatStatus,
    onConfirmStartDate,
    onConfirmEndDate,
    onTimeDimiss,
    onStartTimeConfirm,
    onEndTimeConfirm,
    onDismiss,
    startDateOpen,
    setStartDateOpen,
    endDateOpen,
    setEndDateOpen,
    startTimeOpen,
    setStartTimeOpen,
    endTimeOpen,
    setEndTimeOpen,
    overlayVisible,
    setOverlayVisible,
    startTime,
    setStartTime,
    startDate,
    setStartDate,
    endDate,
    setEndDate,
    endTime,
    setEndTime,
    note,
    setNote,
    noteText,
    setNoteText,
    repeatStatus,
    allDay,
    setAllDay,
    setMarkedDates,
    markedDates,
  };

  return (
    <AvailabilityContext.Provider value={value}>
      {children}
    </AvailabilityContext.Provider>
  );
};

export const useAvailability = () => {
  const context = useContext(AvailabilityContext);
  if (context === undefined) {
    throw new Error(
      "useAvailability must be used within a AvailabilityProvider"
    );
  }
  return context;
};
export default AvailabilityProvider;
