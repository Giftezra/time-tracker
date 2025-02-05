import { useLoadedFonts } from "@/hooks/useLoadedFonts";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import { ActivityIndicator, Alert, Dimensions, Platform } from "react-native";
import { router } from "expo-router";
import axios, { AxiosError } from "axios";

import {
  UserResponseType,
  AuthContextType,
  OwnerOnboardingType,
} from "@/app/types/management/onboarding";

import { BASE_URL } from "@/app/utils/urls";
import { storeData, getData } from "@/app/utils/loadData";

/**
 * AuthContext provides authentication state and methods throughout the application.
 * This context handles user authentication, token management, and user registration.
 */
const AuthContext = createContext<AuthContextType | undefined>(undefined);

/**
 * Axios instance for making authenticated HTTP requests.
 * This instance is configured with interceptors for token management.
 */
const axiosInstance = axios.create({
  baseURL: BASE_URL,
});

interface AuthProviderProps {
  children: ReactNode;
}

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
  // Authentication state
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponseType | null>(null);

  // Form state
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [registrationMessage, setRegistrationMessage] = useState<string>("");
  const [dateClicked, setDateClicked] = useState(false);
  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

  // Responsive design state
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
   * Manage font loading state using the useLoadedFonts hook to load all fonts.
   * Return an activity screenwhen fonts are not loaded.
   *
   * Use the useEffect hook to set the font loaded state to true when fonts are loaded.
   * the useEffect hook only runs when the fonts change.
   */
  const fontsLoaded = useLoadedFonts();

  // Registration state
  const [ownerData, setOwnerData] = useState<OwnerOnboardingType | null>(null);

  /**
   * Check for stored authentication data when the component mounts
   * and restore the auth state if valid credentials exist
   */
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const storedData = await getData();

        if (storedData) {
          const { access, refresh, user } = storedData;

          if (access && refresh && user) {
            setToken(access);
            setRefreshToken(refresh);
            setIsAuthenticated(true);
            setUser(user);
            setRole(
              user.is_owner
                ? "owner"
                : user.is_employee
                ? "staff"
                : user.is_admin
                ? "manager"
                : ""
            );

            // Redirect to appropriate dashboard based on role
            if (user.is_owner || user.is_admin) {
              router.replace("/management/(drawer)/dashboard/main");
            } else if (user.is_employee) {
              router.replace("/staff/(drawer)/dashboard/main");
            }
          }
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        // If there's an error, ensure user is logged out
        await signOut();
      }
    };

    checkAuthStatus();
  }, []);

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
        return Promise.reject(error);
      }
    );

    // Response interceptor
    const responseIntercept = axiosInstance.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        const originalRequest = error.config as any;

        // Check if error is 401 and we haven't tried refreshing yet
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

    // Setup periodic token refresh (every 5 minutes)
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
            console.error("Token refresh failed:", error);
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
   * Authenticates a user with their email and password.
   * On successful authentication:
   * - Stores access and refresh tokens
   * - Updates authentication state
   * - Redirects user based on their role
   *
   * @param {string} email - User's email address
   * @param {string} password - User's password
   */
  const login = async (email: string, password: string): Promise<void> => {
    console.log(` base url ${BASE_URL}`);
    email = email.toLowerCase();
    const loginData = { email, password };
    try {
      const response = await axios.post(`${BASE_URL}/api/token/`, loginData);

      const data = response.data;
      if (!data) {
        throw new Error("No data returned");
      }

      // Add these lines to store both tokens
      setToken(data.access);
      setRefreshToken(data.refresh);

      const user: UserResponseType = data.user;
      await storeData(data);
      setIsAuthenticated(true);
      setRole(
        user.is_owner
          ? "owner"
          : user.is_employee
          ? "staff"
          : user.is_admin
          ? "manager"
          : ""
      );

      /* Check the role and replace the screen based on the users role */
      if (user.is_owner || user.is_admin) {
        router.replace("/management/(drawer)/dashboard/main");
      } else if (user.is_employee) {
        router.replace("/staff/(drawer)/dashboard/main");
      } else {
        Alert.alert("Error", "User not found");
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        switch (status) {
          case 400:
            console.log("Invalid credentials");
            alert("invalid credentials");
            break;
          case 401:
            setPasswordError(true);
            break;
          default:
            console.error("Error: ", error);
            Alert.alert("Error", "An unexpected error occurred");
        }
      }
    }
  };

  /**
   * Updates the login form state
   * @param {string} key - Field name to update (email or password)
   * @param {string} value - New value for the field
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
   * Updates the date of birth in the registration form
   * @param {string} selectDate - Selected date in string format
   */
  const handleDateInput = (selectDate: string) => {
    handleUserInput("dob", selectDate);
    setDateClicked(false);
  };

  /**
   * Updates the owner registration form state
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
   * Registers a new owner in the system
   * On successful registration, redirects to the login page
   *
   * @param {OwnerOnboardingType} Data - Owner registration data
   */
  const onboardOwner = async (Data: OwnerOnboardingType) => {
    try {
      const response = await axios.post(`${BASE_URL}/api/register/user/`, Data);

      console.log("User registered successfully");
      router.replace("/management/onboarding/login");
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const status = error.response?.status;
        if (status === 400) {
          Platform.OS === "web"
            ? window.confirm("User already exists")
            : Alert.alert("Error", "User already exists");
        } else {
          console.error("Error: ", error);
          Alert.alert("Error", "An unexpected error occurred");
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
    setToken(null);
    setRefreshToken(null);
    setIsAuthenticated(false);
    setRole(null);
    setUser(null);
    await storeData(null);
    router.replace("/management/onboarding/login");
  };

  const value = {
    token,
    refreshToken,
    isAuthenticated,
    role,
    user,
    login,
    registerOwner: onboardOwner,
    handleUserInput,
    ownerData,
    fontsLoaded,
    handleLoginInput,
    loginDetails,
    passwordError,
    signOut,
    registrationMessage,
    handleDateInput,
    dateClicked,
    setDateClicked,
    screenWidth,
    windowWidth,
    axiosInstance,
  };

  return (
    <AuthContext.Provider value={value}>
      {fontsLoaded ? (
        children
      ) : (
        <ActivityIndicator size="large" color="black" />
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
