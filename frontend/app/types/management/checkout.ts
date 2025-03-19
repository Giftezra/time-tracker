export interface OwnerDetails {
  address: string;
  postcode: string;
  city: string;
  country: string;
  phone: string;
}

export interface CheckoutContextType {
  ownerAddress: OwnerDetails | undefined;
  billingAddress: BillingAddress;
  handleBillingAddress: (field: keyof BillingAddress, value: string) => void;
  savedCards: CardType[];
  selectedCard: string;
  setSelectedCard: (id: string) => void;
  useOwnerAddress: boolean;
  setUseOwnerAddress: (value: boolean) => void;
  billingDetails: BillingDetails;
}

export interface BillingAddress {
  fullName: string;
  address: string;
  postcode: string;
  city: string;
  country: string;
  phone: string;
}

export interface CardType {
  id: string;
  last4: string;
  brand: string;
  isDefault: boolean;
}

export interface BillingDetails {
  numberOfEmployees: number;
  billingPeriod: string;
  ratePerEmployee: number;
  totalAmount: number;
}
