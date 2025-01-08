import { router } from "expo-router";
import { useContext, createContext, ReactNode, useState } from "react";

import { SideComponentContextType } from "@/app/types/staff/sideComponent";
import { LiveEventProps } from "@/app/types/staff/eventType";
import { Alert, Linking } from "react-native";
import { loadToken, userData } from "@/app/utils/loadData";
import { BASE_URL } from "@/app/utils/urls";

const SideComponentContext = createContext<
  SideComponentContextType | undefined
>(undefined);

const SideComponentProvider = ({ children }: { children: ReactNode }) => {
  const user = userData();

  const events: LiveEventProps = {
    event_serial: "1",
    month: new Date().toLocaleString("default", { month: "short" }),
    date: new Date().getDate().toString(),
    start_time: "12:00",
    end_time: "13:00",
    event: "New Year",
    team_member: [
      {
        id: "1",
        name: "John",
      },
      {
        id: "2",
        name: "Doe",
      },
    ],
  };

  const [active, setActive] = useState<string>("events");
  const [allowPushNotification, setAllowPushNotification] = useState<boolean>(
    user?.allow_push_notification || false
  );
  const [allowEmailNotification, setAllowEmailNotification] = useState<boolean>(
    user?.allow_email_notification || false
  );
  const [allowMarketingEmails, setAllowMarketingEmails] = useState<boolean>(
    user?.allow_marketing_emails || false
  );

  /**
   * Handle the activity of the user in the side component.
   * The function takes the activity and navigates to the route based on the activity.
   * Change button color based on the activity.
   * @param activity
   */
  const handleActivity = (activity: string) => {
    if (!activity) return;
    /**
     * Set the active activity in the state.
     */
    setActive(activity);

    /**
     * Switch the activity and navigate to the route based on the activity.
     */
    switch (activity) {
      case "events":
        router.navigate("/staff/(drawer)/events/main");
        break;
      case "task":
        router.navigate("/staff/(drawer)/task/main");
        break;
      case "messages":
        router.navigate("/staff/(drawer)/messages/main");
        break;
      case "availability":
        router.navigate("/staff/(drawer)/avaliability/main");
        break;
      case "dashboard":
        router.navigate("/staff/(drawer)/dashboard/main");
        break;
      case "timesheet":
        router.navigate("/staff/(drawer)/timesheet/main");
        break;
      case "notification":
        router.navigate("/staff/(drawer)/notifications/main");
        break;
      default:
        router.replace("/staff/(drawer)/dashboard/main");
        break;
    }
  };

  /**
   * This method is used to handle the users ability to open the company website.
   * It uses linking to open a the url provided by the company
   * @param url is the company website url.
   * @returns void
   */
  const handleWebsiteCall = (url?: string) => {
    if (!url) return;
    try {
      Alert.alert(
        "Opening the website",
        "Are you sure you want to open the website?",
        [
          /* Confirm the users choice */
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => Linking.openURL(url) },
        ]
      );
    } catch (error) {
      console.error("Error opening the website", error);
    }
  };

  /**
   * This method is used to  handle the users ability to send call the phone number provided by the company.
   * It uses linking to open the phone number provided by the company but first asks for confirmation before proceeding to place the call
   */
  const handlePhoneCall = (phone?: string) => {
    if (!phone) return;
    try {
      Alert.alert(
        "Calling the phone number",
        "Are you sure you want to call the phone number?",
        [
          {
            text: "Cancel",
            onPress: () => console.log("Cancel Pressed"),
            style: "cancel",
          },
          { text: "OK", onPress: () => Linking.openURL(`tel:${phone}`) },
        ]
      );
    } catch (error) {
      console.error("Error calling the phone number", error);
    }
  };

  /**
   * This method is used to update the users notification choices to the server whren the page unmounts.
   * It uses
   */
  const savePreferences = async () => {
    const token = await  loadToken();
    try {
      const response = await fetch(`${BASE_URL}/api/staff/update-preferences`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          allowEmailNotification,
          allowMarketingEmails,
          allowPushNotification,
        }),
      });

      // Check response status
      if (!response.ok) {
        throw new Error("Error updating preferences");
      }

      const data = await response.json();
      if (data.success) {
        Alert.alert("Preferences updated successfully");
      } else {
        Alert.alert("Error updating preferences");
      }
    } catch (error) {
      console.error("Error updating preferences", error);
    }
  };

  const value = {
    active,
    handleActivity,
    events,
    handleWebsiteCall,
    handlePhoneCall,
    savePreferences,
    allowPushNotification,
    allowEmailNotification,
    allowMarketingEmails,
    setAllowEmailNotification,
    setAllowPushNotification,
    setAllowMarketingEmails,
  };

  return (
    <SideComponentContext.Provider value={value}>
      {children}
    </SideComponentContext.Provider>
  );
};

// Custom hook to use the context more easily in other components
export const useSideComponentContext = () => {
  const context = useContext(SideComponentContext);
  if (context === undefined) {
    throw new Error(
      "useSideComponentContext must be used within a SideComponentProvider"
    );
  }
  return context;
};

export default SideComponentProvider;
