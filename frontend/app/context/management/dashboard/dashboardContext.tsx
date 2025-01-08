import { DashboardContextType } from "@/app/types/management/dashboard";
import { UserResponseType } from "@/app/types/management/onboarding";
import { loadUserData } from "@/app/utils/loadData";
import { user } from "@/app/utils/loadData";
import { useContext, createContext, useState, useEffect } from "react";

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

export const DashboardProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const value = {
    user,
  };

  return (
    <DashboardContext.Provider value={value}>
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboardContext = () => {
  const context = useContext(DashboardContext);
  if (context === undefined) {
    throw new Error(
      "useDashboardContext must be used within a DashboardProvider"
    );
  }
  return context;
};
