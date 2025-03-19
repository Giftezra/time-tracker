export interface NotificationType {
    id: number
    title: string
    description: string
    time: string
    isRead: boolean
}

export interface NotificationProviderType{
    notifications: NotificationType[];
    toggleReadStatus: (id: number) => void;
    handleReadPress: () => void;
    handleUnreadPress: () => void;
    handleAllPress: () => void;
}