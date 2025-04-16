import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
  useEffect,
} from "react";
import MessageContextType, { Message } from "@/app/types/management/messages";
import { useAuth } from "@/app/authentication";
import { ChatRoomType } from "@/app/types/management/messages";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { WebSocketMessage } from "@/app/types/management/messages";
import BASE_URL from "@/app/utils/urls";

// Create the context
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Create the provider component
interface MessageProviderProps {
  children: ReactNode;
}

const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const { axiosInstance, token } = useAuth();
  const [messages, setMessages] = useState<Message[]>([]);
  const [isSentByMe, setIsSentByMe] = useState<boolean>(false);
  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);
  const [chatRooms, setChatRooms] = useState<ChatRoomType[]>([]);
  const [activeChatRoom, setActiveChatRoom] = useState<
    ChatRoomType | undefined
  >(undefined);

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
  }, [axiosInstance]);

  useEffect(() => {
    fetchChatRooms();
  }, [fetchChatRooms]);

  /**
   * The method is used to send a message to the server.
   * After sending the message to the server, the message is added to the messages state
   * which will be used to display the message in the message component
   * @param chatRoomId is the id of the associated chatroom
   * @param content is the message content
   * @returns
   */
  const connectWebSocket = (userId: string) => {
    const baseUrl = BASE_URL().replace(/\/$/, "");
    const cleanUserId = userId.toString().trim();
    const wsUrl = `${baseUrl}/ws/dm/${cleanUserId}/?token=${token}`;
    const ws = new WebSocket(wsUrl);
    // Fetch the chat history when the WebSocket connection is opened
    ws.onopen = async () => {
      await fetchChatHistory(cleanUserId);
    };

    ws.onerror = (error) => {
      console.error("WebSocket error:", error);
    };

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        {
          id: data.message_id || `msg_${Date.now()}_${Math.random()}`,
          content: data.message,
          timestamp: data.timestamp,
          is_read: true,
        },
      ]);
      setIsSentByMe(false);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWebSocket(ws);
  };

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
    try {
      await axiosInstance.delete(`/api/management/messages/`, {
        data: {
          messageId,
          chatRoomId,
        },
      });
      setMessages((prev) => prev.filter((msg) => msg.id !== messageId));
    } catch (error) {
      console.error("Error deleting message:", error);
      throw error;
    }
  };

  /**
   * Fires the fetch request to delete the given messge from the conversation database given the message id
   * @returns {JSX.Element} Deletes the conversation when swiped
   */
  const deleteConversation = () => {
    return (
      <Pressable
        onPress={() => console.log("message deleted")}
        style={{ justifyContent: "center", padding: 5 }}
      >
        <AntDesign name="delete" size={15} color="red" />
      </Pressable>
    );
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

  const markAsRead = (messageId: string) => {
    setMessages((prev) =>
      prev.map((message) =>
        message.id === messageId ? { ...message, is_read: true } : message
      )
    );
  };

  const value: MessageContextType = {
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
