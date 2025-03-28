import React, {
  createContext,
  useContext,
  useState,
  useCallback,
  useEffect,
  useRef,
} from "react";
import {
  NotificationItem,
  NotificationContextType,
} from "../../../types/management/notification";
import * as Notifications from "expo-notifications";
import { Platform } from "react-native";
import Constants from "expo-constants";
import { ExpoPushToken } from "expo-notifications";
import Device from "expo-device";

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
  const [expoPushToken, setExpoPushToken] = useState<ExpoPushToken | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);
  const [tokenRegistered, setTokenRegistered] = useState(false);
  const [channels, setChannels] = useState<Notifications.NotificationChannel[]>(
    []
  );
  const [notification, setNotification] = useState<
    Notifications.Notification | undefined
  >(undefined);
  const notificationListener = useRef<Notifications.EventSubscription>();
  const responseListener = useRef<Notifications.EventSubscription>();

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

  // useEffect(() => {
  //   const initializeNotifications = async () => {
  //     try {
  //       // Check if running on a device
  //       if (!Device.isDevice) {
  //         setError("Must use physical device for Push Notifications");
  //         return;
  //       }

  //       // Request permission first
  //       const { status: existingStatus } =
  //         await Notifications.getPermissionsAsync();
  //       let finalStatus = existingStatus;

  //       if (existingStatus !== "granted") {
  //         const { status } = await Notifications.requestPermissionsAsync();
  //         finalStatus = status;
  //       }

  //       if (finalStatus !== "granted") {
  //         setError("Failed to get push token for push notification!");
  //         return;
  //       }

  //       // Get the token
  //       const projectId = Constants.expoConfig?.extra?.eas?.projectId;
  //       if (!projectId) {
  //         setError("Project ID is not configured");
  //         return;
  //       }

  //       const token = await Notifications.getExpoPushTokenAsync({
  //         projectId: projectId,
  //       });

  //       setExpoPushToken(token);
  //       setTokenRegistered(true);

  //       // Set up notification handlers
  //       notificationListener.current =
  //         Notifications.addNotificationReceivedListener((notification) => {
  //           setNotification(notification);
  //         });

  //       responseListener.current =
  //         Notifications.addNotificationResponseReceivedListener((response) => {
  //           console.log(response);
  //         });
  //     } catch (err) {
  //       setError(err instanceof Error ? err.message : "Unknown error occurred");
  //     }
  //   };

  //   initializeNotifications();

  //   return () => {
  //     if (notificationListener.current) {
  //       Notifications.removeNotificationSubscription(
  //         notificationListener.current
  //       );
  //     }
  //     if (responseListener.current) {
  //       Notifications.removeNotificationSubscription(responseListener.current);
  //     }
  //   };
  // }, []);

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

  const value: NotificationContextType = {
    notifications,
    markAsRead,
    deleteNotification,
    clearAllNotifications,
    expoPushToken,
    error,
    tokenRegistered,
  };

  return (
    <NotificationContext.Provider value={value}>
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
