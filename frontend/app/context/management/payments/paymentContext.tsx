import {
  BillingAddress,
  BillingDetails,
  CardType,
  CurrentPlanDetails,
  OwnerDetails,
  PaymentDetails,
  SubscriptionHistoryInterface,
  SubscriptionPlanTiers,
} from "@/app/types/management/payment";
import CheckoutContextType from "@/app/types/management/payment";
import { userData } from "@/app/utils/loadData";
import { createContext, useContext, useState, useEffect } from "react";
import { useAuth } from "@/app/authentication";
import { useStripe, PaymentSheetError } from "@stripe/stripe-react-native";
import { Alert } from "react-native";

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
  const { axiosInstance, setIsAlertVisible, setAlertConfig } = useAuth();

  const { initPaymentSheet, presentPaymentSheet } = useStripe();
  const [isCheckoutLoading, setIsCheckoutLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState<string>("My Plans");
  const [showCheckout, setShowCheckout] = useState(false);
  const [ownerAddress, setOwnerAddress] = useState<OwnerDetails>();
  // Add new state for final price
  const [finalPrice, setFinalPrice] = useState<number>(0);
  const [savedCards, setSavedCards] = useState<CardType[]>([
    { id: "1", last4: "4242", brand: "visa", isDefault: true },
    { id: "2", last4: "5555", brand: "mastercard", isDefault: false },
  ]);
  const [overagePlan, setOveragePlan] = useState<number>(0);
  const [selectedCard, setSelectedCard] = useState<string>(savedCards[0]?.id);
  const [subscriptionTiers, setSubscriptionTiers] = useState<
    SubscriptionPlanTiers[]
  >([]);
  const [currentPlan, setCurrentPlan] = useState<
    CurrentPlanDetails | undefined
  >(undefined);
  const [useOwnerAddress, setUseOwnerAddress] = useState(false);
  const [selectedPlan, setSelectedPlan] =
    useState<SubscriptionPlanTiers | null>(null);
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "annually">(
    "monthly"
  );
  const toggleBillingPeriod = () => {
    setBillingPeriod((prev) => (prev === "monthly" ? "annually" : "monthly"));
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
  const [billingAddress, setBillingAddress] = useState<
    BillingAddress | undefined
  >();
  const [paymentDetails, setPaymentDetails] = useState<
    PaymentDetails | undefined
  >(undefined);

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

  /**
   * Calculate the final price for the subscription plan.
   * @param plan - The subscription plan to calculate the price for.
   * @param period - The billing period to calculate the price for.
   * @returns The final price for the subscription plan.
   */
  const calculateFinalPrice = (
    plan: SubscriptionPlanTiers | null,
    period: "monthly" | "annually"
  ) => {
    if (!plan || !plan.rate || !plan.numberOfEmployees) return 0;

    const basePrice = plan.rate * plan.numberOfEmployees;

    if (period === "annually") {
      const yearlyPrice = basePrice * 12;
      const discount = getYearlyDiscount(plan.name);
      return yearlyPrice * discount;
    }

    return basePrice;
  };

  /**
   * Get the yearly discount for the subscription plan.
   * @param planName - The name of the subscription plan.
   * @returns The yearly discount for the subscription plan.
   */
  const getYearlyDiscount = (planName: string) => {
    switch (planName.toLowerCase()) {
      case "basic":
      case "starter":
        return 0.96;
      case "pro":
      case "enterprise":
        return 0.92;
      case "ultimate":
        return 0.9;
      default:
        return 1;
    }
  };

  useEffect(() => {
    const retrieveCurrentPlan = async () => {
      await fetchCurrentPlan();
    };
    retrieveCurrentPlan();
  }, []);

  // Update price when plan or billing period changes
  useEffect(() => {
    if (selectedPlan && billingPeriod) {
      const price = calculateFinalPrice(selectedPlan, billingPeriod);
      setFinalPrice(price);
    } else if (overagePlan) {
      setFinalPrice(overagePlan);
    }
  }, [selectedPlan, billingPeriod, overagePlan]);

  /**
   * Fetch the payment sheet details from the server.
   * Convert the price to cents for Stripe.
   * Return the response from the server.
   */
  // In paymentContext.tsx
  // In paymentContext.tsx
  const fetchPaymentSheetDetails = async () => {
    try {
      const amountInCents = Math.round(finalPrice * 100);
      const response = await axiosInstance.post("/api/create/payment/sheet/", {
        amount: amountInCents,
        plan_id: selectedPlan?.id,
        billing_period: billingPeriod,
      });

      if (response.status === 200) {
        return response.data;
      }
    } catch (error) {
      console.error("Error fetching payment sheet details:", error);
      throw error; // Re-throw to be caught by calling function
    }
  };

  /**
   * The method is designed to initialize the payment sheet when the checkout page is opened.
   * Call the fetchPaymentSheetDetails method to fetch the payment sheet details from the server.
   * Then call the initPaymentSheet method to initialize the payment sheet.
   */
  const initializePaymentSheet = async () => {
    try {
      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetDetails();

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: "Time Trackr",
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
        applePay:{
          merchantCountryCode: "GB",
        },
        googlePay:{
          merchantCountryCode: "GB",
          testEnv: true,
          currencyCode: "GBP",
        }
      });

      if (!error) {
        setIsCheckoutLoading(true);
      }
    } catch (error: any) {
      console.error("Error initializing payment sheet:", error);
    }
  };

  /**
   * Update the subscription plan after successful payment
   */
  const updateSubscriptionPlan = async () => {
    try {
      if (!selectedPlan?.id) {
        console.error("No plan selected");
        return false;
      }

      const response = await axiosInstance.post(
        "/api/update/subscription/plan/",
        {
          tier_id: selectedPlan.id,
          billing_period: billingPeriod,
        }
      );

      if (response.status === 200) {
        // Refresh the current plan details
        await fetchCurrentPlan();
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Success",
          message: response.data.message,
          onConfirm: () => setIsAlertVisible(false),
          isVisible: true,
        });
        return true;
      }else{
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Error",
          message: response.data.error,
          onConfirm: () => setIsAlertVisible(false),
          isVisible: true,
          type: "error",
        });
      } 
      return false;
    } catch (error: any) {
      console.error(
        "Error updating subscription plan:",
        error.response?.data?.error || error.message
      );
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message:
          error.response?.data?.error || "Failed to update subscription plan",
        onConfirm: () => setIsAlertVisible(false),
        isVisible: true,
        type: "error",
      });
      return false;
    }
  };

  /**
   * The method is designed to open the payment sheet when clicked on the checkout page.
   * Call the initializePaymentSheet method to initialize the payment sheet first on the server.
   * Then call the presentPaymentSheet method to present the payment sheet to the user.
   */
  const openPaymentSheet = async () => {
    try {
      await initializePaymentSheet();
      const { error } = await presentPaymentSheet();

      if (!error) {
        const updated = await updateSubscriptionPlan();
        // If the plan is updated successfully, show the user a success al
      } else {
        // Handle failed payment error
        setIsAlertVisible(true);
        setAlertConfig({
          title: "Status",
          message: "Payment failed. Please try again.",
          onConfirm: () => setIsAlertVisible(false),
          isVisible: true,
          type: "error",
        });
      }
    } catch (error) {
      console.log("Error opening payment sheet:", error);
    } finally {
      setIsCheckoutLoading(false);
    }
  };

  /**
   * Fetch the current plan from the server.
   * Set the current plan to the state immediately.
   */
  const fetchCurrentPlan = async () => {
    try {
      const response = await axiosInstance.get("/api/get/current/plan/");
      if (response.status === 200) {
        const currentPlan: CurrentPlanDetails = response.data.subscription_plan;
        setCurrentPlan(currentPlan);
      }
    } catch (error) {
      console.log("Error fetching current plan:", error);
    }
  };

  const fetchSubscriptionHistory = async (): Promise<
    SubscriptionHistoryInterface[]
  > => {
    try {
      const response = await axiosInstance.get(
        "/api/get/subscription/history/"
      );
      if (response.status === 200) {
        const history: SubscriptionHistoryInterface[] =
          response.data.subscription_history;
        console.log(response.data.message);
        return history;
      } else {
        console.log(response.data.error);
        return [];
      }
    } catch (error) {
      console.error("Error fetching subscription history:", error);
      return [];
    }
  };

  const [billingDetails, setBillingDetails] = useState<BillingDetails>({
    numberOfEmployees: 0,
    billingPeriod: "monthly",
    ratePerEmployee: 0,
    totalAmount: 0,
  });

  /**
   * Handle direct overage payment without going through checkout
   */
  const handleDirectOveragePayment = async () => {
    try {
      setIsCheckoutLoading(true);
      const amountInCents = Math.round(overagePlan * 100);

      const { paymentIntent, ephemeralKey, customer } =
        await fetchPaymentSheetDetails();

      const { error } = await initPaymentSheet({
        paymentIntentClientSecret: paymentIntent,
        merchantDisplayName: "Time Trackr",
        customerEphemeralKeySecret: ephemeralKey,
        customerId: customer,
      });

      if (!error) {
        const { error: presentError } = await presentPaymentSheet();

        if (!presentError) {
          setIsAlertVisible(true);
          setAlertConfig({
            title: "Payment successful",
            message: "Your overage payment has been processed successfully!",
            onConfirm: () => {
              setIsAlertVisible(false);
              fetchCurrentPlan(); // Refresh the current plan details
            },
            isVisible: true,
          });
          return true;
        }
      }
      return false;
    } catch (error) {
      console.error("Error processing overage payment:", error);
      setIsAlertVisible(true);
      setAlertConfig({
        title: "Error",
        message: "Failed to process overage payment. Please try again.",
        onConfirm: () => setIsAlertVisible(false),
        isVisible: true,
        type: "error",
      });
      return false;
    } finally {
      setIsCheckoutLoading(false);
    }
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
    showCheckout,
    setShowCheckout,
    billingDetails,
    setBillingDetails,
    paymentDetails,
    setPaymentDetails,
    currentPage,
    setCurrentPage,
    openPaymentSheet,
    isCheckoutLoading,
    finalPrice,
    overagePlan,
    setOveragePlan,
    currentPlan,
    fetchSubscriptionHistory,
    handleDirectOveragePayment,
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
