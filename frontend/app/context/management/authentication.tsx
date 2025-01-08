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

import {
  UserResponseType,
  AuthContextType,
  OwnerOnboardingType,
} from "@/app/types/management/onboarding";

import { BASE_URL } from "@/app/utils/urls";
import { storeData } from "@/app/utils/loadData";

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [token, setToken] = useState<string | null>(null);
  const [refreshToken, setRefreshToken] = useState<string | null>(null);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [role, setRole] = useState<string | null>(null);
  const [user, setUser] = useState<UserResponseType | null>(null);
  const [passwordError, setPasswordError] = useState<boolean>(false);
  const [registrationMessage, setRegistrationMessage] = useState<string>("");

  const [dateClicked, setDateClicked] = useState(false);

  const [loginDetails, setLoginDetails] = useState({
    email: "",
    password: "",
  });

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

  const [ownerData, setOwnerData] = useState<OwnerOnboardingType | null>(null);

  /**
   * Send user login details to the server for verification.
   * @returns {Promise<void>}
   * @param {string} email - The email of the user
   * @param {string} password - The password of the user
   * After token retrieval method calls the get user method to get the user details
   * using the returned token for validation and further processing.
   */

  const login = async (email: string, password: string): Promise<void> => {
    console.log(` base url ${BASE_URL}`);
    email = email.toLowerCase(); // ensure email is in lowercase
    const loginData = { email, password };
    try {
      const response = await fetch(`${BASE_URL}/api/token/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(loginData),
      });

      /* If the response returns with an error, get the message */
      if (!response.ok) {
        const status = response.status;
        switch (status) {
          case 400:
            console.log("Invalid credentials");
            Alert.alert("Error", "Invalid credentials");
            break;
          case 401:
            setPasswordError(true);
            break;
        }
      }

      /**
       * Get the response data from the server and set the user data to the state.
       * Check the user role and navigate to the appropriate page.
       */
      const data = await response.json();
      if (!data) {
        throw new Error("No data returned");
      }
      const user: UserResponseType = data.user;
      await storeData(data);
      setIsAuthenticated(true);
      setRole(
        user.is_owner
          ? "owner"
          : user.is_staff
          ? "staff"
          : user.is_admin
          ? "manager"
          : ""
      );

      /* Check the role and replace the screen based on the users role */
      if (user.is_owner || user.is_admin) {
        router.replace("/management/(drawer)/dashboard/main");
      } else if (user.is_staff) {
        router.replace("/staff/(drawer)/dashboard/main");
      } else {
        Alert.alert("Error", "User not found");
      }
    } catch (error) {
      console.error("Error: ", error);
    }
  };

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
   * Method is used to handle the users selected date input
   * @param selectDate
   * @param value
   */
  const handleDateInput = (selectDate: string) => {
    handleUserInput("dob", selectDate);
    setDateClicked(false);
  };

  /**
   * Function is used to handle the user registration input.
   * @param key is the key of the input field
   * @param value is the value of the input field
   * The function sets the owner data to the state using the key and value of the {OwnerOnboardingType}
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
   * Fetch request is used to register the user on the server.
   * The data uses proper type checking to ensure that the data is correct.
   *
   */
  const onboardOwner = async (Data: OwnerOnboardingType) => {
    /* Try Fetch request and return json response or catch error thrown */
    try {
      const response = await fetch(`${BASE_URL}/api/register/user/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(Data),
      });

      if (!response.ok) {
        const status = response.status;
        if (status === 400) {
          Platform.OS === "web"
            ? window.confirm("User already exists")
            : Alert.alert("Error", "User already exists");
        } else {
          throw new Error(`Error: ${status}, ${response.statusText}`);
        }
      }
      /* If the user is registered ok, navigate to the login page to complete authentication */
      console.log("User registered successfully");
      router.replace("/management/onboarding/login");
    } catch (error) {
      console.error("Error: ", error);
    }
  };

  /**
   * Function is used to handle the company registration process.
   * The function takes in the company data and sends it to the server for validation and registration.
   * @param {OwnerOnboardingType} Data - The data to be sent to the server for registration.
   */

  /**
   * Method is used to sign the user out when clicked. deleted the tokens related to the user from the storage
   * and set the user to null.
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

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};

export default AuthProvider;
