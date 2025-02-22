import { BillingAddress, BillingDetails, CardType, CheckoutContextType, OwnerAddress } from "@/app/types/management/checkout";
import { useStripe } from "@stripe/stripe-react-native";
import { createContext, useCallback, useContext, useState } from "react";

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

    /* Declare the states required for the context */
    const [publishableKey, setPublishableKey] = useState<string | undefined>(undefined)

    const [ownerAddress, setOwnerAddress] = useState<OwnerAddress | undefined>(undefined)
    const [billingAddress, setBillingAddress] = useState<BillingAddress | undefined>(undefined)
    const [billingDetails, setBillingDetails] = useState<BillingDetails | undefined>(undefined)
    const [selectedCard, setSelectedCard] = useState<CardType | undefined>(undefined)
    const [savedCards, setSavedCards] = useState<CardType[]>([])
    const [isChecked, setIsChecked] = useState<boolean>(false)
    



  const value = {};

  return (
    <CheckoutContext.Provider value={value}>
      {children}
    </CheckoutContext.Provider>
  );
};

export const useCheckoutContext = () => {
  const context = useContext(CheckoutContext);
  if (!context) {
    throw new Error(
      "useCheckoutContext must be used within a CheckoutContextProvider"
    );
  }
  return context;
};

export default CheckoutContextProvider;
