/**
 * LocationProvider manages device location state and permissions using React Context.
 *
 * Key features:
 * - Handles location permission requests
 * - Tracks current location coordinates
 * - Manages location-related errors
 * - Provides location data to child components
 *
 * Usage:
 * ```tsx
 * // Wrap components that need location data
 * <LocationProvider>
 *   <YourComponent />
 * </LocationProvider>
 *
 * // Access location data in child components
 * const { locationCoordinates, getCurrentLocation } = useLocation();
 * ```
 */

import React, { createContext, useContext, useState, useEffect } from "react";
import LocationContextType, {
  LocationState,
  LocationCoordinates,
} from "@/app/types/management/LocationInterface";
import { LocationServices } from "../../services/LocationServices";

const LocationContext = createContext<LocationContextType | undefined>(
  undefined
);

const LocationProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const [locationState, setLocationState] = useState<LocationState>({
    errorMessage: null,
    permissionStatus: "undetermined",
  });
  const [locationCoordinates, setLocationCoordinates] =
    useState<LocationCoordinates | null>(null);

  /**
   * Requests location permissions and initializes location tracking.
   * Called automatically when the component mounts.
   * Updates permission status and handles any errors.
   * If successful, attempts to get current location.
   */
  useEffect(() => {
    const requestLocationPermission = async () => {
      try {
        const status = await LocationServices.requestLocationPermissions();
        setLocationState((prev) => ({
          ...prev,
          permissionStatus: status as "granted" | "denied" | "undetermined",
        }));
      } catch (error: any) {
        setLocationState((prev) => ({
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

  /**
   * Gets the current device location coordinates.
   * Updates locationCoordinates state on success.
   * Updates error message in location state if failed.
   * @returns {Promise<void>}
   */
  const getCurrentLocation = async () => {
    try {
      const { latitude, longitude } =
        await LocationServices.getCurrentLocation();
      setLocationCoordinates({ latitude, longitude });
    } catch (error: any) {
      setLocationState((prev) => ({
        ...prev,
        errorMessage: error.message,
      }));
    }
  };

  const value: LocationContextType = {
    locationState,
    getCurrentLocation,
    locationCoordinates,
  };

  return (
    <LocationContext.Provider value={value}>
      {children}
    </LocationContext.Provider>
  );
};

/**
 * Hook to access location context.
 * @returns {LocationContextType} Object containing:
 *  - location: Current location state (permissions and errors)
 *  - locationCoordinates: Current latitude and longitude
 *  - getCurrentLocation: Function to update current location
 * @throws {Error} If used outside of LocationProvider
 */
export const useLocation = () => {
  const context = useContext(LocationContext);
  if (context === undefined) {
    throw new Error("useLocation must be used within a LocationProvider");
  }
  return context;
};

export default LocationProvider;
