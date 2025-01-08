export type ProfileContextType = {
  notificationToggle: string[];
  handleToggle: (toggle: string) => void;
  handlePhone: (phone: string) => void;
  handleLink: (link: string) => void;
  handleUpdate: (key: keyof ProfileUpdateType, value: string) => void;
  userDetails: ProfileUpdateType | null;
  updateProfile: (data:ProfileUpdateType) => void;
}

export type ProfileUpdateType = {
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
};