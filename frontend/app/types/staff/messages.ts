/**
 * This type defines the methods and the properties of the message context.
 *
 */
export interface MessageContextProps {
  isModalVisible: boolean;
  isPressed: boolean;
  handleModalVisibility: () => void;
  handlePress: (id: string, name: string) => void;
  details: MessageComponentProps;
}

export interface MessageComponentProps {
  id: string;
  name: string;
}

export interface Message {
  id: string;
  content: string;
  timestamp: string;
  is_read: boolean;
  sender_id: string;
}

export interface MessageContextType {
  messages: Message[];
  chatroomDetails: ChatRoomType[];
  deleteConversation: () => JSX.Element;
  markAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string, chatRoomId: string) => Promise<void>;
  sendMessage: (chatRoomId: string, content: string) => Promise<Message>;
  chatDisplay: ChatRoomInterface;
  handleChatDisplay: (chatRoomId: string, recipient: string) => void;
  isSentByMe: boolean;
  connectWebSocket: (userId: string) => void;
  disconnectWebSocket: () => void;
}

export interface WebSocketMessage {
  message: string;
  sender_id: string;
  timestamp: string;
  message_id: string;
}

export interface ChatRoomType {
  id: string;
  lastMessage: string;
  name: string;
  time: string;
}

export interface ChatRoomInterface {
  chatroomId: string;
  reciepient: string;
  time: string;
}
