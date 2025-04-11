import { StyleSheet, Switch, Text, View } from 'react-native'
import React from 'react'

const NotificationToggle = ({
  label,
  value,
  onValueChange,
  color,
}: {
  label: string;
  value: boolean;
  onValueChange: (value: boolean) => void;
  color: string;
}) => (
  <View style={styles.toggleRow}>
    <Text style={[styles.toggleLabel, { color }]}>{label}</Text>
    <Switch
      value={value}
      onValueChange={onValueChange}
      thumbColor={value ? "#007AFF" : "#F4F3F4"}
      trackColor={{ false: "#767577", true: "#81B0FF" }}
    />
  </View>
);

export default NotificationToggle

const styles = StyleSheet.create({
  toggleRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: "#F5F5F5",
  },
  toggleLabel: {
    fontSize: 14,
    fontFamily: "BarlowRegular",
  },
});