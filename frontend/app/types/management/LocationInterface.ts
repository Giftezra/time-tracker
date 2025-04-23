export interface LocationState {
  errorMessage: string | null;
  permissionStatus: "granted" | "denied" | "undetermined";
}

export default interface LocationContextType {
  locationState: LocationState;
  getCurrentLocation: () => Promise<void>;
  locationCoordinates: LocationCoordinates | null;
}

export interface LocationCoordinates {
  latitude: number;
  longitude: number;
}
