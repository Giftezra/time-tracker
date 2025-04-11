import {
  Image,
  Platform,
  Pressable,
  StyleSheet,
  Switch,
  Text,
  View,
} from "react-native";
import React, { useEffect, useState } from "react";
import { ScrollView } from "react-native-gesture-handler";
import {
  AntDesign,
  MaterialCommunityIcons,
  MaterialIcons,
} from "@expo/vector-icons";
import { user_image } from "@/app/utils/images";
import { useProfileContext } from "@/app/context/management/profile/profileContext";
import { useThemeColor } from "@/hooks/useThemeColor";
import { useAuth } from "@/app/authentication";
import NotificationToggle from "../../helper/profile/NotificationToggle";
import InfoRow from "../../helper/profile/InfoRow";

const UserDetailsComponent = () => {
  const { user, role } = useAuth();

  const {
    handleLink,
    handlePhone,
    savePreferences,
    allowEmailNotification,
    allowMarketingEmails,
    allowPushNotification,
    setAllowEmailNotification,
    setAllowMarketingEmails,
    setAllowPushNotification,
    onModalVisible,
    setOnModalVisible,
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

  // Import the necceassary colors required for the component
  const secondary = useThemeColor({}, "secondaryColor");
  const innerBackground = useThemeColor({}, "innerBackground");
  const otherText = useThemeColor({}, "otherText");
  const headerText = useThemeColor({}, "headerText");

  return (
    <ScrollView
      style={[styles.mainContainer, { backgroundColor: innerBackground }]}
      showsVerticalScrollIndicator={false}
    >
      {/* Header Section */}
      <View style={styles.header}>
        <View style={styles.profileSection}>
          <Image source={user_image} style={styles.profileImage} />
          <View style={styles.profileInfo}>
            <Text style={[styles.profileName, { color: headerText }]}>
              {user?.first_name + " " + user?.last_name}
            </Text>
            <Text style={[styles.profileRole, { color: otherText }]}>
              {role}
            </Text>
          </View>
        </View>
        {Platform.OS !== "web" && (
          <Pressable
            onPress={() => setOnModalVisible(true)}
            style={styles.editButton}
          >
            {role !== "staff" && (
              <MaterialCommunityIcons
                name="pencil"
                size={20}
                style={{ padding: 8 }}
              />
            )}
          </Pressable>
        )}
      </View>

      {/* Personal Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: headerText }]}>
          Personal Information
        </Text>
        <View style={styles.infoCard}>
          <InfoRow label="Mobile" value={user?.phone} />
          <InfoRow label="Email" value={user?.email} />
          <InfoRow label="Date of Birth" value={user?.dob} />
        </View>
      </View>

      {/* Company Information */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: headerText }]}>
          Company Details
        </Text>
        <View style={styles.infoCard}>
          <InfoRow label="Company Name" value={user?.company_name} />
          <InfoRow label="Official Address" value={user?.company_address} />
          <InfoRow label="Postcode" value={user?.company_postcode} />
          <InfoRow label="Services" value={user?.company_services} />
          <InfoRow
            label="Website"
            value={user?.company_website}
            isClickable
            onPress={() =>
              user?.company_website && handleLink(user.company_website)
            }
          />
          <InfoRow
            label="Helpline"
            value={user?.company_helpline}
            isClickable
            onPress={() =>
              user?.company_helpline && handlePhone(user.company_helpline)
            }
          />
        </View>
      </View>

      {/* Notification Preferences */}
      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: headerText }]}>
          Notification Preferences
        </Text>
        <View style={styles.infoCard}>
          <NotificationToggle
            label="Push Notifications"
            value={allowPushNotification}
            onValueChange={setAllowPushNotification}
            color={innerBackground}
          />
          <NotificationToggle
            label="Email Notifications"
            value={allowEmailNotification}
            onValueChange={setAllowEmailNotification}
            color={innerBackground}
          />
          <NotificationToggle
            label="Marketing Emails"
            value={allowMarketingEmails}
            onValueChange={setAllowMarketingEmails}
            color={innerBackground}
          />
        </View>
      </View>
    </ScrollView>
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
    paddingBottom: 10,
    marginBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
  profileImage: {
    width: 50,
    height: 50,
    borderRadius: 25,
    borderWidth: 1,
    borderColor: "#E5E5E5",
  },
  profileInfo: {
    gap: 5,
  },
  profileName: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
    letterSpacing: 0.2,
    textTransform: "capitalize",
  },
  profileRole: {
    fontSize: 14,
    fontFamily: "BarlowLight",
    textTransform: "capitalize",
  },
  editButton: {
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
    textTransform: "capitalize",
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

export default UserDetailsComponent;
