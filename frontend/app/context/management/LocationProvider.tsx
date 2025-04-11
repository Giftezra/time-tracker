import React, { createContext, useContext, useState, useEffect } from "react";
import {
  LocationContextType,
  LocationState,
  LocationCoordinates,
} from "../../types/management/LocationInterface";
import { LocationServices } from "../../services/LocationServices";

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {

  const [location, setLocation] = useState<LocationState>({
    errorMessage: null,
    permissionStatus: "undetermined",
  });
const [locationCoordinates, setLocationCoordinates] = useState<LocationCoordinates | null>(null);

useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const status = await LocationServices.requestLocationPermissions();
        setLocation((prev) => ({
          ...prev,
          permissionStatus: status as "granted" | "denied" | "undetermined",
        }));
      } catch (error: any) {
        setLocation((prev) => ({
          ...prev,
          errorMessage: error.message,
          permissionStatus: "denied",
        }));
      } finally {
        await getCurrentLocation();
      }
    };
    requestLocationPermission();
  }, []);

  const getCurrentLocation = async () => {
    try {
      const { latitude, longitude } =
        await LocationServices.getCurrentLocation();
      setLocationCoordinates({ latitude, longitude });
    } catch (error: any) {
      setLocation((prev) => ({
        ...prev,
        errorMessage: error.message,
      }));
    }
  };

  const value: LocationContextType = {
    location,
    getCurrentLocation,
    locationCoordinates,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export default LocationProvider;
