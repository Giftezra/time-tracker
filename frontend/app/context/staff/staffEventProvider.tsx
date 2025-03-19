import { useContext, createContext, useState, useEffect } from "react";
import { router } from "expo-router";
import { ca } from "react-native-paper-dates";

import {
  EventDetailsInterface,
  EventDisplayInterface,
  EventProviderInterface,
} from "@/app/types/staff/event";

import { MessageComponentProps } from "@/app/types/staff/messages";
import { useAuth } from "../authentication";
import { Alert } from "react-native";

/**
 * Create a new context for the event provider.
 *
 */
const EventContext = createContext<EventProviderInterface | undefined>(
  undefined
);

/**
 * Create a new context for the event provider.
 *
 */

const EventProvider = ({ children }: { children: React.ReactNode }) => {
  // Import axiosinstance from the AuthProvider
  const { axiosInstance } = useAuth();

  const [isLoading, setIsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [detail, setDetails] = useState<MessageComponentProps | null>({
    id: "",
    name: "",
  });
  const [shiftDetails, setShiftDetails] = useState<
    EventDetailsInterface | undefined
  >(undefined);

  const [assignedShifts, setAssignedShifts] = useState<EventDisplayInterface[]>(
    []
  );

  const handlePress = (id: string, name: string) => {
    setIsClicked(true);
    setDetails({ ...detail, id, name: name });
  };

  /**
   * Load the shifts using the hook as soon as the component mounts.
   */
  useEffect(() => {
    const loadShifts = async () => {
      setIsLoading(true);
      try {
        const shifts = await fetchCalendarShifts();
        setAssignedShifts(shifts);
      } catch (error: any) {
        console.error("Error fetching shifts:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadShifts();
  }, []);

  /**
   * Method is used to handle the retrieval of the shift details from the server.
   * The method only retrieves the details and returns a promise.
   * @interface EventDetailsInterface
   * @param id : The id of the shift to be retrieved
   * @returns Promise
   */
  const retrieveShiftDetails = async (id: string) => {
    try {
      setIsLoading(true);
      const response = await axiosInstance.get("/api/get/shift/details/", {
        params: {
          shift_id: id,
        },
      });
      const shiftDetails: EventDetailsInterface = response.data.shift_details;
      setShiftDetails(shiftDetails);
    } catch (error: any) {
      console.log(error);
      setShiftDetails(undefined);
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * The method is used to accept a shift given the shift id.
   * The method uses the patch method to update the shift status on the server and also
   * uses the patch method to send the shift id to the server for update.
   * @param id : The id of the shift to be accepted
   */
  const acceptShift = async (id: string) => {
    try {
      const response = await axiosInstance.patch("/api/accept/shift/", {
        shift_id: id,
      });
      if (response.status === 200) {
        setIsModalOpen(false);
        Alert.alert("Success", "Shift accepted successfully");
        // Refresh the shifts list
        const shifts = await fetchCalendarShifts();
        setAssignedShifts(shifts);
      }
    } catch (error: any) {
      console.error("Error accepting shift:", error);
      throw error; // Propagate error to component
    }
  };

  /**
   * The method is used to decline a shift given the shift id.
   * The method uses the patch method to update the shift status on the server and also
   * uses the patch method to send the shift id to the server for update.
   * @param id : The id of the shift to be declined
   */
  const declineShift = async (id: string) => {
    try {
      const response = await axiosInstance.patch("/api/decline/shift/", {
        shift_id: id,
      });
      if (response.status === 200) {
        setIsModalOpen(false);
        Alert.alert("Success", "Shift declined successfully");
        // Refresh the shifts list
        const shifts = await fetchCalendarShifts();
        setAssignedShifts(shifts);
      }
    } catch (error: any) {
      console.log(error);
    }
  };

  /**
   * Fetch the shifts for the calendar agenda view.
   * The method is designed to fetch and return the shifts asssigned and pending to the user.
   * @returns Promise<EventDisplayInterface[]>
   */
  const fetchCalendarShifts = async () => {
    const response = await axiosInstance.get("/api/get/calendar/shifts/");
    if (response.status === 200) {
      const calendarShifts: EventDisplayInterface[] =
        response.data.calendar_data;
      return calendarShifts;
    }
    return [];
  };

  /**
   * Method takes an id and navigates to the message screen with the id.
   * Id is used to retrieve the user message conversation.
   */
  const handleMessageNavigation = () => {
    setIsClicked(false);
    setIsModalOpen(false);
    router.push({
      pathname: "/staff/(drawer)/messages/main",
      params: {
        id: detail?.id,
        name: detail?.name,
      },
    });
  };

  const value: EventProviderInterface = {
    handlePress,
    handleMessageNavigation,
    isClicked,
    isModalOpen,
    retrieveShiftDetails,
    assignedShifts,
    shiftDetails,
    isLoading,
    setIsModalOpen,
    acceptShift,
    declineShift,
  };

  return (
    <EventContext.Provider value={value}>{children}</EventContext.Provider>
  );
};

export const useEventContext = () => {
  const context = useContext(EventContext);
  if (context === undefined) {
    throw new Error("useEventContext must be used within a EventProvider");
  }
  return context;
};

export default EventProvider;
