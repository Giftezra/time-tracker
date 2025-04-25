import React from "react";
import { View, Text, StyleSheet } from "react-native";

interface TooltipProps {
  visible: boolean;
  content: string;
  children: React.ReactNode;
}

export const Tooltip: React.FC<TooltipProps> = ({
  visible,
  content,
  children,
}) => {
  if (!visible) return <>{children}</>;

  return (
    <View style={styles.container}>
      {children}
      <View style={styles.tooltip}>
        <Text style={styles.tooltipText}>{content}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  tooltip: {
    position: "absolute",
    bottom: -40,
    left: "50%",
    transform: [{ translateX: -75 }],
    backgroundColor: "rgba(0,0,0,0.8)",
    padding: 8,
    borderRadius: 6,
    width: 150,
    zIndex: 1000,
  },
  tooltipText: {
    color: "#fff",
    fontSize: 12,
    textAlign: "center",
    fontFamily: "BarlowLight",
  },
});
