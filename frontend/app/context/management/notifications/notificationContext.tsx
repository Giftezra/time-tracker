import React, { createContext, useContext, useState, useCallback } from "react";
import {
  NotificationItem,
  NotificationContextType,
} from "../../../types/management/notification";

/**
 * Context for managing application-wide notifications
 * @default undefined
 */
const NotificationContext = createContext<NotificationContextType | undefined>(
  undefined
);

/**
 * Provider component that manages the state and operations for the notification system
 *
 * @component
 * @example
 * ```tsx
 * <NotificationProvider>
 *   <App />
 * </NotificationProvider>
 * ```
 */
const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  // Initial state with sample notifications for development
  const [notifications, setNotifications] = useState<NotificationItem[]>([
    {
      id: "1",
      title: "Shift Assignment",
      message:
        "You have been assigned to the morning shift on Monday, March 25th",
      type: "shift",
      timestamp: new Date("2024-03-20T09:00:00"),
      isRead: false,
    },
    {
      id: "2",
      title: "Billing Reminder",
      message:
        "Your monthly invoice is due in 3 days. Please complete the payment to avoid service interruption.",
      type: "billing",
      timestamp: new Date("2024-03-19T15:30:00"),
      isRead: false,
    },
    {
      id: "3",
      title: "Shift Cancelled",
      message:
        "The evening shift for March 22nd has been cancelled. Please check your updated schedule.",
      type: "alert",
      timestamp: new Date("2024-03-18T14:20:00"),
      isRead: false,
    },
  ]);

  /**
   * Adds a new notification to the beginning of the notifications list
   * @param notification - The notification object without an ID
   */
  const addNotification = useCallback(
    (notification: Omit<NotificationItem, "id">) => {
      setNotifications((prev) => [
        {
          ...notification,
          id: Date.now().toString(), // Simple ID generation
        },
        ...prev,
      ]);
    },
    []
  );

  /**
   * Marks a specific notification as read
   * @param id - The ID of the notification to mark as read
   */
  const markAsRead = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: true }
          : notification
      )
    );
  }, []);

  /**
   * Removes a specific notification from the list
   * @param id - The ID of the notification to delete
   */
  const deleteNotification = useCallback((id: string) => {
    setNotifications((prev) =>
      prev.filter((notification) => notification.id !== id)
    );
  }, []);

  /**
   * Removes all notifications from the list
   */
  const clearAllNotifications = useCallback(() => {
    setNotifications([]);
  }, []);

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        deleteNotification,
        clearAllNotifications,
      }}
    >
      {children}
    </NotificationContext.Provider>
  );
};

/**
 * Custom hook to access the notification context
 *
 * @returns {NotificationContextType} The notification context value
 * @throws {Error} If used outside of NotificationProvider
 *
 * @example
 * ```tsx
 * const { notifications, addNotification, markAsRead } = useNotifications();
 *
 * // Add a new notification
 * addNotification({
 *   title: "New Message",
 *   message: "You have a new message",
 *   type: "message",
 *   timestamp: new Date(),
 *   isRead: false
 * });
 * ```
 */
export const useNotifications = () => {
  const context = useContext(NotificationContext);
  if (context === undefined) {
    throw new Error(
      "useNotifications must be used within a NotificationProvider"
    );
  }
  return context;
};

export default NotificationProvider;
