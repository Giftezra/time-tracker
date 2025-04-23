import React from "react";
import { Modal, View, Text, TouchableOpacity, StyleSheet } from "react-native";

const AlertModal = ({
  isVisible,
  onClose,
  onConfirm,
  title,
  message,
  type = "error",
}: {
  isVisible: boolean;
  onClose?: () => void;
  onConfirm?: () => void;
  title: string;
  message: string;
  type?: "success" | "error";
}) => {
  // Function to determine title color based on type
  const getTitleColor = () => {
    switch (type) {
      case "success":
        return "#4CAF50"; // Green color for success
      case "error":
        return "#FF3B30"; // Red color for error
      default:
        return "#FF3B30"; // Default to red
    }
  };

  return (
    <Modal
      visible={isVisible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={styles.modalContainer}>
          <Text style={[styles.title, { color: getTitleColor() }]}>
            {title}
          </Text>
          <Text style={styles.message}>{message}</Text>

          {/* Dislplay the button given if the props is passed */}
          <View style={styles.buttonContainer}>
            {/* Display the cancel button if the onClose prop is passed */}
            {onClose && (
              <TouchableOpacity
                style={[styles.button, styles.cancelButton]}
                onPress={onClose}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            )}
            {/* Display the confirm button if the onConfirm prop is passed */}
            {onConfirm && (
              <TouchableOpacity
                style={[styles.button, styles.confirmButton]}
                onPress={() => {
                  onConfirm?.();
                  onClose?.();
                }}
              >
                <Text style={styles.confirmButtonText}>OK</Text>
              </TouchableOpacity>
            )}
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    justifyContent: "center",
    alignItems: "center",
  },
  modalContainer: {
    backgroundColor: "white",
    borderRadius: 10,
    padding: 20,
    width: "80%",
    maxWidth: 500,
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 10,
    fontFamily: "BarlowRegular",
    letterSpacing: 0.5,
  },
  message: {
    fontSize: 14,
    color: "#666",
    fontFamily: "BarlowLight",
    fontWeight: "400",
    marginBottom: 20,
    letterSpacing: 0.3,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "flex-end",
    gap: 10,
  },
  button: {
    paddingVertical: 8,
    paddingHorizontal: 16,
    borderRadius: 5,
    minWidth: 80,
    alignItems: "center",
  },
  cancelButton: {
    backgroundColor: "#f5f5f5",
    borderWidth: 1,
    borderColor: "#ddd",
  },
  confirmButton: {
    backgroundColor: "#007AFF",
  },
  cancelButtonText: {
    color: "#666",
  },
  confirmButtonText: {
    color: "white",
  },
});

export default AlertModal;
