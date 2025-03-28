// import * as Notifications from "expo-notifications";
// import { Alert, Platform } from "react-native";
// import * as Device from "expo-device";
// import Constants from "expo-constants";
// import { ExpoPushToken } from "expo-notifications";

// // Set up notification handler
// Notifications.setNotificationHandler({
//   handleNotification: async () => ({
//     shouldShowAlert: true,
//     shouldPlaySound: false,
//     shouldSetBadge: false,
//   }),
// });

// export class NotificationService {
//   static async setupNotifications() {
//     if (Platform.OS === "android") {
//       await Notifications.setNotificationChannelAsync("default", {
//         name: "default",
//         importance: Notifications.AndroidImportance.MAX,
//         vibrationPattern: [0, 250, 250, 250],
//         lightColor: "#FF2315",
//       });
//     }

//     if (Platform.OS === "web") {
//       throw new Error("Push notifications are not supported on web");
//     }

//     if (!Device.isDevice) {
//       throw new Error("Must be on physical device for push notifications");
//     }

//     const { status: existingStatus } =
//       await Notifications.getPermissionsAsync();
//     let finalStatus = existingStatus;

//     if (existingStatus !== "granted") {
//       const { status } = await Notifications.requestPermissionsAsync();
//       finalStatus = status;
//     }

//     if (finalStatus !== "granted") {
//       return new Promise((resolve, reject) => {
//         Alert.alert(
//           "Push Notifications",
//           "Please enable push notifications to use this app",
//           [
//             {
//               text: "Enable",
//               onPress: async () => {
//                 const { status } =
//                   await Notifications.requestPermissionsAsync();
//                 if (status === "granted") {
//                   resolve(status);
//                 } else {
//                   reject(new Error("Permission not granted"));
//                 }
//               },
//             },
//             {
//               text: "Later",
//               onPress: () => reject(new Error("Permission not granted")),
//             },
//           ]
//         );
//       });
//     }
//   }

//   static async getExpoPushToken(): Promise<ExpoPushToken> {
//     const projectId = Constants.expoConfig?.extra?.eas?.projectId;
//     if (!projectId) {
//       throw new Error("Project ID is not set");
//     }

//     const token = await Notifications.getExpoPushTokenAsync({
//       projectId,
//     });

//     return token;
//   }

//   static async saveTokenOnServer(token: ExpoPushToken): Promise<void> {
//     // Implement your server communication logic here
//     console.log("Saving token:", token);
//   }
// }
