import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  ReactNode,
} from "react";
import {
  ChatRoomInterface,
  Message,
  MessageContextType,
} from "@/app/types/staff/messages";
import { useAuth } from "@/app/authentication";
import { ChatRoomType } from "@/app/types/management/messgaes";
import { Pressable } from "react-native";
import { AntDesign } from "@expo/vector-icons";
import { WebSocketMessage } from "@/app/types/staff/messages";

// Create the context
const MessageContext = createContext<MessageContextType | undefined>(undefined);

// Create the provider component
interface MessageProviderProps {
  children: ReactNode;
}

const chatroomDetails: ChatRoomType[] = [
  {
    id: "chat_001",
    lastMessage: "Could you review the latest project proposal?",
    name: "Sarah Parker",
    time: "09:45",
  },
  {
    id: "chat_002",
    lastMessage: "The client meeting is scheduled for tomorrow at 2 PM",
    name: "John Mitchell",
    time: "09:32",
  },
  {
    id: "chat_003",
    lastMessage: "I've updated the design files in Figma",
    name: "Emma Watson",
    time: "09:15",
  },
  {
    id: "chat_004",
    lastMessage: "Thanks for the quick response!",
    name: "Michael Chen",
    time: "Yesterday",
  },
  {
    id: "chat_005",
    lastMessage: "The sprint planning meeting notes are ready",
    name: "Lisa Rodriguez",
    time: "Yesterday",
  },
  {
    id: "chat_006",
    lastMessage: "Can we discuss the budget revisions?",
    name: "David Kim",
    time: "Yesterday",
  },
  {
    id: "chat_007",
    lastMessage: "All unit tests are passing now",
    name: "Alex Thompson",
    time: "Monday",
  },
  {
    id: "chat_008",
    lastMessage: "New feature deployment successful",
    name: "Rachel Greene",
    time: "Monday",
  },
];

const MessageProvider: React.FC<MessageProviderProps> = ({ children }) => {
  const { axiosInstance } = useAuth();

  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      content: "Hello, how are you?",
      timestamp: "2023-01-01 12:00:00",
      is_read: true,
      sender_id: "1",
    },
    {
      id: "2",
      content: "I'm good, thank you!",
      timestamp: "2023-01-01 12:01:00",
      is_read: false,
      sender_id: "2",
    },
  ]);
  const [chatDisplay, setChatDisplay] = useState<ChatRoomInterface>({
    chatroomId: "",
    reciepient: "",
    time: "",
  });

  const [isSentByMe, setIsSentByMe] = useState<boolean>(false);

  const [webSocket, setWebSocket] = useState<WebSocket | null>(null);

  /**
   * The method is used to send a message to the server.
   * After sending the message to the server, the message is added to the messages state
   * which will be used to display the message in the message component
   * @param chatRoomId is the id of the associated chatroom
   * @param content is the message content
   * @returns
   */
  const connectWebSocket = (userId: string) => {
    const ws = new WebSocket(`ws://your-server/ws/dm/${userId}/`);

    ws.onmessage = (event) => {
      const data: WebSocketMessage = JSON.parse(event.data);
      setMessages((prev) => [
        ...prev,
        {
          id: data.message_id,
          content: data.message,
          timestamp: data.timestamp,
          is_read: false,
          sender_id: data.sender_id,
        },
      ]);
    };

    ws.onclose = () => {
      console.log("WebSocket connection closed");
    };

    setWebSocket(ws);
  };

  const disconnectWebSocket = () => {
    if (webSocket) {
      webSocket.close();
      setWebSocket(null);
    }
  };

  const sendMessage = async (
    chatRoomId: string,
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
      id: Date.now().toString(), // Temporary ID until server responds
      content: content,
      timestamp: new Date().toISOString(),
      is_read: true,
      sender_id: "current_user_id", // You might want to get this from your auth context
    };

    // Update messages state
    setMessages((prev) => [...prev, newMessage]);

    return newMessage;
  };

  /**
   * Method is used to set the conversation id in the state,
   * so that is can be used to display messages associated with the chatroom
   * @param chatRoomId is the id of the chatroom
   * @param reciepient is the name of the reciepient
   */
  const handleChatDisplay = (chatRoomId: string, reciepient: string) => {
    setChatDisplay({
      chatroomId: chatRoomId,
      reciepient: reciepient,
      time: "",
    });
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
   * The method is used to fetch the messages from the server
   * @param conversationId
   * @returns
   */
  const fetchMessages = async (conversationId: string) => {
    try {
      const response = await axiosInstance.get("/api/management/messages/");

      setMessages(response.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      throw error;
    }
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
    chatroomDetails,
    deleteConversation,
    markAsRead,
    deleteMessage,
    sendMessage,
    chatDisplay,
    handleChatDisplay,
    isSentByMe,
    connectWebSocket,
    disconnectWebSocket,
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
