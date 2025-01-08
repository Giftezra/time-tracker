export type EventDisplayProps = {
  id: string;
  site_name: string;
  site_address: string;
  site_postcode: string;
  start_time: string;
  end_time: string;
  information: string;
}

export type EventProps = {
  client: string;
  site_name: string;
  site_address: string;
  site_postcode: string;
  start_time: string;
  end_time: string;
  information: string;
  pay: string;
  paylevel: string;
  department: string;
  colleague: Colleague[];
}

export type Colleague = {
  name: string;
  staff_id: string;
}

/**
 * Type defines the methods and states manages in the event provider
 */
export type EventProviderType = {
  handlePress: (id:string, name:string) => void;
  handleMessageNavigation: () => void;
  handleModal: () => void;
  isClicked: boolean;
  isModalOpen: boolean;
  retrieveShiftDetails: (id: string) => void;
}

export type LiveEventProps = {
  event_serial : string | undefined;
  month : string | undefined;
  date : string | undefined;
  start_time : string | undefined;
  end_time : string | undefined;
  event : string | undefined;
  team_member : TeamMemberProps[]

}

export type TeamMemberProps = {
  id : string;
  name : string;
}