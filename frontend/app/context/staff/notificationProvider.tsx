import {
  NotificationProviderType,
  NotificationType,
} from "@/app/types/staff/notifications";
import { useContext, createContext, useState } from "react";
import { BASE_URL } from "@/app/utils/urls";
import { loadToken } from "@/app/utils/loadData";

const NotificationContext = createContext<NotificationProviderType | undefined>(
  undefined
);

/**
 * The Provider is used to handle the users notifications and provide them to the components
 */
const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const [notifications, setNotifications] = useState<NotificationType[]>([
    {
      id: 1,
      title: "Notification 1",
      description: "This is the first notification",
      time: "10:00",
      isRead: false,
    },
    {
      id: 2,
      title: "Notification 2",
      description: "This is the second notification",
      time: "10:10",
      isRead: false,
    },
    {
      id: 3,
      title: "Notification 3",
      description: "This is the third notification",
      time: "10:20",
      isRead: false,
    },
    {
      id: 4,
      title: "Notification 4",
      description: "This is the fourth notification",
      time: "10:30",
      isRead: false,
    },
  ] as NotificationType[]);

  const [filteredNotifications, setFilteredNotifications] = useState<NotificationType[]>(notifications);

  const handleReadPress = () => {
    setNotifications(notifications.filter((n) => n.isRead));
  };

  const handleUnreadPress = () => {
    setNotifications(notifications.filter((n) => !n.isRead));
  };

  const handleAllPress = () => {
    setNotifications(notifications);
  };

  /**
   * This method is called to toggle the read status of a notification in the state.
   * @param id The id of the notification that is to be toggled
   */

  /**
   * Toggle the read status of a notification in the state.
   * @param id The id of the notification to toggle
   */
  const toggleReadStatus = (id: number) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: !notification.isRead }
          : notification
      );

      // Reapply the current filter after state update
    setFilteredNotifications((currentFilteredNotifications: NotificationType[]) =>
      currentFilteredNotifications.some((n: NotificationType) => n.id === id)
        ? updatedNotifications.filter(
          (n: NotificationType) =>
            n.isRead === currentFilteredNotifications[0]?.isRead ||
            currentFilteredNotifications.length === notifications.length
        )
        : updatedNotifications
    );

      return updatedNotifications;
    });
  };
  /**
   * This method is called to clear all the notifications from the state.
   * It also deletes all the notifications from the database.
   */
  const clearAllNotifications = async () => {
    const token = await loadToken();
    // Clear the notifications from the state
    setNotifications([]);
    // Send a request to the server to delete all the notifications
    const response = await fetch(`${BASE_URL}/api/clear/notifications/`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    // Check if the response is ok
    if (!response.ok) {
      throw new Error("Error clearing notifications");
    }

    // If the response ok, then return the data
    return response.json();
  };

  const value = {
    notifications,
    toggleReadStatus,
    clearAllNotifications,
    handleReadPress,
    handleUnreadPress,
    handleAllPress,
  };

  return (
    <NotificationContext.Provider value={value}>
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * The hook is used to create the context for the notifications
 */
export const useNotificationContext = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotificationContext must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationProvider;
