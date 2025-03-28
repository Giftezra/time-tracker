import { AxiosInstance } from "axios";

export interface EmployeeOnboardingType {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dob: string;
  department: string;

  role: string;
  password: string;
};

export interface OwnerOnboardingType {
  first_name: string;
  last_name: string;
  email: string;
  phone: string;
  dob: string;

  password: string;
  postcode?: string;
  address?: string;
  city?: string;
  company_name?: string | undefined;
  company_registration_number?: string | undefined;
  company_services?: string | undefined;
  company_address?: string | undefined;
  company_postcode?: string | undefined;
  company_helpline?: string | undefined;
  company_website?: string | undefined;
  comapny_email?: string | undefined;
};

/**
 * This type describe the return data from the server.
 */
export interface UserResponseType {
  id: number;
  email: string;
  phone?: string | undefined;
  dob?: string | null;
  first_name?: string;
  last_name?: string;
  address?: string | null;
  postcode?: string | null;
  date_hired?: string | null;
  city?: string | null;
  country?: string | null;
  company_name?: string | undefined;
  company_services?: string | undefined;
  company_address?: string | undefined;
  company_postcode?: string | undefined;
  company_helpline?: string | undefined;
  company_website?: string | undefined;
  comapny_email?: string | undefined;
  password: string;
  is_owner?: boolean;
  is_employee?: boolean;
  is_admin?: boolean;
  is_superuser?: boolean;
  is_active?: boolean;
  allow_push_notification?: boolean;
  allow_email_notification?: boolean;
  allow_marketing_emails?: boolean;

  groups?: any[];
  user_permissions?: any[];
};

/**
 * This type describes the return for staffs from the server.
 * Extends the UserResponseType.
 */
export interface StaffResponseType extends UserResponseType {
  department: string | null;
  role: string | null;
  date_hired: string;
};


/**
 * This type describes the constraints for the onboarding context and provider.
 */
export interface AuthContextType {
  passwordError: boolean;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  role: string | null;
  user: UserResponseType | null;
  login: (email: string, password: string) => void;
  handleUserInput: (key: string, value: string) => void;
  registerOwner: (Data: OwnerOnboardingType) => void;
  ownerData: OwnerOnboardingType | null;
  fontsLoaded: boolean;
  loginDetails: { email: string; password: string };
  handleLoginInput: (key: string, value: string) => void;
  signOut: () => void;
  registrationMessage: string;
  handleDateInput: (selectDate: string) => void;
  dateClicked: boolean;
  setDateClicked: (value: boolean) => void;
  screenWidth: number;
  windowWidth: number;
  axiosInstance: AxiosInstance;
  setPreferredRole: (role: 'admin' | 'staff') => Promise<void>;
}
