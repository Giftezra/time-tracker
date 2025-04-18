import { CompanyInterface } from "./onboarding";

export default interface ProfileContextType {
  notificationToggle: string[];
  handleToggle: (toggle: string) => void;
  handleLink: (link: string) => void;
  handleWebsiteCall: (url: string) => void;
  handlePhone: (phone: string | undefined) => void;
  handleUpdate: (key: keyof ProfileUpdateType, value: string) => void;
  userDetails: ProfileUpdateType | null;
  updateCompanyDetails: () => void;
  allowEmailNotification: boolean;
  allowPushNotification: boolean;
  allowMarketingEmails: boolean;
  savePreferences(): void;
  setAllowPushNotification(allow: boolean): void;
  setAllowEmailNotification(allow: boolean): void;
  setAllowMarketingEmails(allow: boolean): void;
  onModalVisible: boolean;
  setOnModalVisible: (visible: boolean) => void;
  companyDetails: CompanyInterface | undefined;
  setCompanyDetails: (companyDetails: CompanyInterface | undefined) => void;
  createCompany: (companyDetails?: CompanyInterface) => void;
}

export interface ProfileUpdateType extends CompanyInterface {
  firstname?: string;
  lastname?: string;
  email?: string;
  phone?: string;
  dob?: string;
}

export interface UserNotificationType {
  allow_email_notification: boolean;
  allow_push_notification: boolean;
  allow_marketing_emails: boolean;
}
