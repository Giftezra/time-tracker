import {
  ProfileContextType,
  ProfileUpdateType,
} from "@/app/types/management/profile";
import { loadToken } from "@/app/utils/loadData";
import { BASE_URL } from "@/app/utils/urls";
import { useContext, createContext, useState } from "react";
import { Alert, Linking } from "react-native";
import { de } from "react-native-paper-dates";

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

/** Create a provider using the context.
 * The provider is meant to provide the context to the profile component only for consumption.
 *
 */
export default function ProfileProvider({
  children,
}: {
  children: React.ReactNode;
}) {
  const [notificationToggle, setNotificationToggle] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<ProfileUpdateType | null>(
    null
  );

  /** Handle the notification toggle to enable the user select and deselect a radio button */
  const handleToggle = (toggle: string) => {
    if (notificationToggle.includes(toggle)) {
      setNotificationToggle(
        notificationToggle.filter((item) => item !== toggle)
      );
    } else {
      setNotificationToggle([...notificationToggle, toggle]);
    }
  };

  const updateProfile = async (data: ProfileUpdateType) => {
    const token = await loadToken();
    try {
      // Send the data to the server to update the user profile
      const response = await fetch(`${BASE_URL}/api/update/profile/`, {
        method: "UPDATE",
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "application/json",
        },
      });

      /** Check the response is ok.
       * Get the message from the server, determine is 200 status code is returned.
       */
      if (!response.ok) {
        throw new Error("Failed to update profile");
      }

      // Load the return data
      const data = await response.json();
      if (!data) {
        return;
      }

      alert("Profile updated successfully");
    } catch (error: any) {
      console.error(error);
    }
  };

  const handlePhone = (phone: string) => {
    if (!phone) return;
    Alert.alert("Call", `Do you want to call the number? ${phone} `, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => Linking.openURL(`tel:${phone}`) },
    ]);
  };

  const handleLink = (link: string) => {
    if (!link) return;
    Alert.alert("Open Link", `Do you want to open the link? ${link} `, [
      {
        text: "Cancel",
        onPress: () => console.log("Cancel Pressed"),
        style: "cancel",
      },
      { text: "OK", onPress: () => Linking.openURL(link) },
    ]);
  };

  /* The helper method is uses the type of userdetails to handle the user type.
        The method gets the value of the entered data using the keyof method to assign the given value to the object with the given key. */
  const handleUpdate = (key: keyof ProfileUpdateType, value: string) => {
    // update user details
    setUserDetails((prev) => {
      if (prev) {
        return { ...prev, [key]: value };
      }
      return prev;
    });
  };

  const value = {
    notificationToggle,
    handleToggle,
    handlePhone,
    handleLink,
    handleUpdate,
    userDetails,
    updateProfile,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
}

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}
