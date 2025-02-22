import { useEffect, useState } from "react";
import { UserResponseType } from "../types/management/onboarding";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const userData = () => {
  const [user, setUser] = useState<UserResponseType | null>(null);
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchUserData = async () => {
      setLoading(true);
      try {
        const user = await loadUserData();
        if (user) {
          setUser(user);
        } else {
          setUser(null);
        }
      } catch (error) {
        console.error("Error loading user data:", error);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };
    fetchUserData();
  }, []);
  return user;
};

export const loadUserData = async (): Promise<UserResponseType | null> => {
  try {
    const user = await AsyncStorage.getItem("user");
    if (user) {
      return JSON.parse(user);
    }
    return null;
  } catch (error) {
    console.error("Error loading user data", error);
    return null;
  }
};

export const storeData = async (data: any) => {
  try {
    await AsyncStorage.setItem("token", data.access);
    await AsyncStorage.setItem("refresh", data.refresh);
    /**
     * Store the user data returned from the server in the async storage using the key 'user' and type UserResponseType.
     */

    const user: UserResponseType = data.user;
    const user_value = JSON.stringify(user);
    await AsyncStorage.setItem("user", user_value);
  } catch (error) {
    console.error("Error saving data: ", error);
  }
};
