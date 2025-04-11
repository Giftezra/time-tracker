import * as Notifications from "expo-notifications";
import { Alert, Linking, Platform } from "react-native";
import * as Device from "expo-device";
import Constants from "expo-constants";
import { ExpoPushToken } from "expo-notifications";

// Set up notification handler
Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: true,
  }),
});

export class NotificationService {
  private static notificationListener?: Notifications.EventSubscription;
  private static responseListener?: Notifications.EventSubscription;
  static notificationStatus: string | null = null;

  static async setupNotifications() {
    console.log("[NotificationService] Starting setup...");

    if (Platform.OS === "android") {
      console.log("[NotificationService] Android platform detected");
      try {
        await Notifications.setNotificationChannelAsync("default", {
          name: "default",
          importance: Notifications.AndroidImportance.MAX,
          vibrationPattern: [0, 250, 250, 250],
          lightColor: "#FF231F7C",
        });
      } catch (error) {
        console.error(
          "[NotificationService] Error setting up Android channel:",
          error
        );
        throw new Error("Failed to set up Android notification channel");
      }
    }

    if (Platform.OS === "web") {
      console.log("[NotificationService] Web platform detected");
      throw new Error("Push notifications are not supported on web");
    }

    if (!Device.isDevice) {
      console.log("[NotificationService] Not a physical device");
      throw new Error("Must be on physical device for push notifications");
    }

    const { status: existingStatus } =
      await Notifications.getPermissionsAsync();
    console.log(
      "[NotificationService] Existing permission status:",
      existingStatus
    );
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      try {
        if (existingStatus === "denied") {
          // Direct user to app settings if previously denied
          return new Promise((resolve, reject) => {
            Alert.alert(
              "Notifications Disabled",
              "Please enable notifications in your device settings",
              [
                {
                  text: "Open Settings",
                  onPress: async () => {
                    await Linking.openSettings();
                    // Re-check permission after returning from settings
                    const { status: newStatus } =
                      await Notifications.getPermissionsAsync();
                    if (newStatus === "granted") {
                      console.log("[setupNotifications] Token: ", newStatus);
                      // const token = await this.getExpoPushToken();
                      // console.log("[setupNotifications] Token: ", token.data);
                      resolve(newStatus);
                    } else {
                      reject(new Error("Permission not granted"));
                    }
                  },
                },
                {
                  text: "Cancel",
                  onPress: () => reject(new Error("Permission not granted")),
                  style: "cancel",
                },
              ]
            );
          });
        } else {
          // Request permission if status is undetermined
          const { status } = await Notifications.requestPermissionsAsync();
          finalStatus = status;
        }
      } catch (error: any) {
        throw new Error("Failed to request permissions: " + error.message);
      }
    }

    if (finalStatus !== "granted") {
      throw new Error("Permission not granted");
    }
    this.notificationStatus = finalStatus;
    console.log(
      "[NotificationService] Setup completed with status:",
      finalStatus
    );
  }
  /**
   * Get the users expo pus notification and set them in the state.
   * @returns
   */
  static async getExpoPushToken(): Promise<ExpoPushToken> {
    console.log("[NotificationService] Getting push token...");
    const projectId = Constants.expoConfig?.extra?.eas?.projectId;
    console.log("[NotificationService] Project ID:", projectId);

    if (!projectId) {
      throw new Error("Project ID is not set in app config");
    }

    try {
      const tokenData = await Notifications.getExpoPushTokenAsync({
        projectId,
      });
      console.log("[NotificationService] Token received:", tokenData.data);
      return tokenData;
    } catch (error) {
      console.error("[NotificationService] Error getting token:", error);
      throw error;
    }
  }

  static addNotificationReceivedListener(
    callback: (notification: Notifications.Notification) => void
  ) {
    this.notificationListener =
      Notifications.addNotificationReceivedListener(callback);
    return this.notificationListener;
  }

  static addNotificationResponseReceivedListener(
    callback: (response: Notifications.NotificationResponse) => void
  ) {
    this.responseListener =
      Notifications.addNotificationResponseReceivedListener(callback);
    return this.responseListener;
  }

  static removeSubscriptions() {
    if (this.notificationListener) {
      Notifications.removeNotificationSubscription(this.notificationListener);
    }
    if (this.responseListener) {
      Notifications.removeNotificationSubscription(this.responseListener);
    }
  }
}
