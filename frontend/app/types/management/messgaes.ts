export type MessageProps = {
  sender_messages: string[];
  reciepient_messages: string[];
};

// Define the message structure
export interface Message {
  id: string;
  content: string;
  sender_id: string;
  recipient_id: string;
  conversation_id: string;
  timestamp: string;
  is_read: boolean;
}

// Define the context state and methods
export interface MessageContextType {
  messages: Message[];
  unreadCount: number;
  addMessage: (message: Omit<Message, "id">) => void;
  markAsRead: (messageId: number) => void;
  deleteMessage: (messageId: number) => void;
  clearAllMessages: () => void;
  getMessageById: (messageId: number) => Message | undefined;
}

export interface Conversation {
  id: string;
  participants: string[];
  last_message?: Message;
  updated_at: string;
}
