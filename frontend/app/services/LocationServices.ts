import * as Location from "expo-location";
import { Alert, Linking, Platform } from "react-native";

export class LocationServices {
  static async requestLocationPermissions() {
    const { status: existingStatus } =
      await Location.getForegroundPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== "granted") {
      if (existingStatus === "denied") {
        // Direct user to app settings if previously denied
        return new Promise((resolve, reject) => {
          Alert.alert(
            "Location Access Disabled",
            "Please enable location access in your device settings",
            [
              {
                text: "Open Settings",
                onPress: async () => {
                  await Linking.openSettings();
                  // Re-check permission after returning from settings
                  const { status: newStatus } =
                    await Location.getForegroundPermissionsAsync();
                  if (newStatus === "granted") {
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
        const { status } = await Location.requestForegroundPermissionsAsync();
        finalStatus = status;
      }
    }

    if (finalStatus !== "granted") {
      throw new Error("Location permission not granted");
    }

    return finalStatus;
  }

  static async getCurrentLocation() {
    const location = await Location.getCurrentPositionAsync({
      accuracy: Location.Accuracy.Highest,
    });
    return {
      latitude: location.coords.latitude,
      longitude: location.coords.longitude,
    };
  }
}
