import { StyleSheet, Text, TextInput, View, ScrollView, Alert, ActivityIndicator, TouchableOpacity } from "react-native";
import React, { useState } from "react";
import { AntDesign, MaterialIcons } from "@expo/vector-icons";
import { NewClientDetailsInterface } from "@/app/types/management/client";
import { useClientContext } from "@/app/context/management/client/clientContext";
import ButtonText from "../../helper/ButtonText";
import SubHeaderText from "../../helper/SubHeaderText";
import ThemedHeaderText from "../../helper/ThemedHeaderText";
import SubtitleThemedText from "../../helper/SubtitleThemedText";
/**
 * AddClientComponent is responsible for rendering a form to register new clients.
 * It provides input fields for client details including name, contact information,
 * and address details. The component includes address lookup functionality via postcode.
 *
 * @component
 * @example
 * ```tsx
 * <AddClientComponent />
 * ```
 */
const AddClientComponent = () => {
  const { createClient, isNewClientLoading } = useClientContext();
  const [newClientDetails, setNewClientDetails] =
    useState<NewClientDetailsInterface>({
      name: "",
      address: "",
      postcode: "",
      email: "",
      phone: "",
      city: "",
      country: "",
    });

  const handleInputChange = (
    field: keyof NewClientDetailsInterface,
    value: string
  ) => {
    setNewClientDetails({ ...newClientDetails, [field]: value });
  };

  const handleClientRegistration = async () => {
    try{
      Alert.alert('Registration Information', ' You are about to register a new client. Please ensure the details are correct before submitting.', [{
        text: 'Cancel',
        style: 'cancel',
      }, {
        text: 'Submit',
        onPress: () => createClient(newClientDetails),
      }])
    } catch (error) {
      console.error('Error registering client', error);
    }
  }
  /**
   * Renders a scrollable form with input fields for client registration.
   * The form includes:
   * - Client name
   * - Client email
   * - Client phone
   * - Client address details (address, postcode, city, country)
   * - Address lookup functionality via postcode
   * - Registration submit button
   */
  return (
    <View style={styles.mainContainer}>
      <View style={styles.headerContainer}>
        <SubHeaderText text="register new client" />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollViewContent}
      >
        <View style={styles.container}>
          <View style={styles.formSection}>
            {/* Client Information Section */}
            <View style={styles.sectionContainer}>
              <ThemedHeaderText text="client information" />

              <View style={styles.inputGroup}>
                <SubtitleThemedText text="client name" />
                <TextInput
                  placeholder="Enter client name"
                  style={styles.input}
                  importantForAutofill="yes"
                  placeholderTextColor="#A0AEC0"
                  value={newClientDetails.name}
                  onChangeText={(text) => handleInputChange("name", text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <SubtitleThemedText text="client email" />
                <TextInput
                  placeholder="Enter client email"
                  style={styles.input}
                  importantForAutofill="yes"
                  autoComplete="email"
                  inputMode="email"
                  placeholderTextColor="#A0AEC0"
                  value={newClientDetails.email}
                  onChangeText={(text) => handleInputChange("email", text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <SubtitleThemedText text="client phone" />
                <TextInput
                  placeholder="Enter client phone"
                  style={styles.input}
                  inputMode="tel"
                  importantForAutofill="yes"
                  autoComplete="tel"
                  placeholderTextColor="#A0AEC0"
                  value={newClientDetails.phone}
                  onChangeText={(text) => handleInputChange("phone", text)}
                />
              </View>
            </View>

            {/* Address Section */}
            <View style={styles.sectionContainer}>
              <ThemedHeaderText text="address details" />

              <View style={styles.inputGroup}>
                <SubtitleThemedText text="street address" />
                <TextInput
                  placeholder="Enter client address"
                  style={styles.input}
                  importantForAutofill="yes"
                  autoComplete="street-address"
                  placeholderTextColor="#A0AEC0"
                  value={newClientDetails.address}
                  onChangeText={(text) => handleInputChange("address", text)}
                />
              </View>

              <View style={styles.postcodeContainer}>
                <View style={[styles.inputGroup, { flex: 1 }]}>
                  <SubtitleThemedText text="postcode" />
                  <TextInput
                    placeholder="Enter postcode"
                    style={styles.input}
                    importantForAutofill="yes"
                    autoComplete="postal-code"
                    placeholderTextColor="#A0AEC0"
                    value={newClientDetails.postcode}
                    onChangeText={(text) => handleInputChange("postcode", text)}
                  />
                </View>
                <TouchableOpacity style={styles.findAddressButton}>
                  <ButtonText text="find address" />
                </TouchableOpacity>
              </View>

              <View style={styles.inputGroup}>
                <SubtitleThemedText text="city" />
                <TextInput
                  placeholder="Enter client city"
                  style={styles.input}
                  placeholderTextColor="#A0AEC0"
                  importantForAutofill="yes"
                  autoComplete='address-line2'
                  value={newClientDetails.city}
                  onChangeText={(text) => handleInputChange("city", text)}
                />
              </View>

              <View style={styles.inputGroup}>
                <SubtitleThemedText text="country" />
                <TextInput
                  placeholder="Enter client country"
                  style={styles.input}
                  placeholderTextColor="#A0AEC0"
                  importantForAutofill="yes"
                  autoComplete="country"
                  value={newClientDetails.country}
                  onChangeText={(text) => handleInputChange("country", text)}
                />
              </View>
            </View>
          </View>

          <TouchableOpacity style={styles.registerButton} onPress={handleClientRegistration}>
            {isNewClientLoading ? (
              <ActivityIndicator size="large" color="#4299E1" />
            ) : (
              <ButtonText text="register client" />
            )}
          </TouchableOpacity>
        </View>
      </ScrollView>
    </View>
  );
};

export default AddClientComponent;

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    backgroundColor: "#F7FAFC",
  },

  headerContainer: {
    padding: 10,
    backgroundColor: "#FFFFFF",
    borderBottomWidth: 1,
    borderBottomColor: "#E2E8F0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 2,
  },

  headerText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#2D3748",
    fontFamily: "BarlowRegular",
  },

  scrollView: {
    flex: 1,
  },

  scrollViewContent: {
    flexGrow: 1,
  },

  container: {
    padding: 16,
    paddingBottom: 40,
  },

  formSection: {
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },

  sectionContainer: {
    padding: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#EDF2F7",
  },

  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#2D3748",
    marginBottom: 20,
    fontFamily: "BarlowRegular",
  },

  inputGroup: {
    marginBottom: 20,
  },

  label: {
    fontSize: 14,
    fontWeight: "500",
    color: "#4A5568",
    marginBottom: 8,
    fontFamily: "BarlowRegular",
  },

  input: {
    padding: 12,
    backgroundColor: "#F7FAFC",
    borderWidth: 1,
    borderColor: "#E2E8F0",
    borderRadius: 8,
    fontSize: 16,
    color: "#2D3748",
  },

  postcodeContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
    marginBottom: 20,
  },

  findAddressButton: {
    padding: 12,
    backgroundColor: "#EDF2F7",
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    height: 48,
  },

  findAddressText: {
    color: "#4A5568",
    fontSize: 14,
    fontWeight: "600",
  },

  registerButton: {
    marginTop: 24,
    backgroundColor: "#4299E1",
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    shadowColor: "#4299E1",
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },

  registerButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },
});
