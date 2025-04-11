export interface LocationState {
  errorMessage: string | null;
  permissionStatus: "granted" | "denied" | "undetermined";
}

export interface LocationContextType {
  location: LocationState;
  getCurrentLocation: () => Promise<void>;
  locationCoordinates: LocationCoordinates | null;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}
