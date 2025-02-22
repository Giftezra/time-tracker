import {
  ContractStatistic,
  DashboardContextType,
} from "@/app/types/management/dashboard";
import { UserResponseType } from "@/app/types/management/onboarding";
import { loadUserData, userData } from "@/app/utils/loadData";
import { useContext, createContext, useState, useEffect } from "react";
import { useAuth } from "../../authentication";

const DashboardContext = createContext<DashboardContextType | undefined>(
  undefined
);

const DashboardProvider = ({ children }: { children: React.ReactNode }) => {
  // Get the axios instance
  const { axiosInstance } = useAuth();
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [contractStats, setContractStats] = useState<ContractStatistic[]>([]);

  const fetchContractStatistics = async (year?: number) => {
    try {
      const response = await axiosInstance.get("api/get/contract/statistics/", {
        params: { year },
      });
      setContractStats(response.data.statistics);
      return response.data.statistics;
    } catch (error) {
      console.error("Error fetching contract statistics:", error);
      return [];
    } finally {
    }
  };

  const value = {
    user: userData(),
    contractStats,
    isLoading,
    fetchContractStatistics,
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

export default DashboardProvider;
