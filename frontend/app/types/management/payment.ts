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
  subscriptionTiers: SubscriptionPlanTiers[];
  selectedPlan: SubscriptionPlanTiers | null;
  setSelectedPlan: (plan: SubscriptionPlanTiers) => void;
  billingPeriod: "monthly" | "yearly";
  toggleBillingPeriod: () => void;
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

export interface SubscriptionPlanTiers {
  id: string;
  name: string;
  description: string;
  features: string[];
  isPopular?: boolean;
  numberOfEmployees?: number;
  rate?: number;
  overageFee?: number;
}

export interface CurrentPlanDetails {
  planName: string;
  currentEmployees: number;
  planLimit: number;
  overageCount: number;
  overageFees: number;
  expiryDate: string;
  overageDuration?: number;
  billingPeriod: "monthly" | "yearly";
  status: "active" | "expiring" | "overdue";
}
