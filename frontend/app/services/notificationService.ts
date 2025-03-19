// import * as Notifications from "expo-notifications";
// import { Platform } from "react-native";
// import Constants from "expo-constants";

// /**
//  * Configuration for how notifications should be handled when the app is in the foreground
//  */
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true, // Show alert when app is in foreground
//     shouldPlaySound: true, // Play sound for notifications
//     shouldSetBadge: true, // Update app badge count
//   }),
// });

// /**
//  * Service class to handle all notification-related functionality
//  */
// export class NotificationService {
//   /**
//    * Requests permission to send notifications
//    * @returns Promise<boolean> - Whether permission was granted
//    */
//   static async requestPermissions(): Promise<boolean> {
//     // Request permission from user
//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     // Only ask if permissions have not already been determined
//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     // Alert if permission was not granted
//     if (finalStatus !== "granted") {
//       console.log("Failed to get push token for push notification!");
//       return false;
//     }

//     return true;
//   }

//   /**
//    * Schedules a local notification
//    * @param title - The title of the notification
//    * @param body - The body text of the notification
//    * @param data - Optional data to attach to the notification
//    * @param trigger - Optional trigger for when to show the notification
//    * @returns Promise<string> - The notification identifier
//    */
//   static async scheduleNotification(
//     title: string,
//     body: string,
//     data?: any,
//     trigger?: Notifications.NotificationTriggerInput
//   ): Promise<string> {
//     return await Notifications.scheduleNotificationAsync({
//       content: {
//         title,
//         body,
//         data: data || {},
//       },
//       trigger: trigger || null, // null means show immediately
//     });
//   }

//   /**
//    * Cancels all scheduled notifications
//    */
//   static async cancelAllNotifications(): Promise<void> {
//     await Notifications.cancelAllScheduledNotificationsAsync();
//   }

//   /**
//    * Gets all scheduled notifications
//    * @returns Promise<Notifications.NotificationRequest[]>
//    */
//   static async getAllScheduledNotifications(): Promise<
//     Notifications.NotificationRequest[]
//   > {
//     return await Notifications.getAllScheduledNotificationsAsync();
//   }

//   /**
//    * Sets up notification listeners
//    * @param onNotification - Callback for when a notification is received
//    * @param onNotificationResponse - Callback for when user interacts with notification
//    * @returns Cleanup function to remove listeners
//    */
//   static setNotificationListeners(
//     onNotification?: (notification: Notifications.Notification) => void,
//     onNotificationResponse?: (
//       response: Notifications.NotificationResponse
//     ) => void
//   ) {
//     // When app receives notification while in foreground
//     const notificationListener = Notifications.addNotificationReceivedListener(
//       (notification) => {
//         onNotification?.(notification);
//       }
//     );

//     // When user taps on notification
//     const responseListener =
//       Notifications.addNotificationResponseReceivedListener((response) => {
//         onNotificationResponse?.(response);
//       });

//     // Return cleanup function
//     return () => {
//       Notifications.removeNotificationSubscription(notificationListener);
//       Notifications.removeNotificationSubscription(responseListener);
//     };
//   }

//   /**
//    * Gets the Expo push token for this device
//    * @returns Promise<string> - The push token
//    */
//   static async getExpoPushToken(): Promise<string> {
//     let token;

//     if (Platform.OS === "android") {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.HIGH,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#FF231F7C",
//       });
//     }

//     if (!Constants.isDevice) {
//       throw new Error("Must use physical device for Push Notifications");
//     }

//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== "granted") {
//       throw new Error("Failed to get push token for push notification!");
//     }

//     token = (
//       await Notifications.getExpoPushTokenAsync({
//         projectId: Constants.expoConfig?.extra?.eas?.projectId,
//       })
//     ).data;

//     return token;
//   }
// }
