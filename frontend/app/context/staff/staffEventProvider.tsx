import { useContext, createContext, useState } from "react";
import { router } from "expo-router";
import { ca } from "react-native-paper-dates";

import { EventProviderType } from "@/app/types/staff/eventType";

import { MessageComponentProps } from "@/app/types/staff/messages";

/**
 * Create a new context for the event provider.
 *
 */
const EventContext = createContext<EventProviderType | undefined>(undefined);

/**
 * Create a new context for the event provider.
 *
 */

const EventProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isClicked, setIsClicked] = useState(false);
  const [detail, setDetails] = useState<MessageComponentProps | null>({
    id: "",
    name: "",
  });

  const handlePress = (id: string, name: string) => {
    setIsClicked(true);
    setDetails({ ...detail, id, name: name });
  };

  const handleModal = () => {
    setIsModalOpen(!isModalOpen);
  };

  /**
   * Handle site details retrieval given and id value
   */
  const retrieveShiftDetails = async (id: string) => {
    const api = `https://api.example.com/shifts/${id}`;
    handleModal();
    console.log("Retrieving site details");

    // try{
    //   const response = await fetch(api, {
    //     method: 'GET',
    //     headers: {
    //       'Content-Type': 'application/json',
    //     }
    //   });

    //   const data = await response.json();

    // }catch(error){
    //   console.error('Error fetching site details', error);
    // }
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

  const value = {
    handlePress,
    handleMessageNavigation,
    handleModal,
    isClicked,
    isModalOpen,
    retrieveShiftDetails,
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
