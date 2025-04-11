import {
  ActivityIndicator,
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { UserResponseType } from "@/app/types/management/onboarding";
import { SafeAreaProvider } from "react-native-safe-area-context";
import {
  GestureHandlerRootView,
  Switch,
} from "react-native-gesture-handler";
import { all } from "axios";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useProfileContext } from "@/app/context/management/profile/profileContext";
import NotificationToggle from "../../helper/profile/NotificationToggle";
import InfoRow from "../../helper/profile/InfoRow";

const image = require("@/assets/images/user image.jpg");

const ProfileDisplayComponent = ({
  user,
  onPress,
}: {
  user: UserResponseType | null;
  onPress: () => void;
}) => {
  const {
    allowEmailNotification,
    allowMarketingEmails,
    allowPushNotification,
    savePreferences,
    setAllowEmailNotification,
    setAllowMarketingEmails,
    setAllowPushNotification,
    handlePhone,
    handleWebsiteCall,
  } = useProfileContext();

  //Call the hooke when the page unmouts to save the user preferences
  // In the server
  useEffect(() => {
    try {
      const fetchData = async () => {
        savePreferences();
      };
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [allowEmailNotification, allowMarketingEmails, allowPushNotification]);

  /* Import colors */
  const innerBackgroundColor = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "secondaryColor");

  if (!user) {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          style={[
            styles.mainContainer,
            { backgroundColor: innerBackgroundColor },
          ]}
          showsVerticalScrollIndicator={false}
        >
          {/* Header Section */}
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Image source={image} style={styles.profileImage} />
              <View style={styles.profileInfo}>
                <Text style={[styles.profileName, { color: text }]}>
                  {user.first_name + " " + user.last_name}
                </Text>
                <Text style={[styles.profileEmail, { color: text }]}>
                  {user.email}
                </Text>
              </View>
            </View>
            <Pressable onPress={onPress} style={styles.closeButton}>
              <MaterialCommunityIcons
                name="close"
                size={24}
                color={borderColor}
              />
            </Pressable>
          </View>

          {/* Info Sections */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Personal Information
            </Text>
            <View style={styles.infoCard}>
              <InfoRow label="Mobile Number" value={user.phone} />
              <InfoRow label="Date of Birth" value={user.dob} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>Address</Text>
            <View style={styles.infoCard}>
              <InfoRow label="Address" value={user.address} />
              <InfoRow label="Postcode" value={user.postcode} />
              <InfoRow label="City" value={user.city} />
              <InfoRow label="Country" value={user.country} />
            </View>
          </View>

          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Company Details
            </Text>
            <View style={styles.infoCard}>
              <InfoRow label="Company Name" value={user.company_name} />
              <InfoRow label="Services" value={user.company_services} />
              <InfoRow label="Address" value={user.company_address} />
              <InfoRow label="Postcode" value={user.company_postcode} />
              <InfoRow
                label="Helpline"
                value={user.company_helpline}
                isClickable
                onPress={() => handlePhone(user.company_helpline)}
              />
              <InfoRow
                label="Website"
                value={user.company_website}
                isClickable
                onPress={() => handleWebsiteCall(user.company_website || "")}
              />
            </View>
          </View>

          {/* Notification Preferences */}
          <View style={styles.section}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Notification Preferences
            </Text>
            <View style={styles.infoCard}>
              <NotificationToggle
                label="Push Notifications"
                value={allowPushNotification}
                onValueChange={setAllowPushNotification}
                color={borderColor}
              />
              <NotificationToggle
                label="Email Notifications"
                value={allowEmailNotification}
                onValueChange={setAllowEmailNotification}
                color={borderColor}
              />
              <NotificationToggle
                label="Marketing Emails"
                value={allowMarketingEmails}
                onValueChange={setAllowMarketingEmails}
                color={borderColor}
              />
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};


const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    padding: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 16,
    marginBottom: 24,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  profileInfo: {
    gap: 4,
  },
  profileName: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "BarlowMedium",
    letterSpacing: 0.2,
    textTransform: "capitalize",
  },
  profileEmail: {
    fontSize: 14,
    fontFamily: "BarlowLight",
    opacity: 0.8,
  },
  closeButton: {
    padding: 8,
    borderRadius: 20,
    backgroundColor: "#F5F5F5",
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 12,
    fontFamily: "BarlowRegular",
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
});

export default ProfileDisplayComponent;
