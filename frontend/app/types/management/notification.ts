import { ExpoPushToken } from "expo-notifications";

export type NotificationType = "shift" | "billing" | "system" | "alert";

export interface NotificationItem {
  id: string;
  title: string;
  message: string;
  type: NotificationType;
  timestamp: Date;
  isRead: boolean;
}

export interface NotificationContextType {
  notifications: NotificationItem[];
  markAsRead: (id: string) => void;
  deleteNotification: (id: string) => void;
  clearAllNotifications: () => void;
  expoPushToken: ExpoPushToken | null;
  error: string | null;
  tokenRegistered: boolean;
}
