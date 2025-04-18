import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import React, { useEffect, useState } from "react";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  CardType,
  CurrentPlanDetails,
  SubscriptionHistoryInterface,
} from "@/app/types/management/payment";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import SubscriptionHistory from "./SubscriptionHistory";
import { useCheckout } from "@/app/context/management/payments/paymentContext";
import { FontAwesome } from "@expo/vector-icons";
import CheckoutComponent from "./Checkout";
import InnerThemedText from "../../helper/InnerThemedText";
import ButtonText from "@/app/component/helper/ButtonText";
const MySubscriptionPlansComponent = () => {
  const {
    currentPage,
    setCurrentPage,
    setOveragePlan,
    overagePlan,
    currentPlan,
    fetchSubscriptionHistory,
  } = useCheckout();

  const calculateOveragePlanCost = () => {
    const overagePlan =
      (currentPlan?.overage_fees ?? 0) * (currentPlan?.overage_count ?? 0);
    return Math.round(overagePlan * 100) / 100;
  };

  useEffect(() => {
    const overagePlan = calculateOveragePlanCost();
    setOveragePlan(overagePlan);
  }, [currentPlan]);

  const [subscriptionHistory, setSubscriptionHistory] = useState<
    SubscriptionHistoryInterface[]
  >([]);

  const [payOverage, setPayOverage] = useState(false);
  const [showSubscriptionHistory, setShowSubscriptionHistory] = useState(false);
  const [showCards, setShowCards] = useState(false);
  const [isSubscriptionHistoryLoading, setIsSubscriptionHistoryLoading] =
    useState(false);

  const warningColor = useThemeColor({}, "primaryColor");
  const primaryColor = useThemeColor({}, "primaryColor");
  const textColor = useThemeColor({}, "highlight");

  /* Load the subscription history from the database when the component is mounted */
  useEffect(() => {
    const loadSubscriptionHistory = async () => {
      try {
        setIsSubscriptionHistoryLoading(true);
        const history = await fetchSubscriptionHistory();
        if (history) {
          setSubscriptionHistory(history);
        } else {
          setSubscriptionHistory([]);
        }
      } catch (error) {
        console.error("Error fetching subscription history:", error);
      } finally {
        setIsSubscriptionHistoryLoading(false);
      }
    };
    loadSubscriptionHistory();
  }, []);

  const daysUntilExpiry = () => {
    const expiry = new Date(currentPlan?.renewal_date ?? "");
    const today = new Date();
    const diffTime = expiry.getTime() - today.getTime();
    return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
  };

  const { selectedCard, setSelectedCard, savedCards, billingDetails } =
    useCheckout();
  const primary = useThemeColor({}, "primaryColor");

  const renderCard = (card: CardType) => (
    <TouchableOpacity
      key={card.id}
      style={[
        styles.cardContainer,
        selectedCard === card.id && styles.selectedCard,
      ]}
      onPress={() => setSelectedCard(card.id)}
    >
      <View style={styles.cardInfo}>
        {card.brand === "visa" ? (
          <FontAwesome name="cc-visa" size={24} color={primary} />
        ) : (
          <FontAwesome name="cc-mastercard" size={24} color={primary} />
        )}
        <Text style={styles.cardText}>•••• {card.last4}</Text>
        {card.isDefault && <Text style={styles.defaultBadge}>Default</Text>}
      </View>
      <MaterialCommunityIcons
        name={selectedCard === card.id ? "radiobox-marked" : "radiobox-blank"}
        size={24}
        color={primary}
      />
    </TouchableOpacity>
  );

  /* Display the checkout component when the pay for overage button is pressed */
  if (payOverage && overagePlan) {
    return (
      <View style={styles.container}>
        <CheckoutComponent
          overagePlan={overagePlan}
          onBack={() => setPayOverage(false)}
        />
      </View>
    );
  }

  return currentPlan ? (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: textColor }]}>Current Plan</Text>
        <View
          style={[
            styles.statusBadge,
            {
              backgroundColor:
                currentPlan?.status === true ? "#4CAF50" : warningColor,
            },
          ]}
        >
          <Text style={styles.statusText}>
            {currentPlan?.status ? "Active" : "Expiring"}
          </Text>
        </View>
      </View>

      <View style={[styles.planCard, { backgroundColor: "#ffffff" }]}>
        <View style={styles.planHeaderSection}>
          <Text style={[styles.planName, { color: primaryColor }]}>
            {`${currentPlan?.plan_name} Plan`}
          </Text>
          <Text style={styles.periodText}>
            {(currentPlan?.billing_cycle ?? "").charAt(0).toUpperCase() +
              (currentPlan?.billing_cycle ?? "").slice(1)}{" "}
            billing
          </Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.infoSection}>
          <View style={styles.infoRow}>
            <Text style={styles.label}>Employees</Text>
            <View style={styles.valueContainer}>
              <Text style={[styles.value, { color: textColor }]}>
                {currentPlan?.current_employees}
                <Text style={styles.valueSecondary}>
                  {" "}
                  / {currentPlan?.plan_limit}
                </Text>
              </Text>
            </View>
          </View>

          {(currentPlan?.overage_count ?? 0) > 0 && (
            <View style={styles.overageContainer}>
              <Text style={[styles.overageText, { color: warningColor }]}>
                Overage: {currentPlan?.overage_count} employees
              </Text>
              <Text style={[styles.overageFees, { color: warningColor }]}>
                Additional fees: ${currentPlan?.overage_fees}
              </Text>
            </View>
          )}

          <View style={styles.infoRow}>
            <Text style={styles.label}>Plan Expires</Text>
            <Text style={[styles.value, { color: textColor }]}>
              {currentPlan?.renewal_date}
            </Text>
          </View>

          <View style={[styles.expiryAlert, { backgroundColor: "#F8F9FA" }]}>
            <Text style={[styles.expiryText, { color: textColor }]}>
              {daysUntilExpiry()} days until plan renewal
            </Text>
          </View>
        </View>
      </View>

      <View style={styles.divider} />

      <View style={[styles.planCard,]}>
        <TouchableOpacity
          style={styles.historyHeader}
          onPress={() => setShowSubscriptionHistory(!showSubscriptionHistory)}
        >
          <Text style={styles.historyTitle}>Subscription History</Text>
          <Text style={styles.toggleText}>
            {showSubscriptionHistory ? "Hide" : "Show"}
          </Text>
        </TouchableOpacity>

        {showSubscriptionHistory && (
          <View style={styles.historyList}>
            {subscriptionHistory.map((item) => (
              <SubscriptionHistory key={item.id} props={item} />
            ))}
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={[styles.planCard,]}>
        <TouchableOpacity
          style={styles.historyHeader}
          onPress={() => setShowCards(!showCards)}
        >
          <Text style={styles.historyTitle}>Payment Methods</Text>
          <Text style={styles.toggleText}>{showCards ? "Hide" : "Show"}</Text>
        </TouchableOpacity>

        {showCards && savedCards && (
          <View style={styles.cardsList}>
            {savedCards.map((card) => renderCard(card))}
          </View>
        )}
      </View>

      <View style={styles.divider} />

      <View style={styles.infoContainer}>
        <InnerThemedText
          text={`You can pay for your overage now, reduce the number of staff to ${currentPlan?.plan_limit} or increase your plan limit to avoid overage fees`}
        />

        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={[styles.button,]}
            onPress={() => {
              setPayOverage(true);
              setOveragePlan(calculateOveragePlanCost());
            }}
          >
            <ButtonText
              text={`Pay £${calculateOveragePlanCost()} for overage`}
            />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.button, { backgroundColor: primaryColor }]}
            onPress={() => setCurrentPage("Plans")}
          >
            <ButtonText text="Increase Plan Limit" />
          </TouchableOpacity>
        </View>
      </View>
    </View>
  ) : (
    <View style={[styles.container, styles.noPlanContainer]}>
      <MaterialCommunityIcons
        name="credit-card-off-outline"
        size={64}
        color={primaryColor}
      />
      <Text style={[styles.noPlanTitle, { color: textColor }]}>
        No Active Plan
      </Text>
      <Text style={styles.noPlanDescription}>
        You currently don't have any subscription plan set up
      </Text>
      <TouchableOpacity
        style={[
          styles.button,
          styles.noPlanButton,
          { backgroundColor: primaryColor },
        ]}
        onPress={() => setCurrentPage("Plans")}
      >
        <ButtonText text="View Available Plans" />
      </TouchableOpacity>
    </View>
  );
};

export default MySubscriptionPlansComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: "700",
    marginRight: 12,
  },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  statusText: {
    color: "white",
    fontSize: 14,
    fontWeight: "600",
    textTransform: "capitalize",
  },
  planCard: {
    borderRadius: 5,
    padding: 5,
    marginBottom: 5,
  },
  planHeaderSection: {
    marginBottom: 20,
  },
  planName: {
    fontSize: 20,
    fontWeight: "700",
    marginBottom: 8,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
  },
  periodText: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  divider: {
    height: 1,
    backgroundColor: "#E5E7EB",
    marginVertical: 20,
  },
  infoSection: {
    gap: 16,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 4,
  },
  label: {
    fontSize: 16,
    color: "#6B7280",
    fontWeight: "500",
  },
  valueContainer: {
    flexDirection: "row",
    alignItems: "center",
  },
  value: {
    fontSize: 16,
    fontWeight: "600",
  },
  valueSecondary: {
    color: "#6B7280",
    fontWeight: "400",
  },
  overageContainer: {
    backgroundColor: "#FEF2F2",
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#FEE2E2",
    marginVertical: 8,
  },
  overageText: {
    fontSize: 15,
    fontWeight: "600",
    marginBottom: 4,
  },
  overageFees: {
    fontSize: 14,
    fontWeight: "500",
  },
  expiryAlert: {
    marginTop: 12,
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: "#E5E7EB",
    backgroundColor: "#F8F9FA",
  },
  expiryText: {
    fontSize: 14,
    fontWeight: "500",
    textAlign: "center",
  },
  infoContainer: {
    marginBottom: 20,
  },
  infoText: {
    fontSize: 15,
    color: "#374151",
    lineHeight: 22,
    textTransform: "none",
  },
  buttonContainer: {
    flexDirection: "row",
    gap: 12,
    marginTop: 8,
  },
  button: {
    flex: 1,
    padding: 14,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    color: "white",
    fontSize: 15,
    fontWeight: "600",
  },
  subscriptionHistoryContainer: {
    marginTop: 20,
  },
  subscriptionHistoryTitle: {
    fontSize: 20,
  },
  historyHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 5,
  },
  historyTitle: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    color: "#374151",
  },
  toggleText: {
    fontSize: 14,
    color: "#6B7280",
  },
  historyList: {
    marginTop: 12,
  },
  selectedCard: {
    backgroundColor: "#e0e0e0",
    borderWidth: 1,
  },

  cardInfo: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },

  cardText: {
    fontSize: 16,
    marginLeft: 8,
  },

  defaultBadge: {
    fontSize: 12,
    backgroundColor: "#e3f2fd",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 4,
  },

  cardContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    padding: 10,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
    marginBottom: 8,
  },

  cardsList: {
    marginTop: 12,
    gap: 8,
  },

  noPlanContainer: {
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    gap: 16,
  },
  noPlanTitle: {
    fontSize: 24,
    fontWeight: "700",
    marginTop: 16,
    fontFamily: "BarlowRegular",
  },
  noPlanDescription: {
    fontSize: 16,
    color: "#6B7280",
    textAlign: "center",
    marginBottom: 8,
  },
  noPlanButton: {
    width: "100%",
    maxWidth: 300,
    marginTop: 8,
  },
});
