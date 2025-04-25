import { Colleague } from "./event";

export default interface SideComponentContextType {
  active: string;
  handleActivity: (activity: string) => void;
  event: LiveEventInterface;
  handlePhoneCall(phone?: string): void;
  handleWebsiteCall(url?: string): void;
  currentDate: CurrentDate;
  daysShift: LiveEventInterface[];
  fetchUpcomingShifts(): Promise<void>;
  handleNextShift(): void;
  handlePreviousShift(): void;
  currentShiftIndex: number;
  handleStartShift(shiftId: string): Promise<void>;
  handleEndShift(shiftId: string): Promise<void>;
  makeTaskComment(shiftId: string, comment: string): Promise<void>;
  isCommentModalVisible: boolean;
  setIsCommentModalVisible: (visible: boolean) => void;
}

export interface LiveEventInterface {
  shift_id?: string;
  task_serial?: string;
  start_time?: string;
  end_time?: string;
  contract_name?: string;
  team_member: Array<{
    staff_id: string;
    name: string;
  }>;
  status?: string;
  latitude?: string;
  longitude?: string;
}

export interface CurrentDate {
  month: string;
  day: string;
}
