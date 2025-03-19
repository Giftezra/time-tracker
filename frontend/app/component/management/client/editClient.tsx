import {
  StyleSheet,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  Platform,
  KeyboardAvoidingView,
  ActivityIndicator,
} from "react-native";
import React, { useState, useEffect } from "react";
import { ClientDetailsType } from "@/app/types/management/client";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialIcons } from "@expo/vector-icons";
import { useClientContext } from "@/app/context/management/client/clientContext";
const EditClientComponent = ({ client }: { client: ClientDetailsType }) => {
  const { updateClient, isEditClientLoading } = useClientContext();

  const [clientData, setClientData] = useState<ClientDetailsType>(client);

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

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === "ios" ? "padding" : "height"}
      style={[styles.container,]}
    >
      <View
        style={[styles.formContainer, { backgroundColor: innerBackground }]}
      >
        <View style={styles.inputGroup}>
          <MaterialIcons name="business" size={20} color={text} />
          <TextInput
            style={[styles.input, { color: text }]}
            placeholder="Company Name"
            placeholderTextColor={text}
            value={clientData.name}
            onChangeText={(value) => handleInputChange("name", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="location-on" size={20} color={text} />
          <TextInput
            style={[styles.input, { color: text }]}
            placeholder="Address"
            placeholderTextColor={text}
            value={clientData.address}
            onChangeText={(value) => handleInputChange("address", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="local-post-office" size={20} color={text} />
          <TextInput
            style={[styles.input, { color: text }]}
            placeholder="Postcode"
            placeholderTextColor={text}
            value={clientData.postcode}
            onChangeText={(value) => handleInputChange("postcode", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="location-city" size={20} color={text} />
          <TextInput
            style={[styles.input, { color: text }]}
            placeholder="City"
            placeholderTextColor={text}
            value={clientData.city}
            onChangeText={(value) => handleInputChange("city", value)}
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="email" size={20} color={text} />
          <TextInput
            style={[styles.input, { color: text }]}
            placeholder="Email"
            placeholderTextColor={text}
            value={clientData.email}
            onChangeText={(value) => handleInputChange("email", value)}
            keyboardType="email-address"
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="phone" size={20} color={text} />
          <TextInput
            style={[styles.input, { color: text }]}
            placeholder="Phone"
            placeholderTextColor={text}
            value={clientData.phone}
            onChangeText={(value) => handleInputChange("phone", value)}
            keyboardType="phone-pad"
          />
        </View>

        <View style={styles.inputGroup}>
          <MaterialIcons name="flag" size={20} color={text} />
          <TextInput
            style={[styles.input, { color: text }]}
            placeholder="Country"
            placeholderTextColor={text}
            value={clientData.country}
            onChangeText={(value) => handleInputChange("country", value)}
          />
        </View>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: primary }]}
          onPress={() => updateClient(clientData)}
        >
            {isEditClientLoading ? (
                <ActivityIndicator size="small" color={text} />
            ) : (
                <Text style={styles.buttonText}>Update Client</Text>
            )}
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

export default EditClientComponent;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  formContainer: {
    padding: 10,
    borderRadius: 5,
    gap: 16,
  },
  inputGroup: {
    flexDirection: "row",
    alignItems: "center",
    gap: 10,
    borderBottomWidth: 1,
    borderBottomColor: "rgba(0,0,0,0.1)",
    paddingBottom: 8,
  },
  input: {
    flex: 1,
    fontSize: 16,
    fontFamily: "RobotoRegular",
    fontWeight: "600",
  },
  button: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    marginTop: 16,
  },
  buttonText: {
    color: "white",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "RobotoRegular",
  },
});
