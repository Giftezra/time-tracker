import { LiveEventProps } from "./eventType";


export type SideComponentContextType = {
  active: string;
  handleActivity: (activity: string) => void;
  events: LiveEventProps;
  handlePhoneCall(phone?: string): void;
  handleWebsiteCall(url?: string): void;
  allowPushNotification: boolean;
  allowMarketingEmails: boolean;
  allowEmailNotification: boolean;
  savePreferences(): void;
  setAllowPushNotification(allow: boolean): void;
  setAllowEmailNotification(allow: boolean): void;
  setAllowMarketingEmails(allow: boolean): void;
  
}