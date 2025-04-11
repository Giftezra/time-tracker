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
import { NotificationService } from "../../../services/Notification";
import { useAuth } from "@/app/authentication";

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
  const { axiosInstance } = useAuth();
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

  useEffect(() => {
    const initializeNotifications = async () => {
      console.log("[NotificationProvider] Starting initialization...");

      try {
        // Setup notifications and get token
        await NotificationService.setupNotifications();
        console.log(
          "[NotificationProvider] Setup completed, status:",
          NotificationService.notificationStatus
        );

        if (NotificationService.notificationStatus === "granted") {
          try {
            // const token = await NotificationService.getExpoPushToken();
            // console.log("[NotificationProvider] Received token:", token);
            // setExpoPushToken(token);
            // setTokenRegistered(true);
          } catch (tokenError) {
            console.error("[NotificationProvider] Token error:", tokenError);
          }
        } else {
          console.log("[NotificationProvider] Notifications not granted");
          setError("Notification permissions not granted");
        }

        // Set up notification handlers
        notificationListener.current =
          NotificationService.addNotificationReceivedListener(
            (notification) => {
              console.log(
                "[NotificationProvider] Received notification:",
                notification
              );
              setNotification(notification);
            }
          );

        responseListener.current =
          NotificationService.addNotificationResponseReceivedListener(
            (response) => {
              console.log(
                "[NotificationProvider] Notification response:",
                response
              );
            }
          );
      } catch (err) {
        const errorMessage =
          err instanceof Error ? err.message : "Unknown error occurred";
        console.error(
          "[NotificationProvider] Initialization error:",
          errorMessage
        );
        setError(errorMessage);
      }
    };

    initializeNotifications();

    return () => {
      console.log("[NotificationProvider] Cleaning up subscriptions");
      NotificationService.removeSubscriptions();
    };
  }, []);

  /**
   * Call the hook to send the token to the server for storage.
   */
  useEffect(() => {
    if (expoPushToken) {
      const sendTokenToServer = async () => {
        try {
          const response = await axiosInstance.post(
            "/api/notifications/token/",
            {
              token: expoPushToken.data,
            }
          );

          if (response.status === 200) {
            console.log("Token registered successfully");
            setTokenRegistered(true);
          }
        } catch (error) {
          console.error("Error sending token to server:", error);
          setError("Failed to register notification token");
          setTokenRegistered(false);
        }
      };

      sendTokenToServer();
    }
  }, [expoPushToken]);

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
