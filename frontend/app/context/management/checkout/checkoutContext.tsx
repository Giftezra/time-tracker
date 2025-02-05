import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useState,
} from "react";
import {
  BillingAddress,
  CardType,
  CheckoutContextType,
  OwnerAddress,
} from "@/app/types/management/checkout";
import axios from "axios";
import { useAuth } from "../authentication";
import { useStripe } from "@stripe/stripe-react-native";
import { Alert, Linking, Platform } from "react-native";

/** This is the context to handle the checkout page.
 * The context will have the following methods:
 * - getOwnerAddress : this will return the address of the owner and complete the promise or return null if the address is not set
 * - getTotalAmout : This method will return the total amountdue based on the number of employees
 */

const CheckoutContext = createContext<CheckoutContextType | null>(null);

const CheckoutProvider = ({ children }: { children: React.ReactNode }) => {
  const [publishableKey, setPublishableKey] = useState("");

  const { axiosInstance } = useAuth();
  const [ownerAddress, setOwnerAddress] = useState<OwnerAddress | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isChecked, setIsChecked] = useState(false);

  // Create the state for the payment sheet
  const { initPaymentSheet, presentPaymentSheet, handleURLCallback } =
    useStripe();

  const [billingAddress, setBillingAddress] = useState<
    BillingAddress | undefined
  >(undefined);

  const [selectedCard, setSelectedCard] = useState<string | null>(null);

  // Mock data - replace with actual data from your context or API
  const savedCards: CardType[] = [
    { id: "1", last4: "4242", brand: "visa", isDefault: true },
    { id: "2", last4: "5555", brand: "mastercard", isDefault: false },
  ];

  const handleCheckboxPress = () => {
    setIsChecked(!isChecked);
  };

  useEffect(() => {
    initializePaymentSheet();
  }, []);

  useEffect(() => {
    console.log("PaymentLayout useEffect triggered");

    const fetchPublishableKey = async () => {
      console.log("Starting to fetch publishable key...");
      setIsLoading(true);
      try {
        if (!axiosInstance) {
          console.log("axiosInstance is not initialized yet");
          return;
        }
        console.log("Making API request...");
        const response = await axiosInstance.get("/api/get/publishable/key/");
        console.log("Response received:", response);
        if (response.data?.publishableKey) {
          setPublishableKey(response.data.publishableKey);
          console.log("Successfully set publishable key");
        } else {
          console.log("No publishable key in response:", response.data);
        }
      } catch (error) {
        console.error("Failed to fetch publishable key:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchPublishableKey();
  }, [axiosInstance]);

  /**
   * Handle the deeplink from the payment sheet
   * Display the message to the user based on the platform
   */
  const handleDeepLink = useCallback(
    async (url: string | null) => {
      if (url) {
        const stripeHandled = await handleURLCallback(url);
        if (stripeHandled) {
          if (Platform.OS === "web") {
            window.confirm("Payment successful");
          } else {
            Alert.alert("Payment successful", "Payment successful");
          }
        }
      }
    },
    [handleURLCallback]
  );

  /**
   * This hook is used to handle the deep link from the payment sheet.
   *
   */
  useEffect(() => {
    const getUrlAsync = async () => {
      const initialUrl = await Linking.getInitialURL();
      handleDeepLink(initialUrl);
    };
    getUrlAsync();

    const deepLinkEventListener = Linking.addEventListener(
      "url",
      (event: { url: string }) => {
        handleDeepLink(event.url);
      }
    );

    return () => {
      deepLinkEventListener.remove();
    };
  }, [handleDeepLink]);

  /**
   * Get the payment sheet from the backend

   */
  const fetchPaymentSheet = async () => {
    const response = await axiosInstance.post("/api/get/payment/sheet/");
    console.log("Payment sheet response:", response.data);
    // Get the data from the response
    const { paymentIntent, ephemeralKey, customer } = response.data;

    return { paymentIntent, ephemeralKey, customer };
  };

  const initializePaymentSheet = async () => {
    const { paymentIntent, ephemeralKey, customer } = await fetchPaymentSheet();

    const { error } = await initPaymentSheet({
      merchantDisplayName: "Time Tracker",
      customerId: customer,
      customerEphemeralKeySecret: ephemeralKey,
      paymentIntentClientSecret: paymentIntent,

      // Set allowed payments methods to true
      allowsDelayedPaymentMethods: false,
    });

    if (error) {
      setError(error.message);
    }
  };

  const openPaymentSheet = async () => {
    const { error } = await presentPaymentSheet();
    if (error) {
      alert(`Payment sheet error: ${error.code}, ${error.message}`);
    } else {
      if (Platform.OS === "web") {
        window.confirm("Payment successful");
      } else {
        Alert.alert("Payment successful", "Payment successful");
      }
    }
  };

  /**
   * This method is used to get the billing address from the user and save it in the state given the key and value

   */
  const handleBillingAddress = (key: string, value: string) => {
    setBillingAddress((prevAddress) => ({
      fullName: prevAddress?.fullName || "",
      address: prevAddress?.address || "",
      postcode: prevAddress?.postcode || "",
      city: prevAddress?.city || "",
      country: prevAddress?.country || "",
      phone: prevAddress?.phone || "",
      ...prevAddress,
      [key]: value,
    }));
  };

  const value: CheckoutContextType = {
    error,
    isLoading,
    handleCheckboxPress,
    isChecked,
    handleBillingAddress,
    billingAddress,
    selectedCard,
    setSelectedCard,
    savedCards,
    publishableKey,
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
    throw new Error("useCheckout must be used within a CheckoutProvider");
  }
  return context;
};

export default CheckoutProvider;
