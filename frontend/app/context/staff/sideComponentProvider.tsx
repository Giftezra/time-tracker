import { router } from "expo-router";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";

import { SideComponentContextType } from "@/app/types/staff/sideComponent";
import {
  CurrentDate,
  LiveEventInterface,
} from "@/app/types/staff/sideComponent";
import { Alert, Linking } from "react-native";
import { userData } from "@/app/utils/loadData";
import { useAuth } from "@/app/authentication";

const SideComponentContext = createContext<
  SideComponentContextType | undefined
>(undefined);

const SideComponentProvider = ({ children }: { children: ReactNode }) => {
  const currentDate: CurrentDate = {
    month: new Date().toLocaleString("default", { month: "short" }),
    day: new Date().getDate().toString(),
  };

  const user = userData();
  const { axiosInstance } = useAuth();

  const events: LiveEventInterface = {
    shift_id: "",
    task_serial: "",
    start_time: "",
    end_time: "",
    contract_name: "No shifts scheduled",
    team_member: [],
  };

  const [active, setActive] = useState<string>("events");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Create the shift state
  const [daysShift, setDaysShift] = useState<LiveEventInterface[]>([]);
  const [event, setEvent] = useState<LiveEventInterface>(events);
  const [currentShiftIndex, setCurrentShiftIndex] = useState<number>(0);

  /**
   * Method is used to handle the users ability to move to the next shift if there is anyone available.
   * It uses the currentShiftIndex to determine the current shift and then moves to the next shift.
   */
  const handleNextShift = () => {
    setCurrentShiftIndex((prev) => (prev + 1) % daysShift.length);
  };

  /**
   * Method is used to handle the users ability to move to the previous shift if there is anyone available.
   * It uses the currentShiftIndex to determine the current shift and then moves to the previous shift.
   */
  const handlePreviousShift = () => {
    setCurrentShiftIndex(
      (prev) => (prev - 1 + daysShift.length) % daysShift.length
    );
  };

  useEffect(() => {
    const currentEvent =
      daysShift.length > 0 ? daysShift[currentShiftIndex] : events;

    setEvent(currentEvent);

    // Reset index when shifts change
    if (daysShift.length > 0) {
      setCurrentShiftIndex(0);
    }
  }, [daysShift, currentShiftIndex]); // Add currentShiftIndex to dependencies

  /**
   * Handle the activity of the user in the side component.
   * The function takes the activity and navigates to the route based on the activity.
   * Change button color based on the activity.
   * @param activity
   */
  const handleActivity = (activity: string) => {
    if (!activity) return;
    setActive(activity);
    /**
     * Switch the activity and navigate to the route based on the activity.
     */
    switch (activity) {
      case "events":
        router.navigate("/staff/(drawer)/events/main");
        break;
      case "task":
        router.navigate("/staff/(drawer)/task/main");
        break;
      case "messages":
        router.navigate("/staff/(drawer)/messages/main");
        break;
      case "availability":
        router.navigate("/staff/(drawer)/avaliability/main");
        break;
      case "dashboard":
        router.navigate("/staff/(drawer)/dashboard/main");
        break;
      case "timesheet":
        router.navigate("/staff/(drawer)/timesheet/main");
        break;
      case "notification":
        router.navigate("/staff/(drawer)/notifications/main");
        break;
      default:
        router.replace("/staff/(drawer)/dashboard/main");
        break;
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
   * This method is used to handle the users ability to start the shift.
   * It uses the axiosInstance to send a patch request to the server to start the shift.
   * @param shiftId is the id of the shift to start.
   * @returns void
   */
  const handleStartShift = async (shiftId: string) => {
    try {
      const response = await axiosInstance.patch("/api/begin/shift/", {
        shift_id: shiftId,
      });
      if (response.data.message) {
        Alert.alert(response.data.message);
      } else {
        Alert.alert(response.data.error);
      }
    } catch (error) {
      console.error("Error starting the shift", error);
    }
  };

  /**
   * This method is used to handle the users ability to end the shift.
   * It uses the axiosInstance to send a patch request to the server to end the shift.
   * @param shiftId is the id of the shift to end.
   * @returns void
   */
  const handleEndShift = async (shiftId: string) => {
    try {
      const response = await axiosInstance.patch("/api/terminate/current/shift/", {
        shift_id: shiftId,
      });
      if (response.data.message) {
        Alert.alert(response.data.message);
      } else {
        Alert.alert(response.data.error);
      }
    } catch (error) {
      console.error("Error ending the shift", error);
    }
  };  

  /**
   * This method is used to  handle the users ability to send call the phone number provided by the company.
   * It uses linking to open the phone number provided by the company but first asks for confirmation before proceeding to place the call
   */
  const handlePhoneCall = (phone?: string) => {
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
   * This method is used to get the shifts that assigned to the user given the current date.
   * It uses the currentDate to ensure only the shifts for the current date are returned.
   * It sets the state of the daysShift to the shifts for the current date.
   * @returns void
   */
  const fetchUpcomingShifts = async () => {
    console.log("Fetching the shifts for the current day", currentDate.day);
    try {
      const response = await axiosInstance.get("/api/get/current/day/shifts/", {
        params: {
          day: currentDate.day,
        },
      });
      // Check if the response has the shifts
      // If it doesm, set the state of the daysShift to the shifts
      if (response.data.shifts) {
        setDaysShift(response.data.shifts);
        console.log("Shifts", response.data.shifts);
      } else {
        setDaysShift([]);
      }
    } catch (error) {
      console.error("Error fetching the shifts", error);
    }
  };

  /**
   * This method is used to update the users notification choices to the server whren the page unmounts.
   * It uses
   */

  const value: SideComponentContextType = {
    active,
    handleActivity,
    event,
    handleWebsiteCall,
    handlePhoneCall,
    currentDate,
    fetchUpcomingShifts,
    daysShift,
    handleNextShift,
    handlePreviousShift,
    currentShiftIndex,
    handleStartShift,
    handleEndShift,
  };

  return (
    <SideComponentContext.Provider value={value}>
      {children}
    </SideComponentContext.Provider>
  );
};

// Custom hook to use the context more easily in other components
export const useSideComponentContext = () => {
  const context = useContext(SideComponentContext);
  if (context === undefined) {
    throw new Error(
      "useSideComponentContext must be used within a SideComponentProvider"
    );
  }
  return context;
};

export default SideComponentProvider;
