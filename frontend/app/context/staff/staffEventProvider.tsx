import { useContext, createContext, useState, useEffect } from "react";
import { router } from "expo-router";
import { ca } from "react-native-paper-dates";

import {
  EventDetailsInterface,
  EventDisplayInterface,
  EventProviderInterface,
} from "@/app/types/staff/eventType";

import { MessageComponentProps } from "@/app/types/staff/messages";
import { useAuth } from "../authentication";

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

  const [assignedShifts, setAssignedShifts] = useState<EventDisplayInterface[]>(
    []
  );

  const handlePress = (id: string, name: string) => {
    setIsClicked(true);
    setDetails({ ...detail, id, name: name });
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  /* The hook is used to retrieve the shifts assigned to the user when the page mounts */
  useEffect(() => {
    const fetchAssignedShifts = async () => {
      try {
        setIsLoading(true);
        const shifts = await retrieveAllShifts();
        setAssignedShifts(shifts);
      } catch (error: any) {
        console.log(error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchAssignedShifts();
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
      const response = await axiosInstance.get("/api/get/shift/details/", {
        params: {
          shift_id: id,
        },
      });
      const shiftDetails: EventDetailsInterface = response.data.shift_details;
      return shiftDetails;
    } catch (error: any) {
      console.log(error);
      return undefined;
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
      return response.data;
    } catch (error: any) {
      console.log(error);
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
      return response.data;
    } catch (error: any) {
      console.log(error);
    }
  };

  /**
   * This method is used to get all the shifts associated with the request user.
   *
   */
  const retrieveAllShifts = async (): Promise<EventDisplayInterface[]> => {
    try {
      const response = await axiosInstance.get("/api/get/assigned/shifts/");
      console.log(response);
      const assignedShifts: EventDisplayInterface[] = response.data.shift_data;
      return assignedShifts;
    } catch (error: any) {
      console.log(error);
      return [];
    }
  };

  /**
   * Method takes an id and navigates to the message screen with the id.
   * Id is used to retrieve the user message conversation.
   */
  const handleMessageNavigation = () => {
    setIsClicked(false);
    handleModal();
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
    handleModal,
    isClicked,
    isModalOpen,
    retrieveShiftDetails,
    assignedShifts,
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
