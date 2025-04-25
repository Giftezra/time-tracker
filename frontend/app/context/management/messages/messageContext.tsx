import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import MessageContextInterface, {
  Message,
} from "@/app/types/management/messages";
import { useAuth } from "@/app/authentication";
import { ChatRoomType } from "@/app/types/management/messages";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { WebSocketMessage } from "@/app/types/management/messages";
import BASE_URL from "@/app/utils/urls";

// Create the context
const MessageContext = createContext<MessageContextInterface | undefined>(
  undefined
);

// Create the provider component
interface MessageProviderProps {
  children: ReactNode;
}

const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const { axiosInstance, token, setIsAlertVisible, setAlertConfig } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSentByMe, setIsSentByMe] = useState<boolean>(false);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<
    ChatRoomType | undefined
  >(undefined);
  const [isLoading, setIsLoading] = useState<boolean>(false);

  useEffect(() => {
    const fetchChatRooms = async () => {
      try {
        setIsLoading(true);
        const response = await axiosInstance.get("/api/chat-rooms/");
        setChatRooms(response.data.chat_rooms);
        console.log("chatRooms", response.data.chat_rooms);
      } catch (error) {
        console.error("Error fetching chat rooms:", error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchChatRooms();
  }, []);

  /**
   * Call the server side code using the axios instance to fetch the chat rooms from the database.
   * The chat room where the request user is a participant is fetched from the database and the response is stored in the chatRooms state
   * @returns
   */
  const fetchChatRooms = useCallback(async () => {
    try {
      const response = await axiosInstance.get("/api/chat-rooms/");
      setChatRooms(response.data.chat_rooms);
      console.log("chatRooms", response.data.chat_rooms);
    } catch (error) {
      console.error("Error fetching chat rooms:", error);
    }
  }, []);

  /**
   * The method is used to fetch the chat history from the server.
   * The chat history is fetched from the server and the response is stored in the messages state
   * @param userId is the id of the user to fetch the chat history for
   * @returns
   */
  const fetchChatHistory = async (userId: string) => {
    try {
      const response = await axiosInstance.get(`/api/chat-history/`, {
        params: {
          user_id: userId,
        },
      });
      if (response.data.chat_history) {
        setMessages(response.data.chat_history);
      }
    } catch (error) {
      console.error("Error fetching chat history:", error);
    }
  };

  const disconnectWebSocket = () => {
    if (webSocket) {
      webSocket.close();
      setWebSocket(null);
    }
  };

  /**
   * The method is used to send a message to the server.
   * After sending the message to the server, the message is added to the messages state
   * which will be used to display the message in the message component
   * @param chatRoomId is the id of the associated chatroom
   * @param content is the message content
   * @returns
   */
  const connectWebSocket = useCallback(
    (userId: string) => {
      const baseUrl = BASE_URL().replace(/\/$/, "");
      const cleanUserId = userId.toString().trim();
      const wsUrl = `${baseUrl}/ws/dm/${cleanUserId}/?token=${token}`;

      const ws = new WebSocket(wsUrl);

      // Add reconnection logic
      const reconnectInterval = setInterval(() => {
        if (ws.readyState === WebSocket.CLOSED) {
          console.log("Attempting to reconnect...");
          setWebSocket(new WebSocket(wsUrl));
        }
      }, 5000);

      ws.onopen = async () => {
        clearInterval(reconnectInterval);
        await fetchChatHistory(cleanUserId);
      };

      ws.onerror = (error) => {
        console.error("WebSocket error:", error);
      };

      ws.onclose = () => {
        console.log("WebSocket connection closed");
        clearInterval(reconnectInterval);
      };

      // ... rest of your handler code

      setWebSocket(ws);
      return () => {
        clearInterval(reconnectInterval);
        ws.close();
      };
    },
    [token, fetchChatHistory]
  );

  /**
   * The method is used to send a message to the server.
   * After sending the message to the server, the message is added to the messages state
   * which will be used to display the message in the message component
   * @param recipientId is the id of the recipient
   * @param content is the message content
   * @returns
   */
  const sendMessage = async (
    recipientId: string,
    content: string
  ): Promise<Message> => {
    if (!webSocket) {
      throw new Error("WebSocket not connected");
    }
    webSocket.send(
      JSON.stringify({
        message: content,
      })
    );

    setIsSentByMe(true);

    // Create and return a new message object
    const newMessage: Message = {
      id: `msg_${Date.now()}_${Math.random()}`,
      content: content,
      timestamp: new Date().toISOString(),
      is_read: false,
    };

    setMessages((prev) => [...prev, newMessage]);

    return newMessage;
  };

  /**
   * The method is used to delete the message from the server.
   * After deleting the message from the server, the message is removed from the messages state
   * which will be used to display the message in the message component
   * @param messageId is the id of the message to be deleted
   * @param chatRoomId is the id of the associated chatroom
   * @returns
   */
  const deleteMessage = async (messageId: string, chatRoomId: string) => {
    setIsAlertVisible(true);
    /* Display the alert to ensure the user is aware of their actions */
    setAlertConfig({
      title: "Confirmation",
      message:
        "Are you sure you want to delete this message? This is action is irreversible.",
      isVisible: true,
      onConfirm: async () => {
        setIsAlertVisible(false);
        try {
          const response = await axiosInstance.delete(
            `/api/delete/message/`,
            {
              data: {
                message_id: messageId,
                chat_room_id: chatRoomId,
              },
            }
          );
          if (response.status === 204) {
            setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Status",
              message: response.data.message,
              onClose: () => {
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
          } else {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Status",
              message: response.data.message,
              onClose: () => {
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
          }
        } catch (error) {
          console.log("Error deleting message:", error);
        }
      },
      onClose() {
        setIsAlertVisible(false);
      },
    });
  };

  /**
   * Fires the fetch request to delete the given messge from the conversation database given the message id
   * @param chatRoomId is the id of the conversation to be deleted
   * @returns {JSX.Element} Deletes the conversation when swiped
   */
  const deleteConversation = async (chatRoomId: string) => {
    setIsAlertVisible(true);
    /* Display the alert to ensure the user is aware of their actions */
    setAlertConfig({
      title: "Confirmation",
      message: "Are you sure you want to delete this conversation? This action",
      onConfirm: async () => {
        setIsAlertVisible(false);
        try {
          const response = await axiosInstance.delete(
            `/api/delete/conversation/`,
            {
              data: {
                chat_room_id: chatRoomId,
              },
            }
          );
          if (response.status === 204) {
            setChatRooms((prev) => prev.filter((room) => room.id !== chatRoomId));
            await fetchChatRooms();
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Status",
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
              title: "Status",
              message: response.data.message,
              onConfirm() {
                setIsAlertVisible(false);
              },
              isVisible: true,
              type: "error",
            });
          }
        } catch (error) {
          console.error("Error deleting conversation:", error);
          throw error;
        }
      },
      isVisible: true,
      // Close the alert when the user clicks on the close button
      onClose: () => {
        setIsAlertVisible(false);
      },
    });
  };

  /**
   * The method is used to update the message
   * @param messageId
   * @param messageData
   * @returns
   */
  const updateMessage = async (
    messageId: string,
    messageData: Partial<Message>
  ) => {
    try {
      const response = await axiosInstance.put(
        `/api/update/message/`,
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

  const markAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? { ...message, is_read: true } : message
      )
    );
  };

  const value: MessageContextInterface = {
    messages,
    chatRooms,
    deleteConversation,
    markAsRead,
    deleteMessage,
    sendMessage,
    isSentByMe,
    connectWebSocket,
    disconnectWebSocket,
    fetchChatRooms,
    activeChatRoom,
    setActiveChatRoom,
    fetchChatHistory,
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
