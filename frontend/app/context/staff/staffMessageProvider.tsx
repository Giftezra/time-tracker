import { useContext, createContext, useState, useEffect } from "react";

import { MessageComponentProps, MessageContextProps } from "@/app/types/staff/messages";

const MessageContext = createContext<MessageContextProps | undefined>(
  undefined
);

const MessageProvider = ({ children }: { children: React.ReactNode }) => {
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isPressed, setIsPressed] = useState(false);
  const [details, setDetails] = useState<MessageComponentProps>({
    id: "",
    name: "",
  });

  /**
   * The useEffect enable data retrieval from the database given the id value is valid.
   *
   */
  useEffect(() => {
    if (details?.id) {
      handleMessageDetails(details.id);
    }
  }, [details?.id]);

  const handleModalVisibility = () => {
    setIsModalVisible(!isModalVisible);
    setDetails({ id: "", name: "" });
  };

  const handlePress = (id: string, name:string) => {
    setIsPressed(!isPressed);
    setIsModalVisible(!isModalVisible);
    setDetails({ ...details, id , name: name });
  };

  /**
   * With the given id, fetch the conversation details from the database.
   *
   */
  const handleMessageDetails = (id: string) => {
    // Fetch the conversation details from the database.
  };

  const value = {
    isModalVisible,
    isPressed,
    handleModalVisibility,
    handlePress,
    details,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (!context) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};

export default MessageProvider;
