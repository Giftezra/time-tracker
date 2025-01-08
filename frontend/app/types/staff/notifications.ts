export type NotificationType = {
    id: number
    title: string
    description: string
    time: string
    isRead: boolean
}

export type NotificationProviderType={
    notifications: NotificationType[];
    toggleReadStatus: (id: number) => void;
    clearAllNotifications: () => void;
    handleReadPress: () => void;
    handleUnreadPress: () => void;
    handleAllPress: () => void;
}