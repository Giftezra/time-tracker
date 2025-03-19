import {
  NotificationProviderType,
  NotificationType,
} from "@/app/types/staff/notifications";
import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "../authentication";

const NotificationContext = createContext<NotificationProviderType | undefined>(
  undefined
);

/**
 * The Provider is used to handle the users notifications and provide them to the components
 */
const NotificationProvider = ({ children }: { children: React.ReactNode }) => {
  const { axiosInstance } = useAuth();
  const [expoPushToken, setExpoPushToken] = useState<string>("");

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
  ]);

  const [filteredNotifications, setFilteredNotifications] = useState<
    NotificationType[]
  >([]);

  // useEffect(() => {
  //   const initializeNotifications = async () => {
  //     try {
  //       // Get the push token
  //       const token = await NotificationService.getExpoPushToken();
  //       setExpoPushToken(token);

  //       // Send token to your backend
  //       await axiosInstance.post("/notifications/register", { token });

  //       // Set up notification listeners
  //       const cleanup = NotificationService.setNotificationListeners(
  //         // When notification received while app is in foreground
  //         (notification) => {
  //           const { title, body, data } = notification.request.content;
  //           addNotification({
  //             id: Date.now(),
  //             title: title || "",
  //             description: body || "",
  //             time: new Date().toLocaleTimeString(),
  //             isRead: false,
  //             ...data,
  //           });
  //         },
  //         // When user taps on notification
  //         (response) => {
  //           const notificationId =
  //             response.notification.request.content.data?.id;
  //           if (notificationId) {
  //             toggleReadStatus(notificationId);
  //           }
  //         }
  //       );

  //       return cleanup;
  //     } catch (error) {
  //       console.error("Error initializing notifications:", error);
  //     }
  //   };

  //   initializeNotifications();
  // }, []);

  /**
   * Filter notifications to show only read ones
   */
  const handleReadPress = () => {
    setFilteredNotifications(notifications.filter((n) => n.isRead));
  };

  /**
   * Filter notifications to show only unread ones
   */
  const handleUnreadPress = () => {
    setFilteredNotifications(notifications.filter((n) => !n.isRead));
  };

  /**
   * Show all notifications
   */
  const handleAllPress = () => {
    setFilteredNotifications(notifications);
  };

  /**
   * Toggle read status of a notification
   * @param id ID of the notification to toggle
   */
  const toggleReadStatus = (id: number) => {
    setNotifications((prevNotifications) => {
      const updatedNotifications = prevNotifications.map((notification) =>
        notification.id === id
          ? { ...notification, isRead: !notification.isRead }
          : notification
      );

      setFilteredNotifications((currentFiltered) =>
        currentFiltered.some((n) => n.id === id)
          ? updatedNotifications.filter(
              (n) =>
                n.isRead === currentFiltered[0]?.isRead ||
                currentFiltered.length === notifications.length
            )
          : currentFiltered
      );

      return updatedNotifications;
    });
  };

  const addNotification = (notification: NotificationType) => {
    setNotifications((prev) => [notification, ...prev]);
  };


  

  const value = {
    notifications:
      filteredNotifications.length > 0 ? filteredNotifications : notifications,
    toggleReadStatus,
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
