import {
  Animated,
  KeyboardAvoidingView,
  Platform,
  Pressable,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import RegistrationTextInputComponent from "@/app/component/helper/registrationTextinput";
import {
  GestureHandlerRootView,
  ScrollView,
} from "react-native-gesture-handler";
import { router } from "expo-router";
import { SafeAreaProvider } from "react-native-safe-area-context";
import { useThemeColor } from "@/hooks/useThemeColor";
import {
  bounceText,
  textbounce,
} from "@/app/utils/animations/onboardingAnimation";
import { useProfileContext } from "@/app/context/management/profile/profileContext";

const RegisterCompanyComponent = ({ onClose }: { onClose?: () => void }) => {
  const {companyDetails, setCompanyDetails, createCompany} = useProfileContext();
  const [error, setError] = useState<string[]>([]);

  const backgroundColor = useThemeColor({}, "background");
  const buttonColor = useThemeColor({}, "inactivebtn");

  useEffect(() => {
    bounceText();
  }, []);

  const handleSubmit = async () => {
    const newErrors: string[] = [];
    if (!companyDetails?.company_name) newErrors.push("Company name is required");
    if (!companyDetails?.company_email) newErrors.push("Company email is required");
    if (!companyDetails?.company_helpline || !companyDetails?.company_helpline.includes('+')) newErrors.push("Company helpline is required with country code");
    if (!companyDetails?.company_address) newErrors.push("Company address is required");
    if (!companyDetails?.company_postcode) newErrors.push("Postcode is required");
    if (!companyDetails?.company_city) newErrors.push("City is required");
    if (!companyDetails?.company_country) newErrors.push("Country is required");
    if (!companyDetails?.company_website || !companyDetails?.company_website.includes('https://')) newErrors.push("Company website is required with https://");
    if (!companyDetails?.company_services) newErrors.push("Company services are required");

    if (newErrors.length > 0) {
      setError(newErrors);
    } else {
      createCompany(companyDetails);
    }
  };

  return (
    <SafeAreaProvider
      style={[{ flex: 1 }, { backgroundColor: backgroundColor }]}
    >
      <KeyboardAvoidingView style={{ flex: 1 }}>
        <GestureHandlerRootView style={{ flex: 1 }}>
          <ScrollView
            style={{ flexGrow: 1 }}
            contentContainerStyle={styles.scrollContainer}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.headerContainer}>
              <Text style={styles.title}>Company Registration</Text>
              <Text style={styles.subtitle}>
                Complete your organization's profile to get started with Time
                Trackr
              </Text>
              <Text style={styles.description}>
                All fields are required to ensure we can provide you with the
                best service. Use 'N/A' for fields that don't apply to your
                organization.
              </Text>
            </View>

            {/* Display the error messages */}
            {error.map((err, index) => (
              <Text key={index} style={styles.errorText}>{err}</Text>
            ))}

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Company Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Company Name</Text>
                  <RegistrationTextInputComponent
                    placeholder="Enter company name"
                    value={companyDetails?.company_name}
                    setValue={(value) => setCompanyDetails({...companyDetails, company_name: value})}
                    inputMode="text"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Registration Number</Text>
                  <RegistrationTextInputComponent
                    placeholder="e.g. RC123456"
                    value={companyDetails?.company_registration_number}
                    setValue={(value) =>
                      setCompanyDetails({...companyDetails, company_registration_number: value})
                    }
                    inputMode="text"
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Contact Details</Text>
              <View style={styles.infoCard}>
                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Company Email</Text>
                  <RegistrationTextInputComponent
                    placeholder="contact@company.com"
                    value={companyDetails?.company_email}
                    setValue={(value) => setCompanyDetails({...companyDetails, company_email: value})}
                    inputMode="email"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Helpline</Text>
                  <RegistrationTextInputComponent
                    placeholder="Enter company helpline"
                    value={companyDetails?.company_helpline}
                    setValue={(value) =>
                      setCompanyDetails({...companyDetails, company_helpline: value})
                    }
                    inputMode="tel"
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Location</Text>
              <View style={styles.infoCard}>
                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Company Address</Text>
                  <RegistrationTextInputComponent
                    placeholder="Enter company address"
                    value={companyDetails?.company_address}
                    setValue={(value) => setCompanyDetails({...companyDetails, company_address: value})}
                    inputMode="text"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Postcode</Text>
                  <RegistrationTextInputComponent
                    placeholder="Enter postcode"
                    value={companyDetails?.company_postcode}
                    setValue={(value) => setCompanyDetails({...companyDetails, company_postcode: value})}
                    inputMode="text"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>City</Text>
                  <RegistrationTextInputComponent
                    placeholder="Enter city"
                    value={companyDetails?.company_city}
                    setValue={(value) => setCompanyDetails({...companyDetails, company_city: value})}
                    inputMode="text"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Country</Text>
                  <RegistrationTextInputComponent
                    placeholder="Enter country"
                    value={companyDetails?.company_country}
                    setValue={(value) => setCompanyDetails({...companyDetails, company_country: value})}
                    inputMode="text"
                  />
                </View>
              </View>
            </View>

            <View style={styles.section}>
              <Text style={styles.sectionTitle}>Additional Information</Text>
              <View style={styles.infoCard}>
                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Website</Text>
                  <RegistrationTextInputComponent
                    placeholder="www.company.com"
                    value={companyDetails?.company_website}
                    setValue={(value) => setCompanyDetails({...companyDetails, company_website: value})}
                    inputMode="url"
                  />
                </View>

                <View style={styles.inputContainer}>
                  <Text style={styles.labelText}>Services</Text>
                  <RegistrationTextInputComponent
                    placeholder="Describe your company services"
                    value={companyDetails?.company_services}
                    setValue={(value) =>
                      setCompanyDetails({...companyDetails, company_services: value})
                    }
                    inputMode="text"
                  />
                </View>
              </View>
            </View>

            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.primaryButton, { backgroundColor: buttonColor }]}
                onPress={handleSubmit}
              >
                <Text
                  style={[styles.primaryButtonText, { color: backgroundColor }]}
                >
                  Submit Registration
                </Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </GestureHandlerRootView>
      </KeyboardAvoidingView>
    </SafeAreaProvider>
  );
};

export default RegisterCompanyComponent;

const styles = StyleSheet.create({
  scrollContainer: {
    padding: 15,
  },
  headerContainer: {
    marginBottom: 15,
  },
  title: {
    fontSize: 24,
    fontFamily: "BarlowMedium",
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    fontFamily: "RobotoRegular",
    color: "#666",
    marginBottom: 8,
  },
  description: {
    fontSize: 14,
    fontFamily: "RobotoLight",
    color: "#888",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    fontFamily: "BarlowRegular",
    textTransform: "capitalize",
    color: "#333",
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
    gap: 16,
  },
  inputContainer: {
    gap: 8,
  },
  labelText: {
    fontSize: 14,
    fontFamily: "RobotoRegular",
    color: "#666",
  },
  addressContainer: {
    flexDirection: "row",
    gap: 10,
  },
  addressInput: {
    flex: 1,
  },
  findAddressBtn: {
    backgroundColor: "#f0f0f0",
    padding: 12,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "flex-end",
  },
  findAddressText: {
    fontFamily: "BarlowRegular",
    fontSize: 14,
    color: "#666",
  },
  buttonContainer: {
    marginTop: 32,
    gap: 16,
  },
  primaryButton: {
    padding: 16,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
    elevation: 2,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  primaryButtonText: {
    fontSize: 16,
    fontFamily: "BarlowMedium",
  },
  secondaryButton: {
    padding: 16,
    alignItems: "center",
    justifyContent: "center",
  },
  secondaryButtonText: {
    fontSize: 16,
    fontFamily: "BarlowRegular",
    color: "#666",
  },
  errorText: {
    fontSize: 14,
    fontFamily: "RobotoRegular",
    color: "#FF0000",
  },
});
