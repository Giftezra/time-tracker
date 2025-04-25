import { useLoadedFonts } from "@/hooks/useLoadedFonts";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { ActivityIndicator, Alert, Dimensions, View, Text } from "react-native";
import { router } from "expo-router";
import axios, { AxiosError } from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";
import AuthContextType, {
  CompanyInterface,
} from "@/app/types/management/onboarding";
import {
  UserResponseType,
  OwnerOnboardingType,
} from "@/app/types/management/onboarding";
import { loadUserData, storeData } from "./utils/loadData";
import Constants from "expo-constants";
import BASE_URL from "@/app/utils/urls";
import AlertModal from "./component/helper/AlertModal";
import AlertConfig from "./types/management/AlertConfig";

/**
 * AuthContext provides authentication state and methods throughout the application.
 * This context handles user authentication, token management, and user registration.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);
// const API_URL =
//   Constants.expoConfig?.extra?.url?.host;
// console.log("API_URL", API_URL);
/**
 * Axios instance for making authenticated HTTP requests.
 * This instance is configured with interceptors for token management.
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL(),
  withCredentials: true,
});

interface AuthProviderProps {
  children: ReactNode;
}

const PREFERRED_ROLE_KEY = "preferred_role";

/**
 * AuthProvider component manages authentication state and provides authentication-related
 * functionality to child components.
 *
 * Features:
 * - User authentication (login/logout)
 * - Token management (access & refresh tokens)
 * - User registration
 * - Responsive design handling
 * - Font loading management
 *
 * @param {Object} props - Component props
 * @param {ReactNode} props.children - Child components to be wrapped by the provider
 */
const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [isAlertVisible, setIsAlertVisible] = useState<boolean>(false);
  const [alertConfig, setAlertConfig] = useState<AlertConfig | undefined>(
    undefined
  );
  /**
   * Manage font loading state using the useLoadedFonts hook to load all fonts.
   * Return an activity screenwhen fonts are not loaded.
   *
   * Use the useEffect hook to set the font loaded state to true when fonts are loaded.
   * the useEffect hook only runs when the fonts change.
   */
  const fontsLoaded = useLoadedFonts();
  // This state is used here to simply manage the register company overlay.
  // So that it is accessible from outside side component.
  const [isRegisterCompany, setIsRegisterCompany] = useState<boolean>(false);
  // Authentication state
  const [token, setToken] = useState<string | null>(null);
  const [isAlertModalVisible, setIsAlertModalVisible] =
    useState<boolean>(false);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponseType | null>(null);
  const [ownerData, setOwnerData] = useState<OwnerOnboardingType | null>(null);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [registrationMessage, setRegistrationMessage] = useState<string>("");
  const [dateClicked, setDateClicked] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });
  const [addresses, setAddresses] = useState<
    Array<{
      address1: string;
      city: string;
      postcode: string;
    }>
  >([]);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isAddressVisible, setIsAddressVisible] = useState<boolean>(false);
  const [isAddressModalVisible, setIsAddressModalVisible] =
    useState<boolean>(false);

  const [screenWidth, setScreenWidth] = useState(
    Dimensions.get("window").width
  );
  const [windowWidth, setWindowWidth] = useState(
    Dimensions.get("window").width
  );

  /**
   * Use the hook to set the width and screen width of the window using listeners to listen to changes in the window width.
   */
  useEffect(() => {
    const updateWidth = () => {
      setScreenWidth(Dimensions.get("window").width);
      setWindowWidth(Dimensions.get("window").width);
    };
    const listener = Dimensions.addEventListener("change", updateWidth);
    return () => {
      listener.remove();
    };
  }, [screenWidth, windowWidth]);

  /**
   * Sets up axios interceptors for automatic token management:
   * - Adds authorization header to requests
   * - Handles token refresh on 401 errors
   * - Implements periodic token refresh
   *
   * The interceptors handle:
   * 1. Adding the access token to request headers
   * 2. Automatic token refresh when receiving 401 responses
   * 3. Periodic token refresh every 5 minutes
   */
  useEffect(() => {
    let refreshTimeout: NodeJS.Timeout;
    // Request interceptor
    const requestIntercept = axiosInstance.interceptors.request.use(
      (config) => {
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => {
        console.error("Request interceptor error:", error);
        return Promise.reject(error);
      }
    );
    /* Response interceptor
     * This is to handle the 401 error and refresh the token.
     * This is to avoid the user being logged out due to token expiration.
     */
    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => {
        return response;
      },
      async (error: AxiosError) => {
        const originalRequest = error.config as any;
        if (error.response?.status === 401 && refreshToken && originalRequest) {
          try {
            const response = await axiosInstance.post("/api/token/refresh/", {
              refresh: refreshToken,
            });
            const newToken = response.data.access;
            setToken(newToken);
            // Retry the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${newToken}`;
            }
            return axiosInstance(originalRequest);
          } catch (refreshError) {
            await signOut();
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    /* Setup periodic token refresh (every 5 minutes).
     * This is to ensure that the token is refreshed before it expires.
     * This is to avoid the user being logged out due to token expiration.
     */
    const setupTokenRefresh = () => {
      if (refreshToken) {
        refreshTimeout = setInterval(async () => {
          try {
            const response = await axiosInstance.post("/api/token/refresh/", {
              refresh: refreshToken,
            });
            const newToken = response.data.access;
            setToken(newToken);
          } catch (error) {
            await signOut();
          }
        }, 5 * 60 * 1000);
      }
    };

    setupTokenRefresh();

    // Cleanup function
    return () => {
      axiosInstance.interceptors.request.eject(requestIntercept);
      axiosInstance.interceptors.response.eject(responseIntercept);
      clearInterval(refreshTimeout);
    };
  }, [token, refreshToken]);

  /**
   * Check for existing tokens and user data when the app starts
   * This effect should run once when the component mounts
   */
  useEffect(() => {
    const initializeAuth = async () => {
      const storedToken = await AsyncStorage.getItem("token");
      const storedRefreshToken = await AsyncStorage.getItem("refresh");
      const storedUser = await loadUserData();
      const preferredRole = await AsyncStorage.getItem(PREFERRED_ROLE_KEY);
      try {
        if (storedToken && storedUser && storedRefreshToken) {
          setToken(storedToken);
          setRefreshToken(storedRefreshToken);
          axiosInstance.defaults.headers.common[
            "Authorization"
          ] = `Bearer ${storedToken}`;
          setUser(storedUser);
          setIsAuthenticated(true);
          setRole(
            storedUser.is_owner
              ? "owner"
              : storedUser.is_employee
              ? "staff"
              : storedUser.is_admin
              ? "manager"
              : ""
          );
          /* Redirect based on user role and preferences  */
          if (storedUser.is_owner) {
            router.replace(
              "/management/(drawer)/dashboard/ManagementDashboard"
            );
          } else if (storedUser.is_admin && storedUser.is_employee) {
            if (preferredRole === "admin") {
              router.replace(
                "/management/(drawer)/dashboard/ManagementDashboard"
              );
            } else if (preferredRole === "staff") {
              router.replace("/staff/(drawer)/dashboard/StaffDashboard");
            } else {
              router.replace("/management/bridge");
            }
          } else if (storedUser.is_employee) {
            router.replace("/staff/(drawer)/dashboard/StaffDashboard");
          } else if (storedUser.is_admin) {
            router.replace(
              "/management/(drawer)/dashboard/ManagementDashboard"
            );
          } else if (storedUser.is_superuser) {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Superuser login is not allowed",
              message: "Please try a different email address.",
              onConfirm: async () => {
                await signOut();
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
          }
        }
      } catch (error) {}
    };

    initializeAuth();
  }, []);

  /**
   * Authenticates a user with their email and password.
   * - Stores access and refresh tokens on success
   * - Updates authentication state
   * - Redirects user based on their role
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   */
  const login = async (email: string, password: string): Promise<void> => {
    email = email.toLowerCase();
    const loginData = { email, password };
    try {
      const response = await axios.post(`${BASE_URL()}/api/token/`, loginData);
      const data = response.data;

      const user: UserResponseType = data.user;
      if (user.is_superuser) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Superuser login is not allowed",
          message: "Please try a different email address.",
          onConfirm: () => setIsAlertVisible(false),
          isVisible: true,
        });
        return;
      }
      await storeData(data); // Store the data in the AsyncStorage
      axiosInstance.defaults.headers.common[
        "Authorization"
      ] = `Bearer ${data.access}`;
      setIsAuthenticated(true);
      setUser(user);
      setRole(
        user.is_owner
          ? "Owner"
          : user.is_employee
          ? "Staff"
          : user.is_admin
          ? "Manager"
          : ""
      );
      // Handle routing based on user role
      if (user.is_owner) {
        router.replace("/management/(drawer)/dashboard/ManagementDashboard");
      } else if (user.is_admin && user.is_employee) {
        router.replace("/management/bridge");
      } else if (user.is_employee) {
        router.replace("/staff/(drawer)/dashboard/StaffDashboard");
      } else if (user.is_admin) {
        router.replace("/management/(drawer)/dashboard/ManagementDashboard");
      }
    } catch (error) {
      console.error("Login error:", error);
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        switch (status) {
          case 400:
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Invalid credentials",
              message: "Please try a different email address or password.",
              onConfirm: () => setIsAlertVisible(false),
              isVisible: true,
              type: "error",
            });
            break;
          case 401:
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Did you forget your password?",
              message: "Please try a different email address or password.",
              onConfirm: () => setIsAlertVisible(false),
              isVisible: true,
              type: "error",
            });
            break;
          case 404:
            setIsAlertVisible(true);
            setAlertConfig({
              title: "User not found",
              message: "Please try a different email address.",
              onConfirm: () => setIsAlertVisible(false),
              isVisible: true,
              type: "error",
            });
            break;
          default:
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Error",
              message: "An unexpected error occurred",
              onConfirm: () => setIsAlertVisible(false),
              isVisible: true,
              type: "error",
            });
        }
      }
    }
  };

  /**
   * Signs out the current user:
   * - Clears authentication state
   * - Removes stored tokens
   * - Redirects to login page
   */
  const signOut = async () => {
    delete axiosInstance.defaults.headers.common["Authorization"];
    setToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Sign Out",
      message: "Do you want to sign out?",
      onConfirm: async () => {
        await AsyncStorage.multiRemove([
          "token",
          "refresh",
          "user",
          PREFERRED_ROLE_KEY,
        ]);
        router.replace("/management/onboarding/onboard");
        setIsAlertVisible(false);
      },
      onClose: () => {
        setIsAlertVisible(false);
      },
      isVisible: true,
      type: "error",
    });
  };

  /**
   * Sets the preferred role for users with multiple roles (admin/staff)
   * Redirects to appropriate dashboard based on selection
   *
   * @param {("admin" | "staff")} role - The selected role
   */
  const setPreferredRole = async (role: "admin" | "staff") => {
    try {
      await AsyncStorage.setItem(PREFERRED_ROLE_KEY, role);
      if (role === "admin") {
        router.replace("/management/(drawer)/dashboard/ManagementDashboard");
      } else {
        router.replace("/staff/(drawer)/dashboard/StaffDashboard");
      }
    } catch (error) {
      console.error("Error saving preferred role:", error);
    }
  };

  /**
   * Registration and Onboarding Methods
   */

  /**
   * Registers a new owner in the system
   * - Sends registration data to backend
   * - Shows success/error alerts
   * - Redirects to login on success
   *
   * @param {OwnerOnboardingType} Data - Owner registration data
   */
  const onboardOwner = async (Data: OwnerOnboardingType) => {
    console.log("Data", Data);
    try {
      const response = await axios.post(
        `${BASE_URL()}/api/register/owner/`,
        Data
      );
      // Route to the login screen if the user is created successfully
      if (response.status === 201) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Success",
          message: response.data.message,
          onConfirm: () => {
            router.replace("/management/onboarding/login");
            setIsAlertModalVisible(false);
          },
          isVisible: true,
          type: "success",
        });
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "User Already Exists",
            message: "Please try a different email address.",
            onConfirm: () => setIsAlertModalVisible(false),
            isVisible: true,
            type: "error",
          });
          return;
        } else {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Error",
            message:
              error.response?.data?.error || "An unexpected error occurred",
            onConfirm: () => setIsAlertModalVisible(false),
            isVisible: true,
            type: "error",
          });
        }
      }
    }
  };

  /**
   * Updates the login form state using a key value pair to match the login details type.
   * @param {string} key - Field name (email or password)
   * @param {string} value - New field value
   */
  const handleLoginInput = (key: string, value: string) => {
    setLoginDetails(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        } as { email: string; password: string })
    );
  };

  /**
   * Updates the owner registration form state using a key value pair to match the owner onboarding type.
   * @param {string} key - Field name to update
   * @param {string} value - New value for the field
   */
  const handleUserInput = (key: string, value: string) => {
    setOwnerData(
      (prev) =>
        ({
          ...prev,
          [key]: value,
        } as OwnerOnboardingType)
    );
  };

  /**
   * Address Lookup Methods
   */

  /**
   * Looks up addresses using provided postcode
   * - Makes API call to address lookup service
   * - Updates addresses state with results
   * - Shows address selection modal
   *
   * @param {string} postcode - Postcode to lookup
   */
  const findAddresses = async (postcode: string) => {
    setIsLoading(true);
    try {
      // Replace this with your actual API endpoint
      const response = await axios.post(`${BASE_URL()}/api/lookup/address/`, {
        postcode: postcode,
      });
      const data = response.data;
      console.log("Addresses", data);
      setAddresses(data);
      setIsAddressModalVisible(true);
    } catch (error) {
      console.error("Error fetching addresses:", error);
      // Handle error appropriately
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles address selection from lookup results
   * - Updates registration form with selected address
   * - Closes address selection modal
   *
   * @param {Object} address - Selected address object
   */
  const selectAddress = (address: {
    address1: string;
    city: string;
    postcode: string;
  }) => {
    handleUserInput("address1", address.address1);
    handleUserInput("city", address.city);
    handleUserInput("postcode", address.postcode);
    setIsAddressModalVisible(false);
  };

  const value: AuthContextType = {
    token,
    refreshToken,
    isAuthenticated,
    role,
    user,
    login,
    onboardOwner,
    handleUserInput,
    ownerData,
    fontsLoaded,
    handleLoginInput,
    loginDetails,
    passwordError,
    signOut,
    registrationMessage,
    dateClicked,
    setDateClicked,
    screenWidth,
    windowWidth,
    axiosInstance,
    setPreferredRole,
    findAddresses,
    selectAddress,
    addresses,
    isLoading,
    isAddressVisible,
    isAddressModalVisible,
    alertConfig,
    setAlertConfig,
    isAlertVisible,
    setIsAlertVisible,
    isAlertModalVisible,
    setIsAlertModalVisible,
    isRegisterCompany,
    setIsRegisterCompany,
  };

  return (
    <AuthContext.Provider value={value}>
      {fontsLoaded ? (
        children
      ) : (
        <ActivityIndicator size="large" color="black" />
      )}
      {isAlertVisible && (
        <AlertModal
          title={alertConfig?.title || ""}
          message={alertConfig?.message || ""}
          onConfirm={alertConfig?.onConfirm}
          isVisible={alertConfig?.isVisible || false}
          onClose={alertConfig?.onClose}
        />
      )}
    </AuthContext.Provider>
  );
};

/**
 * Custom hook to access the authentication context
 * @throws {Error} If used outside of AuthProvider
 * @returns {AuthContextType} Authentication context value
 */
export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
