import { Modal, StyleSheet, Text, View } from "react-native";
import React from "react";
import ArrowButtonComponent from "./arrowButton";

const RegistrationModalComponent = ({
  onPress,
  children,
  isModalOpen,
}: {
  onPress: () => void;
  children: React.ReactNode;
  isModalOpen?: boolean;
}) => {
  return (
    <Modal visible={isModalOpen} animationType="slide">
      <View style={styles.container}>{children}</View>
      <View>
        <ArrowButtonComponent onPress={onPress} />
      </View>
    </Modal>
  );
};

export default RegistrationModalComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 5,
  },
});
