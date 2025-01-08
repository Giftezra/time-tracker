import {
  DashboardOngoingTaskType,
  StaffDashboardContextType,
} from "@/app/types/staff/dashboard";
import { useContext, createContext, useState } from "react";
const DashboardContext = createContext<StaffDashboardContextType | undefined>(
  undefined
);

/**
 * Create the provider for the dashboard consumer.
 * The provider is used to fetch the data from the server and to also manipulate other data that would be consumed by the dashboard and its child components.
 */
const StaffDashboardProvider = ({ children }: { children: React.ReactNode }) => {
  const ongoing: DashboardOngoingTaskType = {
    contractName: "amberstone",
    taskStartTime: "12:00",
    taskEndTime: "18:00",
  };

  const [ongoingTask, setOngoingTask] =
    useState<DashboardOngoingTaskType | null>(null);

  /**
   *  This method is used to retrieve the ongoing task data from the server.
   * @param null
   * @returns Promise<DashboardOngoingTaskType>
   */
  const value = {
    ongoing,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

/**
 * This is a custom hook that is used to consume the dashboard context.
 * It is used to access the data that is provided by the dashboard provider.
 */
export const useStaffDashboard = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error("useDashboard must be used within a DashboardProvider");
  }
  return context;
};

export default StaffDashboardProvider;
