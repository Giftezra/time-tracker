export interface ProfileContextType {
  notificationToggle: string[];
  handleToggle: (toggle: string) => void;
  handleLink: (link: string) => void;
  handleWebsiteCall: (url: string) => void;
  handlePhone: (phone: string | undefined) => void;
  handleUpdate: (key: keyof ProfileUpdateType, value: string) => void;
  userDetails: ProfileUpdateType | null;
  updateProfile: (data: ProfileUpdateType) => void;
  allowEmailNotification: boolean;
  allowPushNotification: boolean;
  allowMarketingEmails: boolean;
  savePreferences(): void;
  setAllowPushNotification(allow: boolean): void;
  setAllowEmailNotification(allow: boolean): void;
  setAllowMarketingEmails(allow: boolean): void;
}

export interface ProfileUpdateType {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  dob?: string;
  company_name?: string;
  company_address?: string;
  company_postcode?: string;
  company_website?: string;
  company_services?: string;
  company_helpline?: string;
  company_email?: string;
}

export interface UserNotificationType {
  allow_email_notification: boolean;
  allow_push_notification: boolean;
  allow_marketing_emails: boolean;
}


