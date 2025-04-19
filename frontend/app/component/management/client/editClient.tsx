import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
  ScrollView,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ClientDetailsType } from "@/app/types/management/client";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { useClientContext } from "@/app/context/management/client/clientContext";
import ButtonText from "../../helper/ButtonText";
import AlertModal from "../../helper/AlertModal";
const EditClientComponent = ({ client }: { client: ClientDetailsType }) => {
  const { updateClient, isEditClientLoading } = useClientContext();
  const [clientData, setClientData] = useState<ClientDetailsType>(client);
  const [error, setError] = useState<string>("");
  const [isAlertVisible, setIsAlertVisible] = useState(false);
  const [alertConfig, setAlertConfig] = useState<{
    title: string;
    message: string;
    onConfirm?: () => void;
    onCancel?: () => void;
  }>({
    title: "",
    message: "",
    onConfirm: () => {},
    onCancel: () => {},
  });

  // Get theme colors
  const primary = useThemeColor({}, "primaryColor");
  const text = useThemeColor({}, "text");
  const innerBackground = useThemeColor({}, "innerBackground");

  const handleInputChange = (key: keyof ClientDetailsType, value: string) => {
    setClientData((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  /**
   * Handle the client update login to show a modal to confirm the update.
   * if the update is successful, the modal will close and the client will be updated.
   * if the update is not successful, the modal will show the error message.
   */
  const handleClientUpdate = () => {
    setAlertConfig({
      title: error || "Update Client",
      message: "Are you sure you want to update the client?",
      onConfirm: () => {
        try {
          updateClient(clientData);
        } catch (error: any) {
          setError(error.message);
        }
      },
      onCancel: () => setIsAlertVisible(false),
    });
    setIsAlertVisible(true);
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={styles.container}
    >
      <View
        style={[styles.formContainer, { backgroundColor: innerBackground }]}
      >
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
        >
          <View style={styles.inputsWrapper}>
            <View style={styles.inputGroup}>
              <MaterialIcons name="business" size={24} color={text} />
              <TextInput
                style={[styles.input, { color: text }]}
                placeholder="Company Name"
                placeholderTextColor="gray"
                value={clientData.name}
                onChangeText={(value) => handleInputChange("name", value)}
              />
            </View>

            <View style={styles.inputGroup}>
              <MaterialIcons name="location-on" size={24} color={text} />
              <TextInput
                style={[styles.input, { color: text }]}
                placeholder="Address"
                placeholderTextColor="gray"
                value={clientData.address}
                onChangeText={(value) => handleInputChange("address", value)}
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <MaterialIcons
                  name="local-post-office"
                  size={24}
                  color={text}
                />
                <TextInput
                  style={[styles.input, { color: text }]}
                  placeholder="Postcode"
                  placeholderTextColor="gray"
                  value={clientData.postcode}
                  onChangeText={(value) => handleInputChange("postcode", value)}
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <MaterialIcons name="location-city" size={24} color={text} />
                <TextInput
                  style={[styles.input, { color: text }]}
                  placeholder="City"
                  placeholderTextColor="gray"
                  value={clientData.city}
                  onChangeText={(value) => handleInputChange("city", value)}
                />
              </View>
            </View>

            <View style={styles.inputGroup}>
              <MaterialIcons name="email" size={24} color={text} />
              <TextInput
                style={[styles.input, { color: text }]}
                placeholder="Email"
                placeholderTextColor="gray"
                value={clientData.email}
                onChangeText={(value) => handleInputChange("email", value)}
                keyboardType="email-address"
                autoCapitalize="none"
              />
            </View>

            <View style={styles.rowInputs}>
              <View style={[styles.inputGroup, styles.halfWidth]}>
                <MaterialIcons name="phone" size={24} color={text} />
                <TextInput
                  style={[styles.input, { color: text }]}
                  placeholder="Phone"
                  placeholderTextColor="gray"
                  value={clientData.phone}
                  onChangeText={(value) => handleInputChange("phone", value)}
                  keyboardType="phone-pad"
                />
              </View>

              <View style={[styles.inputGroup, styles.halfWidth]}>
                <MaterialIcons name="flag" size={24} color={text} />
                <TextInput
                  style={[styles.input, { color: text }]}
                  placeholder="Country"
                  placeholderTextColor="gray"
                  value={clientData.country}
                  onChangeText={(value) => handleInputChange("country", value)}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity
            style={[styles.button, { backgroundColor: primary }]}
            onPress={handleClientUpdate}
          >
            {isEditClientLoading ? (
              <ActivityIndicator size="small" color="white" />
            ) : (
              <ButtonText text="Update Client" />
            )}
          </TouchableOpacity>
        </ScrollView>
      </View>

      <AlertModal
        title={alertConfig.title}
        message={alertConfig.message}
        isVisible={isAlertVisible}
        onClose={alertConfig.onCancel}
        onConfirm={alertConfig.onConfirm}
      />
    </KeyboardAvoidingView>
  );
};

export default EditClientComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    flex: 1,
    borderRadius: 5,
    shadowColor: "#000",
  },
  scrollContent: {
    padding: 16,
  },
  inputsWrapper: {
    gap: 20,
  },
  rowInputs: {
    flexDirection: "row",
    gap: 12,
    justifyContent: "space-between",
  },
  halfWidth: {
    flex: 1,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: "rgba(50, 99, 61, 0.1)",
    paddingHorizontal: 12,
    paddingVertical: 8,
    backgroundColor: "rgba(255,255,255,0.5)",
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "RobotoRegular",
    paddingVertical: 8,
  },
  button: {
    padding: 12,
    borderRadius: 10,
    alignItems: "center",
    marginTop: 24,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
});
