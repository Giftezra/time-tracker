

/**
 * This type defines the methods and the properties of the message context.
 *
 */
export interface MessageContextProps  {
  isModalVisible: boolean;
  isPressed: boolean;
  handleModalVisibility: () => void;
  handlePress: (id: string, name: string) => void;
  details: MessageComponentProps;
};

export interface MessageComponentProps  {
  id: string;
  name: string;
};
