import {
  StyleSheet,
  Text,
  View,
  ScrollView,
  TouchableOpacity,
} from "react-native";
import React, { useContext, useState } from "react";
import { FontAwesome, MaterialCommunityIcons } from "@expo/vector-icons";
import { useThemeColor } from "@/hooks/useThemeColor";
import { CardType } from "@/app/types/management/checkout";
import { useCheckout } from "@/app/context/management/checkout/checkoutContext";

const PaymentComponent = () => {
  const { selectedCard, setSelectedCard, savedCards } = useCheckout();

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

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Payment Method</Text>

      <ScrollView style={styles.cardsContainer}>
        {savedCards.map(renderCard)}
      </ScrollView>

      <View style={styles.billingDetailsContainer}>
        <Text style={styles.subtitle}>Billing Summary</Text>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Number of Employees:</Text>
          <Text style={styles.billingValue}>15</Text>
        </View>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Billing Period:</Text>
          <Text style={styles.billingValue}>March 1 - March 31, 2024</Text>
        </View>

        <View style={styles.billingRow}>
          <Text style={styles.billingLabel}>Rate per Employee:</Text>
          <Text style={styles.billingValue}>$10.00</Text>
        </View>

        <View style={[styles.billingRow, styles.totalRow]}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalValue}>$150.00</Text>
        </View>
      </View>
    </View>
  );
};

export default PaymentComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 15,
  },
  
  title: {
    fontSize: 15,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    marginBottom: 16,
  },

  cardsContainer: {
    maxHeight: 200,
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

  billingDetailsContainer: {
    marginTop: 24,
    padding: 15,
    backgroundColor: "#f5f5f5",
    borderRadius: 8,
  },

  subtitle: {
    fontSize: 14,
    fontWeight: "700",
    fontFamily: "BarlowRegular",
    marginBottom: 16,
  },

  billingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 12,
  },

  billingLabel: {
    fontSize: 14,
    color: "#666",
  },
  billingValue: {
    fontSize: 14,
    fontWeight: "500",
  },
  totalRow: {
    marginTop: 8,
    paddingTop: 8,
    borderTopWidth: 1,
    borderTopColor: "#ddd",
  },
  totalLabel: {
    fontSize: 15,
    fontFamily: "BarlowRegular",
    fontWeight: "700",
  },

  totalValue: {
    fontSize: 16,
    fontWeight: "bold",
  },
});
