export interface OwnerAddress {
  address: string;
  postcode: string;
  city: string;
  country: string;
}

export interface CheckoutContextType {
  error: string | null;
  isLoading: boolean;
  handleCheckboxPress: () => void;
  isChecked: boolean;
  handleBillingAddress: (key: string, value: string) => void;
  billingAddress: BillingAddress | undefined;
  selectedCard: string | null;
  setSelectedCard: (cardId: string) => void;
  savedCards: CardType[];
  publishableKey: string;
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
