import {
  ProfileContextType,
  ProfileUpdateType,
} from "@/app/types/management/profile";
import { useContext, createContext, useState } from "react";
import { Alert, Linking } from "react-native";
import { useAuth } from "@/app/authentication";
import { userData } from "@/app/utils/loadData";

const ProfileContext = createContext<ProfileContextType | undefined>(undefined);

/** Create a provider using the context.
 * The provider is meant to provide the context to the profile component only for consumption.
 *
 */
const ProfileProvider = ({ children }: { children: React.ReactNode }) => {
  const { axiosInstance } = useAuth();
  const user = userData();

  const [onModalVisible, setOnModalVisible] = useState<boolean>(false);

  const [notificationToggle, setNotificationToggle] = useState<string[]>([]);
  const [userDetails, setUserDetails] = useState<ProfileUpdateType>({
    firstname: user?.first_name,
    lastname: user?.last_name,
    email: user?.email,
    phone: user?.phone,
    dob: user?.dob || "",
    company_name: user?.company_name,
    company_address: user?.company_address,
    company_postcode: user?.company_postcode,
    company_website: user?.company_website,
    company_services: user?.company_services,
    company_helpline: user?.company_helpline,
    company_email: user?.comapny_email,
  });

  const [allowPushNotification, setAllowPushNotification] = useState<boolean>(
    user?.allow_push_notification || false
  );
  const [allowEmailNotification, setAllowEmailNotification] = useState<boolean>(
    user?.allow_email_notification || false
  );
  const [allowMarketingEmails, setAllowMarketingEmails] = useState<boolean>(
    user?.allow_marketing_emails || false
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

  const updateCompanyDetails = async () => {
    try {
      const response = await axiosInstance.patch("/api/update/owner/company/details/", {
        data: userDetails,
      });
      if (response.status === 200) {
        Alert.alert("Success", "Company details updated successfully");
        setUserDetails(response.data.new_data);
        setOnModalVisible(false);
      } else {
        Alert.alert("Error", response.data.error || "Failed to update details");
      }
    } catch (error: any) {
      Alert.alert(
        "Error",
        error.response?.data?.error || "Failed to update company details"
      );
      console.error(error);
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
  const handlePhone = (phone?: string) => {
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
    const response = await axiosInstance.patch(
      "/api/update/user/preferences/",
      {
        allow_push_notification: allowPushNotification,
        allow_email_notification: allowEmailNotification,
        allow_marketing_emails: allowMarketingEmails,
      }
    );

    if (response.status === 200) {
      const newData = response.data.new_data;
      setAllowEmailNotification(newData.allow_email_notification);
      setAllowPushNotification(newData.allow_push_notification);
      setAllowMarketingEmails(newData.allow_marketing_emails);
    } else {
      console.error(response.data.error);
    }
  };

  const value: ProfileContextType = {
    notificationToggle,
    handleToggle,
    handleLink,
    handleUpdate,
    userDetails,
    updateCompanyDetails,
    allowEmailNotification,
    allowPushNotification,
    allowMarketingEmails,
    savePreferences,
    setAllowPushNotification,
    setAllowEmailNotification,
    setAllowMarketingEmails,
    handleWebsiteCall,
    handlePhone,
    onModalVisible,
    setOnModalVisible,
  };

  return (
    <ProfileContext.Provider value={value}>{children}</ProfileContext.Provider>
  );
};

export function useProfileContext() {
  const context = useContext(ProfileContext);
  if (context === undefined) {
    throw new Error("useProfileContext must be used within a ProfileProvider");
  }
  return context;
}

export default ProfileProvider;
