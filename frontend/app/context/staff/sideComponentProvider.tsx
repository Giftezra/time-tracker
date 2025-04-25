import { router } from "expo-router";
import {
  useContext,
  createContext,
  ReactNode,
  useState,
  useEffect,
} from "react";
import SideComponentContextType from "@/app/types/staff/sideComponent";
import {
  CurrentDate,
  LiveEventInterface,
} from "@/app/types/staff/sideComponent";
import { Alert, Linking } from "react-native";
import { userData } from "@/app/utils/loadData";
import { useAuth } from "@/app/authentication";
import { useLocation } from "../management/LocationProvider";
import { LocationServices } from "@/app/services/LocationServices";
import MakeCommentModal from "@/app/component/staff/events/MakeComment";

const SideComponentContext = createContext<
  SideComponentContextType | undefined
>(undefined);

const SideComponentProvider = ({ children }: { children: ReactNode }) => {
  const { locationCoordinates } = useLocation();
  const currentDate: CurrentDate = {
    month: new Date().toLocaleString("default", { month: "short" }),
    day: new Date().getDate().toString(),
  };
  const { axiosInstance, setIsAlertVisible, setAlertConfig } = useAuth();

  const events: LiveEventInterface = {
    shift_id: "",
    task_serial: "",
    start_time: "",
    end_time: "",
    contract_name: "No shifts scheduled",
    team_member: [],
    status: "",
    latitude: "",
    longitude: "",
  };

  const [active, setActive] = useState<string>("events");

  const [isLoading, setIsLoading] = useState<boolean>(false);
  // Create the shift state
  const [daysShift, setDaysShift] = useState<LiveEventInterface[]>([]);
  const [event, setEvent] = useState<LiveEventInterface>(events);
  const [currentShiftIndex, setCurrentShiftIndex] = useState<number>(0);
  const [isCommentModalVisible, setIsCommentModalVisible] =
    useState<boolean>(false);
  const [shiftIdForComment, setShiftIdForComment] = useState<string>("");

  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ): number => {
    const R = 6371e3; // Earth's radius in meters
    const φ1 = (lat1 * Math.PI) / 180;
    const φ2 = (lat2 * Math.PI) / 180;
    const Δφ = ((lat2 - lat1) * Math.PI) / 180;
    const Δλ = ((lon2 - lon1) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return R * c; // Distance in meters
  };

  /**
   * Method is used to handle the users ability to move to the next shift if there is anyone available.
   * It uses the currentShiftIndex to determine the current shift and then moves to the next shift.
   */
  const handleNextShift = () => {
    if (daysShift.length === 0) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Updates",
        message: "You currently have no more shifts for today",
        onConfirm: () => {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
      return;
    }
    const newIndex = (currentShiftIndex + 1) % daysShift.length;
    setCurrentShiftIndex(newIndex);
    setEvent(daysShift[newIndex] || events);
  };

  /**
   * Method is used to handle the users ability to move to the previous shift if there is anyone available.
   * It uses the currentShiftIndex to determine the current shift and then moves to the previous shift.
   */
  const handlePreviousShift = () => {
    const newIndex =
      (currentShiftIndex - 1 + daysShift.length) % daysShift.length;
    setCurrentShiftIndex(newIndex);
    setEvent(daysShift[newIndex] || events);
  };

  useEffect(() => {
    // Remove this effect as we're now handling the event update directly in the navigation functions
    if (daysShift.length > 0) {
      setCurrentShiftIndex(0);
      setEvent(daysShift[0]);
    } else {
      setEvent(events);
    }
  }, [daysShift]); // Remove currentShiftIndex from dependencies

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
        router.navigate("/staff/(drawer)/events/StaffEvent");
        break;
      case "task":
        router.navigate("/staff/(drawer)/task/StaffTask");
        break;
      case "messages":
        router.navigate("/staff/(drawer)/messages/StaffMessages");
        break;
      case "availability":
        router.navigate("/staff/(drawer)/avaliability/StaffAvailability");
        break;
      case "dashboard":
        router.navigate("/staff/(drawer)/dashboard/StaffDashboard");
        break;
      case "timesheet":
        router.navigate("/staff/(drawer)/timesheet/StaffTimesheet");
        break;
      case "notification":
        router.navigate("/staff/(drawer)/notifications/StaffNotification");
        break;
      default:
        router.replace("/staff/(drawer)/dashboard/StaffDashboard");
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
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Opening the website",
        message: "Are you sure you want to open the website?",
        onConfirm: () => {
          Linking.openURL(url);
          setIsAlertVisible(false);
        },
        onClose: () => {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
    } catch (error) {
      console.error("Error opening the website", error);
    }
  };

  /**
   * This method is used to handle the users ability to start the shift.
   */
  const handleStartShift = async (shiftId: string) => {
    // First check if there's any active shift
    const activeShift = daysShift.find((shift) => shift.status === "started");
    if (activeShift) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Active Shift Found",
        message:
          "You must complete your current shift before starting a new one",
        onConfirm: () => {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
      return;
    }

    if (!locationCoordinates) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Location not found",
        message: "Please enable location services to start the shift",
        onConfirm: async () => {
          await LocationServices.requestLocationPermissions();
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
      return;
    }
    // Get the latitude and longitude of the user and the current shift
    // That is about to start. check the latitude and longitude of the shift is provided
    // If it is, then check if the shift is within 100 meters of the user.
    // If it is, then start the shift.
    const lat = locationCoordinates.latitude;
    const long = locationCoordinates.longitude;
    console.log("lat", lat);
    console.log("long", long);
    console.log("shiftId", shiftId);
    const currentShift = daysShift.find((shift) => shift.shift_id === shiftId);
    console.log("currentShift", currentShift);

    if (!currentShift?.latitude || !currentShift?.longitude) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: "The shift is not available to start",
        onConfirm: () => {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
      return;
    }

    const distance = calculateDistance(
      lat,
      long,
      parseFloat(currentShift.latitude),
      parseFloat(currentShift.longitude)
    );
    console.log("distance", distance);

    if (distance > 150) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message:
          "You are too far from the shift location. You need to be within 150 meters to start the shift",
        onConfirm: () => {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
      // return;
    }

    try {
      const response = await axiosInstance.patch("/api/start/shift/", {
        shift_id: event.shift_id,
      });
      if (response.status === 200) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Success",
          message: response.data.message,
          onConfirm: () => {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
      } else if (response.status === 400) {
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Error",
          message: response.data.error,
          onConfirm: () => {
            setIsAlertVisible(false);
          },
          isVisible: true,
        });
      }
    } catch (error: any) {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: error.response?.data?.error || "An unexpected error occurred",
        onConfirm: () => {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
    }
  };

  /**
   * This method is used to handle the users ability to end the shift.
   * It uses the axiosInstance to send a patch request to the server to end the shift.
   * @param shiftId is the id of the shift to end.
   * @returns void
   */
  const handleEndShift = async (shiftId: string) => {
    setIsAlertVisible(true);
    setAlertConfig({
      title: "Confirm End Shift",
      message: "Are you sure you want to end the shift?",
      onConfirm: async () => {
        setIsAlertVisible(false);
        try {
          setIsLoading(true);
          const response = await axiosInstance.patch(
            "/api/terminate/current/shift/",
            {
              shift_id: shiftId,
            }
          );

          if (response.status === 200) {
            setShiftIdForComment(shiftId);
            setIsCommentModalVisible(true);
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Success",
              message: response.data.message,
              onConfirm: () => {
                setIsAlertVisible(false);
                fetchUpcomingShifts();
              },
              isVisible: true,
            });
          }
        } catch (error: any) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Error",
            message:
              error.response?.data?.error || "An unexpected error occurred",
            onConfirm: () => {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
        } finally {
          setIsLoading(false);
        }
      },
      onClose: () => {
        setIsAlertVisible(false);
      },
      isVisible: true,
    });
  };

  const makeTaskComment = async (shiftId: string, comment: string) => {
    console.log("shift id", shiftId);
    console.log("comment", comment);

    setIsAlertVisible(true);
    setAlertConfig({
      title: "Creating the task comment",
      message: "Are you sure you want to create the task comment? ",
      onConfirm: async () => {
        setIsAlertVisible(false);
        try {
          const response = await axiosInstance.post(
            "/api/create/task/comment/",
            {
              shift_id: shiftId,
              comment: comment,
            }
          );
          if (response.status === 200) {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Success",
              message: response.data.message,
              onConfirm: () => {
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
          } else {
            setIsAlertVisible(true);
            setAlertConfig({
              title: "Error",
              message: response.data.error,
              onConfirm: () => {
                setIsAlertVisible(false);
              },
              isVisible: true,
            });
          }
        } catch (error: any) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Error",
            message:
              error.response?.data?.error || "An unexpected error occurred",
            onConfirm: () => {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
        }
      },
      onClose: () => {
        setIsAlertVisible(false);
      },
      isVisible: true,
    });
  };

  /**
   * This method is used to  handle the users ability to send call the phone number provided by the company.
   * It uses linking to open the phone number provided by the company but first asks for confirmation before proceeding to place the call
   */
  const handlePhoneCall = (phone?: string) => {
    if (!phone) return;
    try {
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Calling the phone number",
        message: `Are you sure you want to call ${phone}?`,
        onConfirm: async () => {
          await Linking.openURL(`tel:${phone}`);
          setIsAlertVisible(false);
        },
        onClose: () => {
          setIsAlertVisible(false);
        },
        isVisible: true,
      });
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
      } else {
        setDaysShift([]);
      }
    } catch (error: any) {
      const res = error.response.data;
      switch (res.status) {
        case 403:
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Too many requests",
            message: "You need to refresh the page in 1 hour",
            onConfirm: () => {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
          break;
        case 400:
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Error",
            message: res.data.error,
            onConfirm: () => {
              setIsAlertVisible(false);
            },
            isVisible: true,
          });
          break;
        default:
          break;
      }
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
    makeTaskComment,
    isCommentModalVisible,
    setIsCommentModalVisible,
  };

  return (
    <SideComponentContext.Provider value={value}>
      {children}
      {isCommentModalVisible && (
        <MakeCommentModal shiftId={shiftIdForComment} />
      )}
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
