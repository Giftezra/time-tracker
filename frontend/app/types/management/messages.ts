// Define the message structure
export interface Message {
  id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
}

// Define the context state and methods
export default interface MessageContextType {
  messages: Message[];
  chatRooms: ChatRoomType[];
  deleteConversation: () => JSX.Element;
  markAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string, chatRoomId: string) => Promise<void>;
  sendMessage: (chatRoomId: string, content: string) => Promise<Message>;
  isSentByMe: boolean;
  connectWebSocket: (userId: string) => void;
  disconnectWebSocket: () => void;
  fetchChatRooms: () => Promise<void>;
  fetchChatHistory: (userId: string) => Promise<void>;
  activeChatRoom: ChatRoomType | undefined;
  setActiveChatRoom: (chatRoom: ChatRoomType | undefined) => void;
}

export interface ChatRoomType {
  id: string;
  lastMessage: string | null;
  name: string;
  time: string | null;
  userId: string;
}

export interface WebSocketMessage {
  message: string;
  chat_room_id: string;
  timestamp: string;
  message_id: string;
}
