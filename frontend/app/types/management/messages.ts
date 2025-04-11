// Define the message structure
export interface Message {
  id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
  sender_id: string;
}

// Define the context state and methods
export interface MessageContextType {
  messages: Message[];
  chatRooms: ChatRoomType[];
  deleteConversation: () => JSX.Element;
  markAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string, chatRoomId: string) => Promise<void>;
  sendMessage: (chatRoomId: string, content: string) => Promise<Message>;
  chatDisplay: ChatRoomInterface;
  handleChatDisplay: (chatRoomId: string, recipient: string) => void;
  isSentByMe: boolean;
  connectWebSocket: (userId: string) => void;
  disconnectWebSocket: () => void;
  fetchChatRooms: () => Promise<void>;
}

export interface ChatRoomInterface {
  chatroomId: string;
  reciepient: string;
  time: string;
}

export interface ChatRoomType {
  id: string;
  lastMessage: string;
  name: string;
  time: string;
  userId: string;
}

export interface MesssageComponentInterface {
  conversation_id: string;
  reciepient: string;
  closeModal: () => void;
}

export interface WebSocketMessage {
  message: string;
  sender_id: string;
  timestamp: string;
  message_id: string;
}
