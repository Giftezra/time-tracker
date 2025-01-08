export type ConversationDetailsProps = {
  id: string;
  lastMessage: string;
  name: string;
  time: string;
}

/**
 * This type defines the methods and the properties of the message context.
 * 
 */
export type MessageContextProps = {
  isModalVisible: boolean;
  isPressed: boolean;
  handleModalVisibility: () => void;
  handlePress: (id:string, name:string) => void;
  details: MessageComponentProps;
}

export type MessageComponentProps = {
  id: string;
  name: string;
}
