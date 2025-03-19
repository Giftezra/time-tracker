import {
  BillingAddress,
  BillingDetails,
  CardType,
  CheckoutContextType,
  OwnerDetails,
} from "@/app/types/management/checkout";
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

const CheckoutContextProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const user = userData();
  const { axiosInstance } = useAuth();

  const [publishableKey, setPublishableKey] = useState<string>("");
  const [ownerAddress, setOwnerAddress] = useState<OwnerDetails>();

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

  // Billing address state
  const [billingAddress, setBillingAddress] = useState<BillingAddress>({
    fullName: "",
    address: "",
    postcode: "",
    city: "",
    country: "",
    phone: "",
  });

  // Payment states
  const [savedCards, setSavedCards] = useState<CardType[]>([
    { id: "1", last4: "4242", brand: "visa", isDefault: true },
    { id: "2", last4: "5555", brand: "mastercard", isDefault: false },
  ]);
  const [selectedCard, setSelectedCard] = useState<string>(savedCards[0]?.id);

  // Checkbox state for using owner address as billing
  const [useOwnerAddress, setUseOwnerAddress] = useState(false);

  // Billing details
  const [billingDetails] = useState<BillingDetails>({
    numberOfEmployees: 15,
    billingPeriod: "Monthly",
    ratePerEmployee: 10,
    totalAmount: 150,
  });

  const handleBillingAddress = (field: keyof BillingAddress, value: string) => {
    setBillingAddress((prev) => ({ ...prev, [field]: value }));
  };

  /**
   * Get the publishable key for Stripe payment processing from the server.
   * Set the publishable key to the state immediately.
   */
  const fetchPublishableKey = async () => {
    try {
      const response = await axiosInstance.get("/api/get/publishable/key/");
      setPublishableKey(response.data.publishableKey);
      console.log(response.data);
    } catch (error) {
      console.error("Error fetching publishable key:", error);
    }
  };

  useEffect(() => {
    
  })

  const value: CheckoutContextType = {
    ownerAddress,
    billingAddress,
    handleBillingAddress,
    savedCards,
    selectedCard,
    setSelectedCard,
    useOwnerAddress,
    setUseOwnerAddress,
    billingDetails,
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

export default CheckoutContextProvider;
