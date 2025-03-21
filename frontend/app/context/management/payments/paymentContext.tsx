import {
  BillingAddress,
  BillingDetails,
  CardType,
  CheckoutContextType,
  OwnerDetails,
  SubscriptionPlanTiers,
} from "@/app/types/management/payment";
import { userData } from "@/app/utils/loadData";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "../../authentication";

const CheckoutContext = createContext<CheckoutContextType | undefined>(
  undefined
);

/**
 * This provider is used to manage the checkout page and would be used to complete the following actions:
 * - Manage the owner address
 * - Manage the billing address
 * - Manage the payment method
 * - Manage the checkout process
 * - Manage the order summary
 */

const PaymentContext = ({ children }: { children: React.ReactNode }) => {
  const user = userData();
  const { axiosInstance } = useAuth();

  const [publishableKey, setPublishableKey] = useState<string>("");
  const [ownerAddress, setOwnerAddress] = useState<OwnerDetails>(); // Payment states
  const [savedCards, setSavedCards] = useState<CardType[]>([
    { id: "1", last4: "4242", brand: "visa", isDefault: true },
    { id: "2", last4: "5555", brand: "mastercard", isDefault: false },
  ]);
  const [selectedCard, setSelectedCard] = useState<string>(savedCards[0]?.id);
  const [subscriptionTiers, setSubscriptionTiers] = useState<
    SubscriptionPlanTiers[]
  >([]);
  const [useOwnerAddress, setUseOwnerAddress] = useState(false);

  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanTiers | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">(
    "monthly"
  );
  const toggleBillingPeriod = () => {
    setBillingPeriod((prev) => (prev === "monthly" ? "yearly" : "monthly"));
  };
  // Update owner address when user data becomes available
  useEffect(() => {
    if (user) {
      setOwnerAddress({
        address: user.address || "",
        postcode: user.postcode || "",
        city: user.city || "",
        country: user.country || "",
        phone: user.phone || "",
      });
    }
  }, [user]);

  useEffect(() => {
    const fetchData = async () => {
      await fetchSubscriptionTiers();
    };
    fetchData();
  }, []);

  // Billing address state
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    fullName: "",
    address: "",
    postcode: "",
    city: "",
    country: "",
    phone: "",
  });

  const handleBillingAddress = (field: keyof BillingAddress, value: string) => {
    setBillingAddress((prev: any) => ({ ...prev, [field]: value }));
  };

  /**
   * Get the subscription tiers for the apps from the server.
   * Set the subscription tiers to the state immediately.
   */
  const fetchSubscriptionTiers = async () => {
    try {
      const response = await axiosInstance.get("/api/get/subscription/tiers/");
      if (response.status === 200) {
        setSubscriptionTiers(response.data.subscriptionTiers);
      }
    } catch (error) {
      console.error("Error fetching subscription tiers:", error);
    }
  };

  const handleContinue = () => {
    
  };

  const value: CheckoutContextType = {
    ownerAddress,
    billingAddress,
    handleBillingAddress,
    savedCards,
    selectedCard,
    setSelectedCard,
    useOwnerAddress,
    setUseOwnerAddress,
    subscriptionTiers,
    selectedPlan,
    setSelectedPlan,
    billingPeriod,
    toggleBillingPeriod,
  };

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckout = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error(
      "useCheckout must be used within a CheckoutContextProvider"
    );
  }
  return context;
};

export default PaymentContext;
