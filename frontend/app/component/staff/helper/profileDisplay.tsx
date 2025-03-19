import {
  ActivityIndicator,
  Image,
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
  Pressable,
  Switch,
} from "react-native-gesture-handler";
import { all } from "axios";
import { useThemeColor } from "@/hooks/useThemeColor";
import { MaterialCommunityIcons, MaterialIcons } from "@expo/vector-icons";
import { useProfileContext } from "@/app/context/management/profile/profileContext";

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
    try{
      const fetchData = async () => {
        savePreferences();
      }
      fetchData();
    } catch (error) {
      console.error(error);
    }
  }, [allowEmailNotification, allowMarketingEmails, allowPushNotification]);

  /* Import colors */
  const innerBackgroundColor = useThemeColor({}, "innerBackground");
  const text = useThemeColor({}, "text");
  const borderColor = useThemeColor({}, "highlight");

  if (!user) {
    return <ActivityIndicator size="small" color="#0000ff" />;
  }

  return (
    <SafeAreaProvider style={{ flex: 1 }}>
      <GestureHandlerRootView style={{ flex: 1 }}>
        <ScrollView
          style={[
            styles.maincontainer,
            { backgroundColor: innerBackgroundColor },
          ]}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.header}>
            <View style={styles.profileSection}>
              <Image source={image} style={styles.image} />
              <View style={styles.nameSection}>
                <Text style={[styles.name, { color: text }]}>
                  {user.first_name + " " + user.last_name}
                </Text>
                <Text style={[styles.email, { color: text }]}>
                  {user.email}
                </Text>
              </View>
            </View>
            <Pressable onPress={onPress} style={styles.closeButton}>
              <MaterialCommunityIcons name="close" size={24} color={'black'} />
            </Pressable>
          </View>

          <View style={styles.container}>
            <Text style={styles.headerText}>mobile number</Text>
            <Text style={styles.text}>{user.phone || 'N/A'}</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.headerText}>full address</Text>
            <View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>address</Text>
                <Text style={styles.text}>{user.address || 'N/A'}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>postcode</Text>
                <Text style={styles.text}>{user.postcode || 'N/A'}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>city</Text>
                <Text style={styles.text}>{user.city || 'N/A'}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>country</Text>
                <Text style={styles.text}>{user.country || 'N/A'}</Text>
              </View>
            </View>
          </View>

          <View style={styles.container}>
            <Text style={styles.headerText}>date of birth</Text>
            <Text style={styles.text}>{user.dob || 'N/A'}</Text>
          </View>

          <View style={styles.container}>
            <Text style={styles.headerText}>company detail</Text>
            <View style={styles.innerContainer}>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company name</Text>
                <Text style={styles.text}>{user.company_name || 'N/A'}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company services</Text>
                <Text style={styles.text}>{user.company_services || 'N/A'}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company address</Text>
                <Text style={styles.text}>{user.company_address || 'N/A'}</Text>
              </View>
              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company postcode</Text>
                <Text style={styles.text}>{user.company_postcode || 'N/A'}</Text>
              </View>

              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company helpline</Text>
                <Pressable
                  onPress={() => handlePhone(user.company_helpline)}
                  style={styles.pressables}
                >
                  <Text style={styles.text}>{user.company_helpline || 'N/A'}</Text>
                </Pressable>
              </View>

              <View style={styles.paddedContainer}>
                <Text style={styles.innerHeaderText}>company website</Text>
                <Pressable
                  onPress={() => handleWebsiteCall(user.company_website || '')}
                  style={styles.pressables}
                >
                  <Text style={styles.text}>{user.company_website}</Text>
                </Pressable>
              </View>
            </View>
          </View>

          {/* This part contains the toggle for user to select their  */}
          <View style={[styles.allowNotificationContainer, { borderColor }]}>
            <Text style={[styles.sectionTitle, { color: text }]}>
              Notification Preferences
            </Text>
            <View
              style={[
                styles.notificationButton,
                { backgroundColor: innerBackgroundColor },
              ]}
            >
              <Text style={[styles.innerHeaderText, { color: text }]}>
                allow push notification
              </Text>
              <Switch
                value={allowPushNotification}
                onValueChange={(value) => setAllowPushNotification(value)}
                thumbColor={allowPushNotification ? "green" : "blue"}
                trackColor={{ true: "blue", false: "green" }}
              />
            </View>

            <View
              style={[
                styles.notificationButton,
                { backgroundColor: innerBackgroundColor },
              ]}
            >
              <Text style={[styles.innerHeaderText, { color: text }]}>
                allow email notification
              </Text>
              <Switch
                value={allowEmailNotification}
                onValueChange={(value) => setAllowEmailNotification(value)}
                thumbColor={allowEmailNotification ? "green" : "blue"}
                trackColor={{ true: "blue", false: "green" }}
              />
            </View>

            <View
              style={[
                styles.notificationButton,
                { backgroundColor: innerBackgroundColor },
              ]}
            >
              <Text style={[styles.innerHeaderText, { color: text }]}>
                allow marketing emails
              </Text>
              <Switch
                value={allowMarketingEmails}
                onValueChange={(value) => setAllowMarketingEmails(value)}
                thumbColor={allowMarketingEmails ? "green" : "blue"}
                trackColor={{ true: "blue", false: "green" }}
              />
            </View>
          </View>
        </ScrollView>
      </GestureHandlerRootView>
    </SafeAreaProvider>
  );
};

export default ProfileDisplayComponent;

const styles = StyleSheet.create({
  maincontainer: {
    flex: 1,
    padding: 10,
    marginBottom: 2,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: "#E5E5E5",
    marginBottom: 24,
  },
  profileSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 16,
  },
  nameSection: {
    gap: 4,
  },
  image: {
    width: 60,
    height: 60,
    borderRadius: 30,
    borderWidth: 2,
    borderColor: "#E5E5E5",
  },
  name: {
    fontSize: 20,
    fontWeight: "600",
    fontFamily: "BarlowRegular",
  },
  email: {
    fontSize: 14,
    color: "#666",
    fontFamily: "BarlowLight",
  },
  closeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: "#F5F5F5",
    alignItems: "center",
    justifyContent: "center",
  },
  closeText: {
    fontSize: 16,
    fontWeight: "500",
  },
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    padding: 16,
    alignItems: "flex-start",
    marginVertical: 8,
    backgroundColor: "#FFFFFF",
    borderRadius: 12,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3,
    elevation: 3,
  },
  innerContainer: {
    flexDirection: "column",
    padding: 8,
    gap: 12,
    flex: 1,
  },
  paddedContainer: {
    padding: 8,
    gap: 4,
  },
  pressables: {
    padding: 8,
    backgroundColor: "#F5F5F5",
    borderRadius: 8,
  },
  allowNotificationContainer: {
    padding: 16,
    borderRadius: 12,
    borderWidth: 1,
    marginVertical: 16,
    backgroundColor: "#FFFFFF",
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 16,
    fontFamily: "BarlowRegular",
  },
  notificationButton: {
    padding: 16,
    borderRadius: 8,
    marginVertical: 8,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    backgroundColor: "#F5F5F5",
  },
  headerText: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "BarlowRegular",
    color: "#666",
    textTransform: "capitalize",
  },
  innerHeaderText: {
    fontSize: 15,
    fontWeight: "500",
    fontFamily: "BarlowRegular",
    color: "#333",
    textTransform: "capitalize",
  },
  text: {
    fontSize: 14,
    fontWeight: "400",
    fontFamily: "BarlowLight",
    color: "#333",
  },
});
