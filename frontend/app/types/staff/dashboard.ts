export type StaffDashboardContextType = {
    ongoing: DashboardOngoingTaskType;
};

export type DashboardOngoingTaskType = {
  contractName: string;
  taskStartTime: string;
  taskEndTime: string;
};
