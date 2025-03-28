import { AvailibityProviderType } from "@/app/types/staff/availability";
import {
  useContext,
  createContext,
  useState,
  useCallback,
  useMemo,
} from "react";
import { de } from "react-native-paper-dates";
import { useAuth } from "@/app/authentication";
import { MarkedDates } from "react-native-calendars/src/types";
import { Alert } from "react-native";

const AvailabilityContext = createContext<AvailibityProviderType | undefined>(
  undefined
);

const AvailabilityProvider = ({ children }: { children: React.ReactNode }) => {
  const { axiosInstance } = useAuth();

  interface MarkedDatesType {
    [key: string]: {
      startingDay: boolean;
      endingDay: boolean;
      color: string;
      textColor: string;
    };
  }

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
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});

  const handleSetMarkedDates = (date: string, value: any) => {
    setMarkedDates((prev) => ({
      ...prev,
      [date]: value,
    }));
  };

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

  /**
   * Create the users availability given the start date, end date, start time and end time.
   * Change the start date and end date to the format YYYY-MM-DD.
   * Send the request to the backend.
   */

  const createAvailability = async () => {
    // Prepare the base request data
    const formattedStartDate = startDate?.toISOString().split("T")[0];
    const formattedEndDate = endDate?.toISOString().split("T")[0];

    const requestData: any = {
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      repeat: repeatStatus,
    };

    // Only add time fields if not all day
    if (!allDay) {
      requestData.start_time = startTime;
      requestData.end_time = endTime;
    }

    // Only add note if it exists
    if (noteText) {
      requestData.note = noteText;
    }
    console.log(requestData.start_time, requestData.end_time);

    try {
      const response = await axiosInstance.post(
        "/api/create/availability/",
        requestData
      );

      if (response.status === 200) {
        Alert.alert(response.data.message);
      }
    } catch (error) {
      console.error("Failed to create availability:", error);
      Alert.alert("Error", "Failed to create availability");
    }
  };

  /**
   * Fetch the availability dates for the user.
   * Set the marked dates with the returned dates so the calendar is updated.
   */
  const fetchAvailabilityDates = async () => {
    try {
      const response = await axiosInstance.get("/api/marked/availabilities/");
      if (response.status === 200) {
        setMarkedDates(response.data.marked_dates);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const onDismiss = useCallback(() => {
    setStartDateOpen(false);
  }, [setStartDateOpen]);

  const value: AvailibityProviderType = {
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
    markedDates,
    setMarkedDates: handleSetMarkedDates,
    fetchAvailabilityDates,
    createAvailability,
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
