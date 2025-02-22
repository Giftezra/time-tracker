export interface EventDisplayInterface {
  id: string;
  site_name: string;
  site_address: string;
  site_postcode: string;
  start_date?: string;
  start_time: string;
  end_time: string;
  information: string;
}

export interface EventDetailsInterface {
  id?: string;
  client: string;
  site_name: string;
  site_address: string;
  site_postcode: string;
  start_time: string;
  end_time: string;
  information: string;
  pay: string;
  colleague: Colleague[];
}

export interface Colleague {
  name: string;
  staff_id: string;
}

/**
 * Type defines the methods and states manages in the event provider
 */
export interface EventProviderInterface {
  handlePress: (id: string, name: string) => void;
  handleMessageNavigation: () => void;
  handleModal: () => void;
  isClicked: boolean;
  isModalOpen: boolean;
  retrieveShiftDetails: (id: string) => Promise<EventDetailsInterface | undefined>;
  assignedShifts: EventDisplayInterface[];
}

export interface LiveEventInterface {
  event_serial: string | undefined;
  month: string | undefined;
  date: string | undefined;
  start_time: string | undefined;
  end_time: string | undefined;
  event: string | undefined;
  team_member: TeamMemberInterface[];
}

export interface TeamMemberInterface {
  id: string;
  name: string;
}
