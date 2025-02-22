

// Define the message structure
export interface Message {
  id?: string;
  content?: string;
  timestamp?: string;
  is_read?: boolean;
}

// Define the context state and methods
export interface MessageContextType {
  messages: Message[];
  markAsRead: (messageId: string) => void;
  deleteMessage: (messageId: string, chatRoomId: string) => void;
  chatroomDetails: ChatRoomType[];
  deleteConversation: () => void;
  sendMessage: (chatRoomId: string, content: string) => Promise<Message>;
  chatDisplay: ChatRoomInterface;
  handleChatDisplay: (
    chatRoomId: string,
    reciepient: string,
    time: string
  ) => void;
  isSentByMe: boolean;
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
}

export interface MesssageComponentInterface {
  conversation_id: string;
  reciepient: string;
  closeModal: () => void;
}
