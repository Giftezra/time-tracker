import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import { Message } from "@/app/types/management/messgaes";
import { loadToken } from "@/app/utils/loadData";
import { useAuth } from "../authentication";

interface MessageContextType {
  messages: Message[];
  sendMessage: (conversationId: string, content: string) => Promise<void>;
  deleteMessage: (messageId: string) => Promise<void>;
  fetchMessages: (conversationId: string) => Promise<void>;
}

// Create the context
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Create the provider component
interface MessageProviderProps {
  children: ReactNode;
}

const MessageProvider: React.FC<MessageProviderProps> = ({
  children,
}) => {
  const [messages, setMessages] = useState<Message[]>([]);
  const { axiosInstance } = useAuth();

  const sendMessage = async (conversationId: string, content: string) => {
    try {
      const response = await axiosInstance.post("/api/management/messages/", {
        conversationId,
        content,
      });
      setMessages((prev) => [...prev, response.data]);
      return response.data;
    } catch (error) {
      console.error("Error sending message:", error);
      throw error;
    }
  };

  const deleteMessage = async (messageId: string) => {
    try {
      await axiosInstance.delete(`/api/management/messages/${messageId}/`);
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  };

  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await axiosInstance.get("/api/management/messages/");
      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
  };

  const updateMessage = async (
    messageId: string,
    messageData: Partial<Message>
  ) => {
    try {
      const response = await axiosInstance.put(
        `/api/management/messages/${messageId}/`,
        messageData
      );
      setMessages((prev) =>
        prev.map((message) =>
          message.id === messageId ? response.data : message
        )
      );
      return response.data;
    } catch (error) {
      console.error("Error updating message:", error);
      throw error;
    }
  };

  const value = {
    messages,
    sendMessage,
    deleteMessage,
    fetchMessages,
    updateMessage,
  };

  return (
    <MessageContext.Provider value={value}>{children}</MessageContext.Provider>
  );
};

// Custom hook to use the message context
export const useMessageContext = () => {
  const context = useContext(MessageContext);
  if (context === undefined) {
    throw new Error("useMessageContext must be used within a MessageProvider");
  }
  return context;
};

export default MessageProvider;
