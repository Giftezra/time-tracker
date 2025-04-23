import AvailibityProviderInterface, {
  ErrorInterface,
  AvailabilityInterface,
  MarkedDatesType,
  DayAvailabilityInterface,
} from "@/app/types/staff/availability";
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
import day from "react-native-calendars/src/calendar/day";

const AvailabilityContext = createContext<
  AvailibityProviderInterface | undefined
>(undefined);

const AvailabilityProvider = ({ children }: { children: React.ReactNode }) => {
  const { axiosInstance, setAlertConfig, setIsAlertVisible } = useAuth();
  const [error, setError] = useState<ErrorInterface | undefined>(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [startDateOpen, setStartDateOpen] = useState<boolean>(false);
  const [endDateOpen, setEndDateOpen] = useState<boolean>(false);
  const [startTimeOpen, setStartTimeOpen] = useState<boolean>(false);
  const [endTimeOpen, setEndTimeOpen] = useState<boolean>(false);
  const [noteOpen, setNoteOpen] = useState<boolean>(false);

  const [availability, setAvailability] =
    useState<AvailabilityInterface | null>(null);
  const [repeatStatus, setRepeatStatus] = useState<string>("never");
  const [overlayVisible, setOverlayVisible] = useState<boolean>(false);
  const [markedDates, setMarkedDates] = useState<MarkedDatesType>({});
  const [dayAvailability, setDayAvailability] = useState<
    DayAvailabilityInterface | undefined
  >(undefined);
  const [showDayAvailability, setShowDayAvailability] =
    useState<boolean>(false);

  const isDateDisabled = (dateString: string, markedDates: MarkedDatesType) => {
    return !markedDates[dateString];
  };

  const handleRepeatStatus = (value: string) => {
    setRepeatStatus(value);
    setOverlayVisible(false);
    handleAvailability("repeat", value);
  };

  const onDismiss = useCallback(() => {
    setStartDateOpen(false);
  }, [setStartDateOpen]);

  const onConfirmStartDate = useCallback((params: any) => {
    handleAvailability("start_date", params.date);
    setStartDateOpen(false);
  }, []);

  const onConfirmEndDate = useCallback((params: any) => {
    handleAvailability("end_date", params.date);
    setEndDateOpen(false);
  }, []);

  /**
   * Method is used to dismiss the time modal
   */
  const onStartTimeDismiss = useCallback(() => {
    setStartTimeOpen(false);
  }, [setStartTimeOpen]);

  const onEndTimeDismiss = useCallback(() => {
    setEndTimeOpen(false);
  }, [setEndTimeOpen]);

  /**
   * Method is used to confirm the start time
   */
  const onStartTimeConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      handleAvailability("start_time", formattedTime);
      setStartTimeOpen(false);
    },
    []
  );

  /**
   * Tis method is used to confirm the end time of the user availability.
   * It uses the call
   */
  const onEndTimeConfirm = useCallback(
    ({ hours, minutes }: { hours: number; minutes: number }) => {
      const formattedTime = `${hours.toString().padStart(2, "0")}:${minutes
        .toString()
        .padStart(2, "0")}`;
      handleAvailability("end_time", formattedTime);
      setEndTimeOpen(false);
    },
    []
  );

  /**
   * Create the users availability given the start date, end date, start time and end time.
   * Change the start date and end date to the format YYYY-MM-DD.
   * Send the request to the backend.
   */

  const createAvailability = async () => {
    // Prepare the base request data
    const formattedStartDate = availability?.start_date
      ?.toISOString()
      .split("T")[0];
    const formattedEndDate = availability?.end_date
      ?.toISOString()
      .split("T")[0];

    const requestData: any = {
      start_date: formattedStartDate,
      end_date: formattedEndDate,
      repeat: repeatStatus,
      all_day: availability?.all_day,
    };

    // Only add time fields if not all day
    if (!availability?.all_day) {
      requestData.start_time = availability?.start_time;
      requestData.end_time = availability?.end_time;
    }

    // Only add note if it exists
    if (availability?.note) {
      requestData.note = availability?.note;
    }
    console.log("requestData", requestData);
    /* Display an alert to show the user the request data they want to create an availability with.
     * If they are creating an availability for all day, then the start time and end time will not be in the request data.
     * If they are not creating an availability for all day, then the start time and end time will be in the request data.
     */
    const message = `You are about to create an availability for the following dates: ${formattedStartDate} to ${formattedEndDate}.
    * The start time is ${availability?.start_time} and the end time is ${availability?.end_time}.
    * The note is ${availability?.note}.
    * The repeat status is ${repeatStatus}.
    * The all day status is ${availability?.all_day}.
    `;
    const messageAllDay = `You are about to create an availability for the following dates: ${formattedStartDate} to ${formattedEndDate}.
    * The note is ${availability?.note}.
    * The repeat status is ${repeatStatus}.
    `;
    /* Display the alert to the user which will contain the message given if the user has chosen to have the availability for all day or not..
     * Close the modal and create the availability if the user confirms the request data.
     * Alert the user if the request fails or succeeds with messages from the backend.
     */
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Request Data",
      message: availability?.all_day ? messageAllDay : message,
      onConfirm: async () => {
        setIsAlertVisible(false);
        try {
          const response = await axiosInstance.post(
            "/api/create/availability/",
            requestData
          );
          // Create  a customised message to display what is returned from the backend.
          const errorMessage =
            response.data.error +
            "\n" +
            response.data.conflict_date +
            "\n" +
            response.data.conflict_time;

          const successMessage =
            response.data.message +
            "\n" +
            response.data.count +
            " availability entries created";

          if (response.status === 200) {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Success",
              message: successMessage,
              onConfirm() {
                setAvailability(null);
                setIsAlertVisible(false);
              },
              isVisible: true,
              type: "success",
            });
          } else if (response.status === 409) {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Error",
              message: errorMessage,
              onConfirm() {
                setIsAlertVisible(false);
              },
              isVisible: true,
              type: "error",
            });
          } else if (response.status === 400) {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Error",
              message: response.data.error,
              onConfirm() {
                setIsAlertVisible(false);
              },
              isVisible: true,
              type: "error",
            });
          }
        } catch (error) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Error",
            message: "Failed to create availability",
            onConfirm() {
              setIsAlertVisible(false);
            },
            isVisible: true,
            type: "error",
          });
        }
      },
      onClose() {
        setIsAlertVisible(false);
      },
      isVisible: true,
    });
  };

  /* Check that all field are filled before creating the availability */
  const handleAvailabilityCreation = () => {
    // If all day, set the error state accordingly to ensure the user provides the start and end time.
    if (!availability?.all_day) {
      // Check if the user provides the start_time and end_time
      if (
        !availability?.start_time ||
        !availability?.end_time ||
        !availability?.start_date ||
        !availability?.end_date
      ) {
        setError({
          start_date: "Start date is required",
          end_date: "End date is required",
          start_time: "Start time is required",
          end_time: "End time is required",
          repeat: "",
          note: "",
        });
        return;
      }
    } else {
      // Check if the user provides the start_date and end_date
      if (!availability?.start_date || !availability?.end_date) {
        setError({
          start_date: "Start date is required",
          end_date: "End date is required",
          start_time: "",
          end_time: "",
          repeat: "",
          note: "",
        });
        return;
      }
    }
    // Check if the start date is after the end date
    // Alert the user if it is
    if (availability?.start_date >= availability?.end_date) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: "Start date cannot be after end date",
        onConfirm() {
          setIsAlertVisible(false);
        },
        isVisible: true,
        type: "error",
      });
    }

    // Check if the start date ot end date is less than the current date
    // Alert the user if it is
    if (
      availability?.start_date < new Date() ||
      availability?.end_date < new Date()
    ) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: "Start date or end date cannot be in the past",
        onConfirm() {
          setIsAlertVisible(false);
        },
        isVisible: true,
        type: "error",
      });
    }

    // Check if start time is after end time - only check when dates are the same
    if (
      !availability?.all_day &&
      availability?.start_date &&
      availability?.end_date &&
      availability?.start_date.toDateString() ===
        availability?.end_date.toDateString() &&
      availability?.start_time >= availability?.end_time
    ) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: "Start time cannot be after end time on the same day",
        onConfirm() {
          setIsAlertVisible(false);
        },
        isVisible: true,
        type: "error",
      });
    }
    createAvailability();
  };

  /**
   * Fetch the availability dates for the user.
   * Set the marked dates with the returned dates so the calendar is updated.
   */
  const processMarkedDates = (dates: any) => {
    const newMarkedDates: MarkedDatesType = {};

    // Mark unavailable days from backend
    Object.keys(dates).forEach((dateStr) => {
      newMarkedDates[dateStr] = {
        ...dates[dateStr],
        disabled: false, // Make marked dates interactive
      };
    });

    setMarkedDates(newMarkedDates);
  };

  // Update your fetchAvailabilityDates to use this processor
  const fetchAvailabilityDates = async () => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get(
        "/api/get/marked/availabilities/"
      );
      if (response.status === 200) {
        processMarkedDates(response.data.marked_dates);
      }
      // ... rest of your error handling
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  /* Handle the users ability to set the availability for the user.
   * The method takes the keys of the {AvailabilityInterface} and the value to set the key to.
   * The method then updates the availability state with the new value.
   */
  const handleAvailability = async (
    key: keyof AvailabilityInterface,
    value: any
  ) => {
    setAvailability(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        } as AvailabilityInterface)
    );
  };

  /**
   * Get the availability for a specific day.
   * @param dateString - The date to get the availability for.
   * @returns The availability for the specific day of interface DayAvailabilityInterface.
   */
  const getDayAvailability = async (dateString: string) => {
    console.log("dateString", dateString);
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/get/day/availability/", {
        params: {
          date: dateString,
        },
      });
      if (response.status === 200) {
        const formattedAvailability: DayAvailabilityInterface =
          response.data.availability;
        console.log("formattedAvailability", formattedAvailability);
        setDayAvailability(formattedAvailability);
        setShowDayAvailability(true);
      } else {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Error",
          message: response.data.error,
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Delete the availability for a specific day by the id and day.
   * @param id - The id of the availability to delete.
   * @param day - The day to delete the availability for.
   * Return a message from the backend with the appropriate status code. and display it to the user.
   */
  const deleteAvailability = async (id: number) => {
    try {
      const response = await axiosInstance.delete("/api/delete/availability/", {
        data: {
          availability_id: id,
        },
      });
      if (response.status === 200) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Success",
          message: response.data.message,
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
          type: "success",
        });
      } else {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Error",
          message: response.data.error,
          onConfirm() {
            setIsAlertVisible(false);
          },
          isVisible: true,
          type: "error",
        });
      }
    } catch (error) {
      console.log(error);
    }
  };

  const value: AvailibityProviderInterface = {
    handleRepeatStatus,
    onConfirmStartDate,
    onConfirmEndDate,
    onStartTimeDismiss,
    onEndTimeDismiss,
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
    noteOpen,
    setNoteOpen,
    repeatStatus,
    markedDates,
    setMarkedDates,
    fetchAvailabilityDates,
    handleAvailabilityCreation,
    error,
    setError,
    availability,
    handleAvailability,
    isLoading,
    isDateDisabled,
    getDayAvailability,
    deleteAvailability,
    dayAvailability,
    showDayAvailability,
    setShowDayAvailability,
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
