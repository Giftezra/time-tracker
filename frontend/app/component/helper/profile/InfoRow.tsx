import { Pressable, StyleSheet, Text, View } from 'react-native'
import React from 'react'

// Helper Components
const InfoRow = ({
  label,
  value,
  isClickable,
  onPress,
}: {
  label: string;
  value?: string | null;
  isClickable?: boolean;
  onPress?: () => void;
}) => (
  <View style={styles.infoRow}>
    <Text style={styles.infoLabel}>{label}</Text>
    {isClickable ? (
      <Pressable onPress={onPress}>
        <Text style={[styles.infoValue, styles.clickableText]}>
          {value || "N/A"}
        </Text>
      </Pressable>
    ) : (
      <Text style={styles.infoValue}>{value || "N/A"}</Text>
    )}
  </View>
);

export default InfoRow

const styles = StyleSheet.create({
  clickableText: {
    color: "#007AFF",
  },
  infoCard: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    padding: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  infoRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  infoLabel: {
    fontSize: 14,
    color: "#666",
    fontFamily: "BarlowRegular",
  },
  infoValue: {
    fontSize: 14,
    color: "#333",
    fontFamily: "BarlowRegular",
    flex: 1,
    textAlign: "right",
  },
});